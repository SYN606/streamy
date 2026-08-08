import { json, error } from '@sveltejs/kit';
import ytDlp from 'yt-dlp-exec';

export async function POST({ request }) {
    const { url } = await request.json();

    if (!url) {
        throw error(400, 'Playlist URL is required');
    }

    try {
        const info = await ytDlp(url, {
            dumpSingleJson: true,
            flatPlaylist: true,
            noWarnings: true
        });

        const entries = (info.entries || []).map((item, index) => ({
            id: item.id || index,
            title: item.title || 'Untitled Video',
            duration: item.duration ? `${Math.floor(item.duration / 60)}:${(item.duration % 60).toString().padStart(2, '0')}` : 'N/A',
            url: item.url || `https://www.youtube.com/watch?v=${item.id}`,
            uploader: item.uploader || info.uploader || 'Unknown Artist'
        }));

        return json({
            title: info.title || 'YouTube Playlist',
            uploader: info.uploader || 'Various Artists',
            totalCount: entries.length,
            entries
        });
    } catch (err) {
        console.error(err);
        throw error(500, 'Failed to process playlist URL');
    }
}