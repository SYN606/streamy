# 🚀 Deployment Guide — Streamy

This document provides step-by-step instructions for deploying Streamy using **Bun** on a Linux production server (Ubuntu/Debian) or inside a lightweight Docker container.

## 📋 System Requirements

- **Operating System:** Ubuntu 20.04/22.04 LTS or Debian 11/12
- **Runtime & Package Manager:** Bun v1.x
- **Python:** Python 3.10+ (required for `yt-dlp`)
- **FFmpeg & Bash:** Required by `yt-dlp` for media processing
- **Reverse Proxy:** Nginx (recommended)

## 🛠️ Option 1: Bare Metal / VPS Deployment (Bun + Systemd + Nginx)

### 1. Install System Dependencies & Bun

Update packages and install Python 3, FFmpeg, Bash, and Bun:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3 python3-pip ffmpeg git curl bash

# Install Bun
curl -fsSL [https://bun.sh/install](https://bun.sh/install) | bash
source ~/.bashrc

# Verify installation
bun --version

```

### 2. Install `yt-dlp` System-Wide

To ensure optimal performance and regular updates, install `yt-dlp` directly from GitHub releases:

```bash
sudo curl -L [https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp](https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp) -o /usr/local/bin/yt-dlp
sudo chmod a+rx /usr/local/bin/yt-dlp

# Verify installation
yt-dlp --version

```

### 3. Clone and Build the Application

```bash
# Clone repository
cd /var/www
sudo git clone [https://github.com/your-username/streamy.git](https://github.com/your-username/streamy.git)
cd streamy

# Install dependencies using Bun
bun install

# Build standalone production bundle
bun run build

```

### 4. Configure Systemd Service (Bun)

Create a systemd service file to manage the Bun server process:

```bash
sudo nano /etc/systemd/system/streamy.service

```

Paste the following configuration:

```ini
[Unit]
Description=Streamy SvelteKit Media Extractor (Bun Runtime)
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/streamy
ExecStart=/root/.bun/bin/bun run build/index.js
Restart=on-failure
RestartSec=5
Environment=NODE_ENV=production
Environment=PORT=3000
Environment=HOST=127.0.0.1

[Install]
WantedBy=multi-user.target

```

Enable and start the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable streamy
sudo systemctl start streamy

# Check status
sudo systemctl status streamy

```

### 5. Configure Nginx Reverse Proxy (with SSE Support)

Install Nginx:

```bash
sudo apt install -y nginx

```

Create a new site configuration:

```bash
sudo nano /etc/nginx/sites-available/streamy

```

Paste the configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com [www.yourdomain.com](https://www.yourdomain.com);

    location / {
        proxy_pass [http://127.0.0.1:3000](http://127.0.0.1:3000);
        proxy_http_version 1.1;
        
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Disable buffering to allow real-time SSE progress streaming
        proxy_buffering off;
        proxy_cache off;
        proxy_read_timeout 86400s;
    }
}

```

Enable the configuration and reload Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/streamy /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

```


## 🐳 Option 2: Docker Deployment (Bun + FFmpeg + Bash)

### `Dockerfile`

Create a `Dockerfile` in the project root using `oven/bun`:

```dockerfile
# Stage 1: Build SvelteKit application using Bun
FROM oven/bun:1 AS builder

WORKDIR /app

COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

# Stage 2: Production Runtime
FROM oven/bun:1-slim AS runner

WORKDIR /app

# Install system dependencies: bash, ffmpeg, python3, and curl for yt-dlp
RUN apt-get update && apt-get install -y --no-install-recommends \
    bash \
    ffmpeg \
    python3 \
    python3-pip \
    curl \
    && curl -L [https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp](https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp) -o /usr/local/bin/yt-dlp \
    && chmod a+rx /usr/local/bin/yt-dlp \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy built application assets and production dependencies
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json /app/bun.lockb* ./

RUN bun install --production

# Set shell to bash explicitly
SHELL ["/bin/bash", "-c"]

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Start SvelteKit build with Bun
CMD ["bun", "run", "build/index.js"]

```

### Build & Run Docker Container

```bash
# Build the Bun-powered image
docker build -t streamy:latest .

# Run container on port 3000
docker run -d -p 3000:3000 --name streamy --restart unless-stopped streamy:latest

```

## 🔄 Maintenance & Updates

### 1. Updating `yt-dlp` on Host / VPS

Set up an automated daily cron job to keep `yt-dlp` up-to-date on your host server:

```bash
sudo crontab -e

```

Add this line to update `yt-dlp` every night at midnight:

```cron
0 0 * * * /usr/local/bin/yt-dlp -U >/dev/null 2>&1

```

### 2. Updating `yt-dlp` inside Docker

Because YouTube extractors update frequently, you can automatically update `yt-dlp` inside a running Docker container without rebuilding the entire image:

```bash
# Run yt-dlp update inside the active container
docker exec -it streamy yt-dlp -U

```

Alternatively, add a cron job on your Docker host machine:

```cron
0 0 * * * docker exec streamy yt-dlp -U >/dev/null 2>&1

```

