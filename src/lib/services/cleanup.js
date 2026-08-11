import fs from 'node:fs';
import path from 'node:path';

const TEMP_DIR = path.resolve('temp_downloads');
const MAX_FILE_AGE_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Sweeps the temporary directory and removes files older than 10 minutes
 */
export function cleanupTempFolder() {
    if (!fs.existsSync(TEMP_DIR)) return;

    fs.readdir(TEMP_DIR, (err, files) => {
        if (err) {
            console.error('[Cleanup Service] Failed to read temp directory:', err);
            return;
        }

        const now = Date.now();

        for (const file of files) {
            const filePath = path.join(TEMP_DIR, file);

            fs.stat(filePath, (statErr, stats) => {
                if (statErr) return;

                // Remove files modified longer than 10 minutes ago
                if (now - stats.mtimeMs > MAX_FILE_AGE_MS) {
                    fs.unlink(filePath, (unlinkErr) => {
                        if (!unlinkErr) {
                            console.log(`[Cleanup Service] Auto-deleted old temp file: ${file}`);
                        }
                    });
                }
            });
        }
    });
}

let isInitialized = false;

export function initCleanupScheduler() {
    if (isInitialized) return;
    isInitialized = true;

    console.log('[Cleanup Service] Auto-cleanup scheduler active (runs every 10 mins).');

    // Interval set to run every 10 minutes
    setInterval(() => {
        cleanupTempFolder();
    }, 10 * 60 * 1000);
}