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
    && curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp \
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

# Start SvelteKit standalone build with Bun
CMD ["bun", "run", "build/index.js"]