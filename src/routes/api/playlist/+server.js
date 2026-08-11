import { json, error } from '@sveltejs/kit';
import ytDlp from 'yt-dlp-exec';

/**
 * Validates web URL structure
 */
function isValidUrl(string) {
    try {
        const url = new URL(string);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
}

/**
 * Formats seconds into HH:MM:SS or MM:SS
 */
function formatDuration(seconds) {
    if (!seconds || isNaN(seconds)) return 'N/A';
    const totalSeconds = Math.floor(seconds);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = Math.floor(totalSeconds % 60);

    return h > 0
        ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
        : `${m}:${s.toString().padStart(2, '0')}`;
}

export async function POST({ request }) {
    let body;
    try {
        body = await request.json();
    } catch {
        return error(400, 'Invalid JSON payload.');
    }

    const { url } = body;

    // 1. Input Validation
    if (!url || typeof url !== 'string' || !isValidUrl(url.trim())) {
        return error(400, 'A valid playlist URL is required.');
    }

    try {
        // 2. Fetch Playlist Metadata (lightweight extraction)
        const info = await ytDlp(url.trim(), {
            dumpSingleJson: true,
            flatPlaylist: true,
            noWarnings: true,
            noCallHome: true
        });

        if (!info) {
            return error(404, 'Could not retrieve playlist metadata.');
        }

        // 3. Process Playlist Entries
        const entries = (info.entries || []).map((item, index) => {
            const videoId = item.id || item.url;
            const fullUrl = item.url && item.url.startsWith('http')
                ? item.url
                : `https://www.youtube.com/watch?v=${videoId}`;

            // Pick highest resolution thumbnail available for the entry
            const thumbnail =
                item.thumbnails?.slice(-1)[0]?.url ||
                `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

            return {
                id: videoId || index,
                title: item.title || 'Untitled Video',
                duration: formatDuration(item.duration),
                duration_raw: item.duration || 0,
                url: fullUrl,
                uploader: item.uploader || item.channel || info.uploader || info.channel || 'Unknown Artist',
                thumbnail
            };
        });

        // 4. Extract Main Playlist Thumbnail
        const playlistThumbnail =
            info.thumbnails?.slice(-1)[0]?.url ||
            entries[0]?.thumbnail ||
            '';

        return json({
            success: true,
            title: info.title || info.playlist_title || 'YouTube Playlist',
            uploader: info.uploader || info.channel || info.uploader_id || 'Various Artists',
            thumbnail: playlistThumbnail,
            totalCount: entries.length,
            entries
        });

    } catch (err) {
        console.error('[yt-dlp Playlist Extraction Error]:', err?.stderr || err?.message || err);

        const errorMessage = err?.stderr?.includes('Playlist does not exist')
            ? 'The requested playlist is private, deleted, or does not exist.'
            : 'Failed to process playlist URL.';

        return error(500, errorMessage);
    }
}