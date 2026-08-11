import { json, error } from '@sveltejs/kit';
import { create } from 'yt-dlp-exec';
import { execSync } from 'node:child_process';

// Dynamically locate yt-dlp path (works across Fedora, Ubuntu, Bun, and Docker)
function getYtDlpBinary() {
    if (process.env.YT_DLP_PATH) return process.env.YT_DLP_PATH;
    try {
        return execSync('which yt-dlp', { encoding: 'utf8' }).trim();
    } catch {
        return 'yt-dlp'; // Fallback to system PATH lookup
    }
}

const ytDlp = create(getYtDlpBinary());

/**
 * Validates basic web URL structure
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
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return h > 0
        ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
        : `${m}:${s.toString().padStart(2, '0')}`;
}

/**
 * Formats raw byte sizes into human-readable MB / GB
 */
function formatSize(bytes) {
    if (!bytes || isNaN(bytes)) return 'Unknown Size';
    const mb = bytes / (1024 * 1024);
    return mb >= 1024 ? `${(mb / 1024).toFixed(2)} GB` : `${mb.toFixed(1)} MB`;
}

/**
 * Estimates MP3 audio filesize dynamically based on duration and bitrate
 */
function estimateAudioSize(durationInSeconds, bitrateKbps) {
    if (!durationInSeconds) return '~5 - 10 MB';
    // Bitrate is in kilobits per second -> convert to bytes per second
    const totalBytes = (bitrateKbps * 1000 / 8) * durationInSeconds;
    return formatSize(totalBytes);
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
        return error(400, 'A valid media URL is required.');
    }

    try {
        // 2. Extract Metadata via yt-dlp
        const info = await ytDlp(url.trim(), {
            dumpSingleJson: true,
            noWarnings: true,
            noCallHome: true,
            youtubeSkipDashManifest: true,
            flatPlaylist: true
        });

        if (!info || !info.id) {
            return error(404, 'Could not extract info from the provided URL.');
        }

        const durationInSeconds = info.duration || 0;

        // 3. Generate Transcoded MP3 Presets with Dynamic File Size Calculation
        const mp3Presets = [
            {
                format_id: 'mp3-320',
                ext: 'mp3',
                resolution: '320 kbps (HQ Audio)',
                filesize: estimateAudioSize(durationInSeconds, 320),
                type: 'audio',
                bitrate: '320',
                isTranscode: true
            },
            {
                format_id: 'mp3-128',
                ext: 'mp3',
                resolution: '128 kbps (Standard)',
                filesize: estimateAudioSize(durationInSeconds, 128),
                type: 'audio',
                bitrate: '128',
                isTranscode: true
            }
        ];

        // 4. Process & Clean Direct Video/Audio Formats
        const rawFormats = (info.formats || [])
            .filter((f) => {
                // Keep common containers and valid audio/video streams
                const validExt = ['mp4', 'm4a', 'webm', 'mp3'].includes(f.ext);
                const hasVideoOrAudio = f.vcodec !== 'none' || f.acodec !== 'none';
                return validExt && hasVideoOrAudio;
            })
            .map((f) => {
                const size = f.filesize || f.filesize_approx;
                const isAudioOnly = f.vcodec === 'none' || f.vcodec === undefined;

                return {
                    format_id: f.format_id,
                    ext: f.ext,
                    resolution: !isAudioOnly ? `${f.height || 'HD'}p` : 'Audio Stream',
                    height: f.height || 0,
                    filesize: formatSize(size),
                    type: isAudioOnly ? 'audio' : 'video',
                    isTranscode: false
                };
            })
            // Sort video streams by quality/resolution descending
            .sort((a, b) => b.height - a.height);

        // Combine Transcoded Audio Presets first, followed by direct video/audio formats
        const allFormats = [...mp3Presets, ...rawFormats];

        // Pick highest resolution thumbnail available
        const bestThumbnail =
            info.thumbnails?.filter((t) => t.url)?.slice(-1)[0]?.url ||
            info.thumbnail ||
            '';

        return json({
            success: true,
            id: info.id,
            title: info.title || 'Untitled Track',
            artist: info.artist || info.creator || info.uploader || info.channel || 'Unknown Artist',
            album: info.album || 'Single',
            track: info.track || info.title || 'Track',
            thumbnail: bestThumbnail,
            duration: formatDuration(durationInSeconds),
            duration_raw: durationInSeconds,
            formats: allFormats
        });

    } catch (err) {
        console.error('[yt-dlp Extraction Error]:', err?.stderr || err?.message || err);

        const errorMessage = err?.stderr?.includes('Video unavailable')
            ? 'The video is private, deleted, or region-restricted.'
            : 'Failed to extract media information from URL.';

        return error(500, errorMessage);
    }
}