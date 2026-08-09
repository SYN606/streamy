FROM oven/bun:1 AS builder

WORKDIR /app

# Install Python
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        python3 \
        python-is-python3 && \
    rm -rf /var/lib/apt/lists/*

COPY package.json bun.lock ./

RUN python --version
RUN bun install --frozen-lockfile

COPY . .

RUN bun run build

FROM oven/bun:1-slim AS runner

WORKDIR /app

# Install runtime dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        bash \
        ca-certificates \
        curl \
        ffmpeg \
        python3 \
        python-is-python3 && \
    update-ca-certificates && \
    curl -fL \
        https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp \
        -o /usr/local/bin/yt-dlp && \
    chmod 755 /usr/local/bin/yt-dlp && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./
COPY --from=builder /app/bun.lock ./

RUN bun install --production --frozen-lockfile

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

CMD ["bun", "run", "build/index.js"]
