# ⚡ Streamy — High-Speed Media Extractor

Streamy is a modern, lightweight, and high-performance web application built with **SvelteKit** and powered by **`yt-dlp`**. It provides a sleek user interface with real-time **Server-Sent Events (SSE)** download progress streaming for extracting YouTube videos, audio tracks, and full playlists without ads or trackers.

![SvelteKit](https://img.shields.io/badge/SvelteKit-FF3E00?style=for-the-badge&logo=svelte&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38BDF8?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![yt-dlp](https://img.shields.io/badge/Engine-yt--dlp-red?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)

## ✨ Features

- 🎥 **Single Media Extractor:** Convert YouTube video and audio links instantly with custom quality/format selection (MP3, MP4, WebM, AAC).
- 🎵 **Batch Playlist Extractor:** Process full playlists and albums, select individual tracks, and batch download in sequential streams.
- ⚡ **Real-Time SSE Progress Bar:** Monitor instant download percentage, throughput, and status updates via Server-Sent Events.
- 🎨 **Glassmorphism UI:** Built with Tailwind CSS, supporting modern animations, reactive runes, and crisp icon fallbacks.
- 🛡️ **Privacy First & Ad-Free:** Zero telemetry, no intrusive popup ads, and download history saved strictly in client local storage (`localStorage`).


## 🛠️ Tech Stack

- **Framework:** SvelteKit (Svelte 5 Runes)
- **Styling:** Tailwind CSS + Glassmorphism Styling
- **Icons:** `svelte-icons-pack` (Lucide Icons)
- **Backend Engine:** `yt-dlp` + Node.js SSE Stream Handler


## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your host machine:

- **Node.js** (v18 or higher)
- **npm** or **pnpm**
- **python3** & **yt-dlp** (required for backend media extraction)

```bash
# Verify yt-dlp installation
yt-dlp --version

```

---

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/syn606/streamy
cd streamy

```


2. **Install dependencies:**
```bash
npm install

```


3. **Start the local development server:**
```bash
npm run dev

```


4. Open your browser and navigate to `http://localhost:5173`.

---


## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE.md) for more information.
