import { error } from '@sveltejs/kit';
import { convertToAudioStream, downloadAndStreamVideo } from '$lib/services/converter.js';
import { getVideoInfo } from '$lib/services/youtube.js';

export async function GET({ url }) {
    const videoUrl = url.searchParams.get('url');
    const formatId = url.searchParams.get('format_id') || 'mp3-320';

    if (!videoUrl) return error(400, 'Video URL parameter is required');

    try {
        const info = await getVideoInfo(videoUrl);
        const safeTitle = (info.title || 'audio').replace(/[^a-zA-Z0-9_\-]/g, '_');

        if (formatId === 'mp3-320' || formatId === 'mp3-128') {
            const bitrate = formatId === 'mp3-320' ? '320k' : '128k';

            // Download to /temp_downloads with full thumbnail/metadata embedding
            const { stream } = await convertToAudioStream(videoUrl, bitrate);

            return new Response(stream, {
                headers: {
                    'Content-Type': 'audio/mpeg',
                    'Content-Disposition': `attachment; filename="${safeTitle}.mp3"`,
                    'Cache-Control': 'no-cache'
                }
            });
        }

        // Direct stream video/audio fallback
        const { stream } = await downloadAndStreamVideo(videoUrl, formatId);

        return new Response(stream, {
            headers: {
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': `attachment; filename="${safeTitle}-${formatId}"`,
                'Cache-Control': 'no-cache'
            }
        });

    } catch (err) {
        console.error('Download server error:', err);
        return error(500, 'Failed to process media download');
    }
}