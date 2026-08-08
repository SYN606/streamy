import { json, error } from '@sveltejs/kit';
import { create } from 'yt-dlp-exec';

// Bind to Fedora's system binary path
const ytDlp = create('/usr/bin/yt-dlp');

export async function POST({ request }) {
    let body;
    try {
        body = await request.json();
    } catch {
        return error(400, 'Invalid JSON body');
    }

    const { url } = body;

    if (!url) {
        return error(400, 'Video URL is required');
    }

    try {
        const info = await ytDlp(url, {
            dumpSingleJson: true,
            noWarnings: true,
            noCallHome: true,
            youtubeSkipDashManifest: true
        });

        // Format duration into MM:SS or HH:MM:SS
        const formatDuration = (seconds) => {
            if (!seconds) return 'N/A';
            const h = Math.floor(seconds / 3600);
            const m = Math.floor((seconds % 3600) / 60);
            const s = Math.floor(seconds % 60);
            return h > 0
                ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
                : `${m}:${s.toString().padStart(2, '0')}`;
        };

        // Format raw bytes into human-readable MB/GB
        const formatSize = (bytes) => {
            if (!bytes) return 'Unknown';
            const mb = bytes / (1024 * 1024);
            return mb >= 1024
                ? `${(mb / 1024).toFixed(2)} GB`
                : `${mb.toFixed(1)} MB`;
        };

        // Standard raw stream formats served by YouTube
        const rawFormats = (info.formats || [])
            .filter((f) => f.ext === 'mp4' || f.ext === 'm4a' || f.ext === 'webm' || f.ext === 'mp3')
            .map((f) => {
                const size = f.filesize || f.filesize_approx;
                const isAudioOnly = f.vcodec === 'none' || f.vcodec === undefined;

                return {
                    format_id: f.format_id,
                    ext: f.ext,
                    resolution: !isAudioOnly ? `${f.height || 'HD'}p` : 'Audio Stream',
                    filesize: formatSize(size),
                    type: isAudioOnly ? 'audio' : 'video',
                    isTranscode: false
                };
            })
            .reverse();

        // High quality transcoded MP3 presets (Requires ffmpeg processing on download)
        const mp3Presets = [
            {
                format_id: 'mp3-320',
                ext: 'mp3',
                resolution: '320 kbps (HQ Audio)',
                filesize: '~8 - 12 MB',
                type: 'audio',
                bitrate: '320',
                isTranscode: true
            },
            {
                format_id: 'mp3-128',
                ext: 'mp3',
                resolution: '128 kbps (Standard)',
                filesize: '~3 - 5 MB',
                type: 'audio',
                bitrate: '128',
                isTranscode: true
            }
        ];

        // Combine MP3 presets at top followed by standard video/audio streams
        const allFormats = [...mp3Presets, ...rawFormats];

        // Pick highest resolution artwork available
        const bestThumbnail = info.thumbnails?.slice(-1)[0]?.url || info.thumbnail || '';

        return json({
            id: info.id,
            title: info.title || 'Untitled Track',
            artist: info.artist || info.creator || info.uploader || 'Unknown Artist',
            album: info.album || info.title || 'Single',
            track: info.track || info.title || 'Track',
            thumbnail: bestThumbnail,
            duration: formatDuration(info.duration),
            formats: allFormats
        });
    } catch (err) {
        if (err?.status) throw err;

        console.error('yt-dlp execution error:', err);
        return error(500, 'Failed to extract media information');
    }
}