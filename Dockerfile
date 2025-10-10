# GitHub Commit Analyzer - Production Dockerfile
# Simple, obvious, production-ready Next.js container

# Use official Node.js 20 Alpine image (smallest, fastest)
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Set working directory
WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json ./

# Install ALL dependencies (including dev dependencies needed for build)
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy all dependencies from deps stage (includes dev dependencies for build)
COPY --from=deps /app/node_modules ./node_modules

# Copy all source files
COPY . .

# Build Next.js application
# This generates optimized production build in .next folder
# Requires TypeScript, ESLint, and other dev dependencies
RUN npm run build

# Production image - run the built application
FROM base AS runner
WORKDIR /app

# Set to production environment
ENV NODE_ENV=production

# Don't run as root user (security best practice)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application from builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set correct permissions
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose port 3000 (Next.js default)
EXPOSE 3000

# Set port environment variable
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the Next.js production server
CMD ["node", "server.js"]
