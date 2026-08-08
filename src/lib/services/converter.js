import { spawn } from 'child_process';
import { existsSync, mkdirSync, unlinkSync, createReadStream } from 'fs';
import { join, resolve } from 'path';

const YT_DLP_PATH = '/usr/bin/yt-dlp';
const FFMPEG_PATH = '/usr/bin/ffmpeg';
const TEMP_DIR = resolve('./temp_downloads');

// Ensure the temp_downloads folder exists at startup
if (!existsSync(TEMP_DIR)) {
    mkdirSync(TEMP_DIR, { recursive: true });
}

/**
 * Schedules auto-deletion of a local file after specified milliseconds (default: 10 mins)
 */
function scheduleFileCleanup(filePath, delayMs = 10 * 60 * 1000) {
    setTimeout(() => {
        if (existsSync(filePath)) {
            try {
                unlinkSync(filePath);
                console.log(`[Cleanup] Deleted temporary file: ${filePath}`);
            } catch (err) {
                console.error(`[Cleanup Error] Failed to delete file ${filePath}:`, err);
            }
        }
    }, delayMs);
}

/**
 * Downloads raw video or audio format to temp_downloads, schedules deletion in 10 mins, 
 * and returns a readable stream.
 */
export async function downloadAndStreamVideo(videoUrl, formatId = 'bestvideo+bestaudio/best') {
    const timestamp = Date.now();
    const outputPattern = join(TEMP_DIR, `media_${timestamp}_%(id)s.%(ext)s`);

    return new Promise((resolvePromise, reject) => {
        const ytProcess = spawn(YT_DLP_PATH, [
            '-f', formatId,
            '-o', outputPattern,
            '--no-playlist',
            '--no-warnings',
            '--print', 'after_move:filepath', // Outputs exact saved filepath to stdout
            videoUrl
        ]);

        let downloadedFilePath = '';

        ytProcess.stdout.on('data', (data) => {
            downloadedFilePath += data.toString().trim();
        });

        ytProcess.stderr.on('data', (data) => console.error(`yt-dlp stderr: ${data}`));

        ytProcess.on('close', (code) => {
            if (code !== 0 || !downloadedFilePath || !existsSync(downloadedFilePath)) {
                return reject(new Error('Failed to download media file'));
            }

            // Schedule file deletion after 10 minutes (600,000 ms)
            scheduleFileCleanup(downloadedFilePath, 10 * 60 * 1000);

            // Return file stream and filepath info
            const fileStream = createReadStream(downloadedFilePath);
            resolvePromise({
                stream: fileStream,
                filePath: downloadedFilePath
            });
        });
    });
}

/**
 * Downloads audio locally to temp_downloads with full ID3 tags & artwork via yt-dlp, 
 * schedules deletion in 10 minutes, and returns a readable stream.
 */
export async function convertToAudioStream(videoUrl, bitrate = '320k') {
    const timestamp = Date.now();
    const outputFile = join(TEMP_DIR, `audio_${timestamp}.mp3`);

    return new Promise((resolvePromise, reject) => {
        const args = [
            videoUrl,
            '-x',                             // Extract audio
            '--audio-format', 'mp3',          // Transcode to MP3
            '--audio-quality', bitrate,       // Target bitrate (320k or 128k)
            '--embed-thumbnail',              // Embed high-res cover art thumbnail
            '--add-metadata',                 // Write title, artist, and album tags
            '--ffmpeg-location', FFMPEG_PATH,
            '--no-playlist',
            '--no-warnings',
            '-o', outputFile
        ];

        const ytProcess = spawn(YT_DLP_PATH, args);

        ytProcess.stderr.on('data', (data) => console.error(`yt-dlp/ffmpeg stderr: ${data}`));

        ytProcess.on('close', (code) => {
            if (code !== 0 || !existsSync(outputFile)) {
                return reject(new Error('Failed to convert and process MP3 audio'));
            }

            // Schedule file deletion after 10 minutes
            scheduleFileCleanup(outputFile, 10 * 60 * 1000);

            const fileStream = createReadStream(outputFile);
            resolvePromise({
                stream: fileStream,
                filePath: outputFile
            });
        });
    });
}