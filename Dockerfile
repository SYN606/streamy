FROM oven/bun:1 AS builder

WORKDIR /app

RUN echo "========================================" && \
    echo "Starting Streamy builder stage" && \
    echo "========================================"

RUN echo "[1/5] Installing Python and certificates..." && \
    apt-get update && \
    apt-get install -y --no-install-recommends \
        python3 \
        python-is-python3 \
        ca-certificates \
        curl && \
    rm -rf /var/lib/apt/lists/* && \
    echo "[OK] Python dependencies installed"

COPY package.json bun.lock ./

RUN echo "[2/5] Checking Python..." && \
    python --version

RUN echo "[3/5] Installing Bun dependencies..." && \
    bun install --frozen-lockfile && \
    echo "[OK] Bun dependencies installed"

COPY . .

RUN echo "[4/5] Building Streamy..." && \
    bun run build && \
    echo "[OK] Streamy build completed"

RUN echo "[5/5] Installing yt-dlp..." && \
    curl -fL \
        https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp \
        -o /usr/bin/yt-dlp && \
    chmod 755 /usr/bin/yt-dlp && \
    echo "[OK] yt-dlp installed:" && \
    /usr/bin/yt-dlp --version


FROM oven/bun:1-slim AS runner

WORKDIR /app

RUN echo "========================================" && \
    echo "Starting Streamy runtime stage" && \
    echo "========================================"

RUN echo "[1/4] Installing runtime dependencies..." && \
    apt-get update && \
    apt-get install -y --no-install-recommends \
        bash \
        ca-certificates \
        ffmpeg \
        python3 \
        python-is-python3 && \
    update-ca-certificates && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    echo "[OK] Runtime dependencies installed"

RUN echo "[2/4] Checking FFmpeg..." && \
    ffmpeg -version | head -n 1 && \
    echo "[OK] FFmpeg available"

COPY --from=builder /usr/bin/yt-dlp /usr/bin/yt-dlp

RUN echo "[3/4] Checking yt-dlp..." && \
    ls -l /usr/bin/yt-dlp && \
    /usr/bin/yt-dlp --version && \
    echo "[OK] yt-dlp available at /usr/bin/yt-dlp"

COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./
COPY --from=builder /app/bun.lock ./

RUN echo "[4/4] Installing production dependencies..." && \
    bun install --production --frozen-lockfile && \
    echo "[OK] Production dependencies installed"

RUN echo "========================================" && \
    echo "Streamy runtime image ready" && \
    echo "========================================" && \
    echo "Bun:    $(bun --version)" && \
    echo "Python: $(python3 --version)" && \
    echo "FFmpeg: $(ffmpeg -version 2>&1 | head -n 1)" && \
    echo "yt-dlp: $(/usr/bin/yt-dlp --version)" && \
    echo "========================================"

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

CMD ["bun", "run", "build/index.js"]