import { create } from 'yt-dlp-exec';
import { execSync } from 'node:child_process';

// Dynamically locate yt-dlp binary across OS/Docker environments
function getBinaryPath() {
    if (process.env.YT_DLP_PATH) return process.env.YT_DLP_PATH;
    try {
        return execSync('which yt-dlp', { encoding: 'utf8' }).trim();
    } catch {
        return 'yt-dlp'; // Fallback to system PATH lookup
    }
}

const ytDlp = create(getBinaryPath());

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

/**
 * Formats byte values into human-readable strings (MB/GB)
 */
function formatSize(bytes) {
    if (!bytes || isNaN(bytes)) return 'Unknown';
    const mb = bytes / (1024 * 1024);
    return mb >= 1024
        ? `${(mb / 1024).toFixed(2)} GB`
        : `${mb.toFixed(1)} MB`;
}

/**
 * Calculates estimated MP3 size based on duration and bitrate
 */
function estimateMp3Size(durationSeconds, bitrateKbps) {
    if (!durationSeconds || isNaN(durationSeconds)) return 'Variable';
    // Bitrate in kbps / 8 = KB per second * duration
    const bytes = (bitrateKbps * 1000 / 8) * durationSeconds;
    return formatSize(bytes);
}

/**
 * Extracts metadata and format options for a single video URL.
 */
export async function getVideoInfo(url) {
    if (!url || typeof url !== 'string') {
        throw new Error('A valid video URL is required.');
    }

    try {
        const info = await ytDlp(url.trim(), {
            dumpSingleJson: true,
            noWarnings: true,
            noCallHome: true,
            youtubeSkipDashManifest: true
        });

        if (!info) {
            throw new Error('Unable to fetch metadata from the provided URL.');
        }

        const durationInSeconds = info.duration || 0;

        // Raw audio and combined video streams served by YouTube
        const rawFormats = (info.formats || [])
            .filter((f) => {
                // Keep relevant formats with known extensions or common stream types
                return f.ext && ['mp4', 'm4a', 'webm', '3gp'].includes(f.ext);
            })
            .map((f) => {
                const isAudioOnly = f.vcodec === 'none' || !f.vcodec;
                const height = f.height || (f.resolution ? parseInt(f.resolution) : null);

                return {
                    format_id: f.format_id,
                    ext: f.ext,
                    resolution: isAudioOnly ? 'Audio Stream' : (height ? `${height}p` : 'HD Video'),
                    filesize: formatSize(f.filesize || f.filesize_approx),
                    type: isAudioOnly ? 'audio' : 'video',
                    isTranscode: false,
                    fps: f.fps || null
                };
            })
            .reverse();

        // High quality MP3 conversion options with dynamic size estimation
        const mp3Presets = [
            {
                format_id: 'mp3-320',
                ext: 'mp3',
                resolution: '320 kbps (HQ Audio)',
                filesize: estimateMp3Size(durationInSeconds, 320),
                type: 'audio',
                bitrate: '320k',
                isTranscode: true
            },
            {
                format_id: 'mp3-128',
                ext: 'mp3',
                resolution: '128 kbps (Standard)',
                filesize: estimateMp3Size(durationInSeconds, 128),
                type: 'audio',
                bitrate: '128k',
                isTranscode: true
            }
        ];

        // Select highest resolution thumbnail available
        const bestThumbnail =
            info.thumbnails?.slice(-1)[0]?.url ||
            info.thumbnail ||
            `https://i.ytimg.com/vi/${info.id}/hqdefault.jpg`;

        return {
            id: info.id,
            title: info.title || 'Untitled Track',
            artist: info.artist || info.creator || info.uploader || info.channel || 'Unknown Artist',
            album: info.album || info.title || 'Single',
            thumbnail: bestThumbnail,
            duration: formatDuration(durationInSeconds),
            duration_raw: durationInSeconds,
            uploader: info.uploader || info.channel || 'Unknown Channel',
            formats: [...mp3Presets, ...rawFormats]
        };
    } catch (err) {
        console.error('[getVideoInfo Error]:', err?.stderr || err?.message || err);
        throw new Error('Failed to retrieve video details. Please verify the URL.');
    }
}

/**
 * Extracts playlist items without downloading media files.
 */
export async function getPlaylistInfo(url) {
    if (!url || typeof url !== 'string') {
        throw new Error('A valid playlist URL is required.');
    }

    try {
        const info = await ytDlp(url.trim(), {
            dumpSingleJson: true,
            flatPlaylist: true,
            noWarnings: true,
            noCallHome: true
        });

        if (!info) {
            throw new Error('Unable to fetch playlist metadata.');
        }

        const entries = (info.entries || []).map((item, index) => {
            const videoId = item.id || item.url;
            const fullUrl = item.url && item.url.startsWith('http')
                ? item.url
                : `https://www.youtube.com/watch?v=${videoId}`;

            return {
                id: videoId || index,
                title: item.title || 'Untitled Track',
                duration: formatDuration(item.duration),
                duration_raw: item.duration || 0,
                url: fullUrl,
                uploader: item.uploader || item.channel || info.uploader || info.channel || 'Unknown Artist',
                thumbnail: item.thumbnails?.slice(-1)[0]?.url || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
            };
        });

        return {
            title: info.title || info.playlist_title || 'YouTube Playlist',
            uploader: info.uploader || info.channel || 'Various Artists',
            totalCount: entries.length,
            entries
        };
    } catch (err) {
        console.error('[getPlaylistInfo Error]:', err?.stderr || err?.message || err);
        throw new Error('Failed to retrieve playlist details. Check if the playlist is public.');
    }
}