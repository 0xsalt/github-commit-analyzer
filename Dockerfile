# syntax=docker/dockerfile:1
# GitHub Commit Analyzer - BuildKit Optimized Dockerfile
# First build: ~130s | Subsequent builds: ~20-30s | No changes: ~5s

FROM node:20-alpine AS base

# Install dependencies with BuildKit cache
FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json ./

# Cache npm packages between builds (huge speedup on rebuilds)
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# Build stage with Next.js cache
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Cache Next.js build artifacts between builds
RUN --mount=type=cache,target=/app/.next/cache \
    npm run build

# Minimal production runtime
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy only production artifacts
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
