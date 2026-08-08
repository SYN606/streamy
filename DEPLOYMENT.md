# 🚀 Deployment Guide — Streamy

This document provides step-by-step instructions for deploying Streamy to a Linux production server (Ubuntu/Debian) or running it inside a Docker container.

---

## 📋 System Requirements

- **Operating System:** Ubuntu 20.04/22.04 LTS or Debian 11/12
- **Node.js:** v18.x or v20.x LTS
- **Python:** Python 3.10+ (required for `yt-dlp`)
- **FFmpeg:** Required by `yt-dlp` for audio/video stream merging and conversion
- **Reverse Proxy:** Nginx (recommended)

---

## 🛠️ Option 1: Bare Metal / VPS Deployment (Systemd + Nginx)

### 1. Install System Dependencies

Update your system packages and install Python 3, FFmpeg, and Node.js:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3 python3-pip ffmpeg git curl

# Install Node.js 20 LTS
curl -fsSL [https://deb.nodesource.com/setup_20.x](https://deb.nodesource.com/setup_20.x) | sudo -E bash -
sudo apt install -y nodejs

```

### 2. Install `yt-dlp` System-Wide

To ensure optimal performance and regular updates, install `yt-dlp` directly from GitHub releases:

```bash
sudo curl -L [https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp](https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp) -o /usr/local/bin/yt-dlp
sudo chmod a+rx /usr/local/bin/yt-dlp

# Verify installation
yt-dlp --version

```

---

### 3. Clone and Build the Application

```bash
# Clone repository
cd /var/www
sudo git clone [https://github.com/your-username/streamy.git](https://github.com/your-username/streamy.git)
cd streamy

# Install dependencies
npm install

# Build Node adapter production bundle
npm run build

```

---

### 4. Configure Systemd Service

Create a systemd service file to manage the Node server process:

```bash
sudo nano /etc/systemd/system/streamy.service

```

Paste the following configuration:

```ini
[Unit]
Description=Streamy SvelteKit Media Extractor
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/streamy
ExecStart=/usr/bin/node build
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

---

### 5. Configure Nginx Reverse Proxy (with SSE Support)

Install Nginx:

```bash
sudo apt install -y nginx

```

Create a new site block configuration:

```bash
sudo nano /etc/nginx/sites-available/streamy

```

Paste the configuration (Note the `proxy_set_header` and buffering tweaks for Server-Sent Events):

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

---

## 🐳 Option 2: Docker Deployment

### `Dockerfile`

Create a `Dockerfile` in the project root:

```dockerfile
# Base image with Node.js
FROM node:20-slim AS builder

WORKDIR /app

# Install build dependencies
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production image
FROM node:20-slim AS runner

WORKDIR /app

# Install Python and FFmpeg for yt-dlp runtime
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    ffmpeg \
    curl \
    && curl -L [https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp](https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp) -o /usr/local/bin/yt-dlp \
    && chmod a+rx /usr/local/bin/yt-dlp \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/build ./build
COPY --from=builder /app/package*.json ./

RUN npm ci --omit=dev

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["node", "build"]

```

### Build & Run Docker Container

```bash
# Build the image
docker build -t streamy:latest .

# Run container on port 3000
docker run -d -p 3000:3000 --name streamy --restart unless-stopped streamy:latest

```

---

## 🔄 Maintenance & Updates

### Updating `yt-dlp`

YouTube frequently updates its extractors. Set up an automated daily cron job to keep `yt-dlp` up-to-date:

```bash
sudo crontab -e

```

Add this line to update `yt-dlp` every night at midnight:

```cron
0 0 * * * /usr/local/bin/yt-dlp -U >/dev/null 2>&1

```
