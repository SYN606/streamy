import { spawn } from 'child_process';

/** @type {import('./$types').RequestHandler} */
export function GET({ url }) {
    const videoUrl = url.searchParams.get('url');
    const format = url.searchParams.get('format') || 'best';

    if (!videoUrl) {
        return new Response('Missing URL', { status: 400 });
    }

    const stream = new ReadableStream({
        start(controller) {
            // Spawn yt-dlp with newline progress flags
            const process = spawn('yt-dlp', [
                '--newline',
                '--progress',
                '-f', format,
                '-o', '-',
                videoUrl
            ]);

            // Parse progress output from stderr/stdout
            process.stderr.on('data', (chunk) => {
                const text = chunk.toString();

                // Extract percentage using regex (e.g., [download]  42.5% of ~12.50MiB)
                const match = text.match(/\[download\]\s+(\d+\.\d+)%/);
                if (match) {
                    const percent = parseFloat(match[1]);
                    controller.enqueue(`data: ${JSON.stringify({ percent })}\n\n`);
                }
            });

            process.on('close', (code) => {
                controller.enqueue(`data: ${JSON.stringify({ percent: 100, done: true, code })}\n\n`);
                controller.close();
            });

            process.on('error', (err) => {
                controller.enqueue(`data: ${JSON.stringify({ error: err.message })}\n\n`);
                controller.close();
            });
        }
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        }
    });
}