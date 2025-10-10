# GitHub Commit Analyzer - Optimized Production Dockerfile
# Works from fresh git pull, optimized for fast rebuilds

FROM node:20-alpine AS base

# Install dependencies with better caching
FROM base AS deps
WORKDIR /app

# Copy only dependency files first (better layer caching)
COPY package.json package-lock.json ./

# Install dependencies (cached unless package files change)
RUN npm ci

# Build stage - only rebuilds if source code changes
FROM base AS builder
WORKDIR /app

# Copy dependencies from cache-friendly deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source files
COPY . .

# Build Next.js (uses Turbopack, should be faster)
RUN npm run build

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
