import { spawn, execSync } from 'node:child_process';
import { existsSync, mkdirSync, unlinkSync, createReadStream } from 'node:fs';
import { join, resolve } from 'node:path';
import { Readable } from 'node:stream';

// Dynamically locate yt-dlp & ffmpeg binaries across OS/environments
function getBinaryPath(binaryName, envOverride) {
    if (envOverride) return envOverride;
    try {
        return execSync(`which ${binaryName}`, { encoding: 'utf8' }).trim();
    } catch {
        return binaryName; 
    }
}

const YT_DLP_PATH = getBinaryPath('yt-dlp', process.env.YT_DLP_PATH);
const FFMPEG_PATH = getBinaryPath('ffmpeg', process.env.FFMPEG_PATH);
const TEMP_DIR = resolve('./temp_downloads');

// Ensure the temp_downloads folder exists at startup
if (!existsSync(TEMP_DIR)) {
    mkdirSync(TEMP_DIR, { recursive: true });
}

/**
 * Schedules auto-deletion of a local file after specified milliseconds (default: 10 mins).
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
 * Safely creates a Web ReadableStream from a node file stream 
 * and handles cleanup when stream closes.
 */
function createWebFileStream(filePath) {
    const nodeStream = createReadStream(filePath);

    // Automatically attempt cleanup on stream close
    nodeStream.on('close', () => {
        setTimeout(() => scheduleFileCleanup(filePath, 30 * 1000), 1000);
    });

    return Readable.toWeb(nodeStream);
}

/**
 * Downloads video and guarantees MP4 container format output.
 */
export async function downloadAndStreamVideo(videoUrl, formatId = 'mp4-1080') {
    const timestamp = Date.now();
    const outputPattern = join(TEMP_DIR, `media_${timestamp}_%(id)s.%(ext)s`);

    // Route predefined formats or fallback to a compatible format selector
    let formatSpec = 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best';

    if (formatId === 'mp4-compact' || formatId === 'worst') {
        formatSpec = 'worstvideo[ext=mp4]+worstaudio[ext=m4a]/worst';
    } else if (formatId && !formatId.startsWith('mp4-')) {
        formatSpec = formatId;
    }

    return new Promise((resolvePromise, reject) => {
        const ytProcess = spawn(YT_DLP_PATH, [
            '-f', formatSpec,
            '--merge-output-format', 'mp4',
            '--recode-video', 'mp4',
            '--ffmpeg-location', FFMPEG_PATH,
            '-o', outputPattern,
            '--no-playlist',
            '--no-warnings',
            '--print', 'after_move:filepath',
            videoUrl
        ]);

        let stdoutBuffer = '';

        ytProcess.stdout.on('data', (data) => {
            stdoutBuffer += data.toString();
        });

        ytProcess.stderr.on('data', (data) => {
            console.error(`[yt-dlp stderr]: ${data}`);
        });

        ytProcess.on('close', (code) => {
            const lines = stdoutBuffer.trim().split('\n').filter(Boolean);
            const downloadedFilePath = lines[lines.length - 1];

            if (code !== 0 || !downloadedFilePath || !existsSync(downloadedFilePath)) {
                return reject(new Error(`Failed to download MP4 media file. Code: ${code}`));
            }

            scheduleFileCleanup(downloadedFilePath, 10 * 60 * 1000);
            const fileStream = createWebFileStream(downloadedFilePath);

            resolvePromise({
                stream: fileStream,
                filePath: downloadedFilePath
            });
        });

        ytProcess.on('error', (err) => {
            reject(new Error(`Failed to spawn yt-dlp process: ${err.message}`));
        });
    });
}

/**
 * Downloads audio locally with ID3 tags & artwork converted strictly to MP3.
 */
export async function convertToAudioStream(videoUrl, bitrate = '320k') {
    const timestamp = Date.now();
    const outputFile = join(TEMP_DIR, `audio_${timestamp}.mp3`);

    // Handle string key mapping (e.g., 'mp3-128' -> '128k')
    const targetBitrate = bitrate === 'mp3-128' ? '128k' : (bitrate === 'mp3-320' ? '320k' : bitrate);

    return new Promise((resolvePromise, reject) => {
        const args = [
            videoUrl,
            '-x',
            '--audio-format', 'mp3',
            '--audio-quality', targetBitrate,
            '--embed-thumbnail',
            '--add-metadata',
            '--ffmpeg-location', FFMPEG_PATH,
            '--no-playlist',
            '--no-warnings',
            '-o', outputFile
        ];

        const ytProcess = spawn(YT_DLP_PATH, args);

        ytProcess.stderr.on('data', (data) => {
            console.error(`[yt-dlp/ffmpeg stderr]: ${data}`);
        });

        ytProcess.on('close', (code) => {
            if (code !== 0 || !existsSync(outputFile)) {
                return reject(new Error(`Failed to convert MP3 audio. Exit code: ${code}`));
            }

            scheduleFileCleanup(outputFile, 10 * 60 * 1000);
            const fileStream = createWebFileStream(outputFile);

            resolvePromise({
                stream: fileStream,
                filePath: outputFile
            });
        });

        ytProcess.on('error', (err) => {
            reject(new Error(`Failed to spawn audio conversion process: ${err.message}`));
        });
    });
}