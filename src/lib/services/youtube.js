import { create } from 'yt-dlp-exec';

// Bind explicitly to Fedora system binary
const ytDlp = create('/usr/bin/yt-dlp');

/**
 * Extracts metadata and format options for a single video URL.
 */
export async function getVideoInfo(url) {
    if (!url) throw new Error('Video URL is required');

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

    // Helper to format bytes into MB or GB
    const formatSize = (bytes) => {
        if (!bytes) return 'Unknown';
        const mb = bytes / (1024 * 1024);
        return mb >= 1024
            ? `${(mb / 1024).toFixed(2)} GB`
            : `${mb.toFixed(1)} MB`;
    };

    // Raw streams served by YouTube
    const rawFormats = (info.formats || [])
        .filter((f) => ['mp4', 'm4a', 'webm', 'mp3'].includes(f.ext))
        .map((f) => {
            const isAudio = f.vcodec === 'none' || f.vcodec === undefined;
            return {
                format_id: f.format_id,
                ext: f.ext,
                resolution: !isAudio ? `${f.height || 'HD'}p` : 'Audio Stream',
                filesize: formatSize(f.filesize || f.filesize_approx),
                type: isAudio ? 'audio' : 'video',
                isTranscode: false
            };
        })
        .reverse();

    // High quality MP3 conversion options with ID3 tagging support
    const mp3Presets = [
        {
            format_id: 'mp3-320',
            ext: 'mp3',
            resolution: '320 kbps (HQ Audio)',
            filesize: '~8 - 12 MB',
            type: 'audio',
            bitrate: '320k',
            isTranscode: true
        },
        {
            format_id: 'mp3-128',
            ext: 'mp3',
            resolution: '128 kbps (Standard)',
            filesize: '~3 - 5 MB',
            type: 'audio',
            bitrate: '128k',
            isTranscode: true
        }
    ];

    // Select highest resolution thumbnail available for album art
    const bestThumbnail = info.thumbnails?.slice(-1)[0]?.url || info.thumbnail || '';

    return {
        id: info.id,
        title: info.title || 'Untitled Track',
        artist: info.artist || info.creator || info.uploader || 'Unknown Artist',
        album: info.album || info.title || 'Single',
        thumbnail: bestThumbnail,
        duration: formatDuration(info.duration),
        uploader: info.uploader || 'Unknown Channel',
        formats: [...mp3Presets, ...rawFormats]
    };
}

/**
 * Extracts playlist items without downloading media files.
 */
export async function getPlaylistInfo(url) {
    if (!url) throw new Error('Playlist URL is required');

    const info = await ytDlp(url, {
        dumpSingleJson: true,
        flatPlaylist: true,
        noWarnings: true
    });

    const entries = (info.entries || []).map((item, index) => ({
        id: item.id || index,
        title: item.title || 'Untitled Track',
        duration: item.duration ? `${Math.floor(item.duration / 60)}:${(item.duration % 60).toString().padStart(2, '0')}` : 'N/A',
        url: item.url || `https://www.youtube.com/watch?v=${item.id}`,
        uploader: item.uploader || info.uploader || 'Unknown Artist'
    }));

    return {
        title: info.title || 'YouTube Playlist',
        uploader: info.uploader || 'Various Artists',
        totalCount: entries.length,
        entries
    };
}