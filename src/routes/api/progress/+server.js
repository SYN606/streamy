import { spawn } from 'node:child_process';

/** @type {import('./$types').RequestHandler} */
export function GET({ url }) {
    const videoUrl = url.searchParams.get('url');
    const format = url.searchParams.get('format') || 'best';

    if (!videoUrl) {
        return new Response('Missing required "url" parameter.', { status: 400 });
    }

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        start(controller) {
            // Helper to safely write SSE messages
            const sendSSE = (data) => {
                try {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
                } catch {
                    // Controller might already be closed
                }
            };

            // Download to temporary null sink or pipe without polluting stdout text
            const childProcess = spawn('yt-dlp', [
                '--newline',
                '--progress',
                '--progress-template', 'download:%(progress.downloaded_bytes)s/%(progress.total_bytes)s:%(progress._percent_str)s',
                '-f', format,
                '-o', '-', // Output to stream
                videoUrl
            ]);

            let buffer = '';

            // Handle progress text from stderr (yt-dlp sends progress info to stderr when outputting binary to stdout)
            childProcess.stderr.on('data', (chunk) => {
                buffer += chunk.toString();
                const lines = buffer.split('\n');

                // Keep incomplete last line in the buffer
                buffer = lines.pop() || '';

                for (const line of lines) {
                    // Extract progress matching template or fallback regex
                    const match = line.match(/download:.*?:?\s*(\d+\.?\d*)%/);

                    if (match && match[1]) {
                        const percent = parseFloat(match[1]);
                        sendSSE({ percent, status: 'downloading' });
                    }
                }
            });

            childProcess.on('close', (code) => {
                if (code === 0) {
                    sendSSE({ percent: 100, done: true, status: 'complete' });
                } else {
                    sendSSE({ error: `yt-dlp exited with code ${code}`, status: 'failed' });
                }
                try { controller.close(); } catch { }
            });

            childProcess.on('error', (err) => {
                sendSSE({ error: err.message, status: 'failed' });
                try { controller.close(); } catch { }
            });
        },

        // Clean up process if the client closes the connection or navigates away
        cancel() {
            if (childProcess && !childProcess.killed) {
                childProcess.kill('SIGTERM');
            }
        }
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
            'X-Accel-Buffering': 'no' // Prevents Nginx from buffering SSE responses
        }
    });
}