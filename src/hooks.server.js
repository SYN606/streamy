import fs from 'node:fs';
import path from 'node:path';
import { initCleanupScheduler } from '$lib/services/cleanup.js';

const TEMP_DIR = path.resolve('temp_downloads');

function clearTempDirectory() {
    try {
        if (fs.existsSync(TEMP_DIR)) {
            fs.rmSync(TEMP_DIR, { recursive: true, force: true });
            console.log(`[Startup] Cleared existing temporary folder: ${TEMP_DIR}`);
        }

        fs.mkdirSync(TEMP_DIR, { recursive: true });
        console.log(`[Startup] Created clean temporary folder: ${TEMP_DIR}`);
    } catch (error) {
        console.error('[Startup] Failed to clear temp_downloads folder:', error);
    }
}

// 1. Clear folder on application boot
clearTempDirectory();

// 2. Start recurring 10-minute backup cleanup interval
initCleanupScheduler();

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
    return resolve(event);
}