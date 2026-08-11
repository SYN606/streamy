import { error, json } from '@sveltejs/kit';
import { convertToAudioStream, downloadAndStreamVideo } from '$lib/services/converter.js';
import { getVideoInfo } from '$lib/services/youtube.js';

/**
 * Sanitizes titles for standard filenames while creating an RFC 5987 encoded variant for modern browsers.
 */
function formatFilenameHeaders(rawTitle, extension) {
    const baseTitle = rawTitle || 'media_download';

    const asciiTitle = baseTitle
        .replace(/[^\x20-\x7E]/g, '')
        .replace(/[/\\?%*:|"<>]/g, '_')
        .replace(/\s+/g, '_')
        .replace(/["\\]/g, '_')
        .trim() || 'media_download';

    const filename = `${asciiTitle}.${extension}`;

    const encodedTitle = encodeURIComponent(`${baseTitle}.${extension}`)
        .replace(/['()]/g, escape)
        .replace(/\*/g, '%2A');

    return `attachment; filename="${filename}"; filename*=UTF-8''${encodedTitle}`;
}

/**
 * Maps format IDs to accurate MIME types and extensions.
 */
function getFormatMetadata(formatId) {
    if (formatId.startsWith('mp3') || formatId.includes('audio')) {
        return { mimeType: 'audio/mpeg', ext: 'mp3' };
    }
    if (formatId.includes('aac') || formatId.includes('m4a')) {
        return { mimeType: 'audio/mp4', ext: 'm4a' };
    }
    if (formatId.includes('webm')) {
        return { mimeType: 'video/webm', ext: 'webm' };
    }
    // Default video fallback (Guaranteed MP4 from converter)
    return { mimeType: 'video/mp4', ext: 'mp4' };
}

export async function GET({ url }) {
    const videoUrl = url.searchParams.get('url');
    const formatId = url.searchParams.get('format_id') || 'mp3-320';

    // 1. Validate Input
    if (!videoUrl) {
        return error(400, 'Video URL parameter is required.');
    }

    try {
        // 2. Fetch Video Metadata
        const info = await getVideoInfo(videoUrl);

        if (!info || !info.title) {
            return error(404, 'Could not retrieve video information. The video may be private or removed.');
        }

        const { mimeType, ext } = getFormatMetadata(formatId);
        const disposition = formatFilenameHeaders(info.title, ext);

        // Common robust headers for media streaming
        const headers = new Headers({
            'Content-Type': mimeType,
            'Content-Disposition': disposition,
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            'Accept-Ranges': 'bytes'
        });

        // Add file size if reported by yt-dlp info
        if (info.filesize || info.filesize_approx) {
            headers.set('Content-Length', String(info.filesize || info.filesize_approx));
        }

        // 3. Audio Extraction Flow (MP3 High Quality / Standard)
        if (formatId.startsWith('mp3') || formatId === 'bestaudio/best') {
            const bitrate = formatId === 'mp3-128' ? '128k' : '320k';
            const { stream } = await convertToAudioStream(videoUrl, bitrate);

            if (!stream) {
                throw new Error('Audio conversion pipeline returned an empty stream.');
            }

            return new Response(stream, { status: 200, headers });
        }

        // 4. Video / Alternative Format Flow (Passes formatId directly to enforce MP4 remuxing)
        const { stream } = await downloadAndStreamVideo(videoUrl, formatId);

        if (!stream) {
            throw new Error('Video streaming pipeline returned an empty stream.');
        }

        return new Response(stream, { status: 200, headers });

    } catch (err) {
        console.error(`[Download Engine Error] Failed processing: ${videoUrl} | Format: ${formatId}`, err);

        return json(
            {
                success: false,
                message: err.message || 'Failed to process media download.',
                url: videoUrl,
                format: formatId
            },
            { status: 500 }
        );
    }
}