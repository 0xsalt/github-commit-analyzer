# Docker Deployment Guide

Ultra-fast Docker deployment for GitHub Commit Analyzer (10-15 second builds).

## Quick Start

```bash
# 1. Build the app locally (only needed when code changes)
npm run build

# 2. Deploy to Docker (10-15 seconds)
docker compose up

# Access at http://localhost:3030
```

That's it! 🎉

---

## Commands

### Start (with logs)
```bash
docker compose up
```

### Start (detached/background)
```bash
docker compose up -d
```

### Stop
```bash
docker compose down
```

### Rebuild (after code changes)
```bash
# Build locally first
npm run build

# Then rebuild Docker image
docker compose up --build
```

### View logs
```bash
docker compose logs -f
```

---

## Configuration

### Change Port

Edit `docker-compose.yaml`:
```yaml
ports:
  - "8080:3000"  # Change 8080 to your preferred port
```

### Add GitHub Token (optional)

Edit `docker-compose.yaml`:
```yaml
environment:
  - NODE_ENV=production
  - GITHUB_TOKEN=your_github_token_here
```

**Why add a token?**
- Without: 60 requests/hour
- With: 5000 requests/hour

---

## Troubleshooting

### Port already in use?
```bash
# Check what's using port 3030
lsof -i :3030

# Change port in docker-compose.yaml
```

### Build taking too long?
```bash
# Clean Docker cache
docker compose build --no-cache
```

### Container won't start?
```bash
# Check logs
docker compose logs

# Check container status
docker ps -a
```

---

## File Overview

| File | Purpose |
|------|---------|
| `Dockerfile` | Instructions for building the container image |
| `docker-compose.yaml` | Configuration for running the container |
| `.dockerignore` | Files to exclude from Docker build (speeds up builds) |

---

## How It Works

**Optimized Build Strategy:**
1. Build Next.js app **locally** with `npm run build` (only when code changes)
2. Docker copies **pre-built artifacts** to container (10-15 seconds)
3. No npm install, no compilation in Docker = ultra-fast deployments

**Benefits:**
- ⚡ Build time: 10-15s (vs 130s with traditional multi-stage builds)
- 🚀 Faster iterations during development
- 📦 Smaller Docker images (only runtime artifacts)
- 🔄 Rebuild locally only when code actually changes

---

## Advanced Usage

### Custom Environment Variables

Create `.env` file:
```bash
NODE_ENV=production
GITHUB_TOKEN=your_token
CUSTOM_VAR=value
```

Update `docker-compose.yaml`:
```yaml
env_file:
  - .env
```

### Multiple Instances

```bash
# Start multiple copies on different ports
docker compose -p instance1 up -d
docker compose -p instance2 up -d
```

---

## Production Deployment

For production, consider:

1. **Use a reverse proxy** (nginx, Traefik, Caddy)
2. **Add SSL/TLS** (Let's Encrypt)
3. **Set up monitoring** (health check endpoint: `/`)
4. **Configure resource limits** in docker-compose.yaml:
   ```yaml
   deploy:
     resources:
       limits:
         cpus: '0.5'
         memory: 512M
   ```

---

## Comparison: Docker vs Vercel

| Feature | Docker | Vercel |
|---------|--------|--------|
| **Setup** | One command | Click deploy |
| **Cost** | Self-hosted (your server) | Free tier available |
| **Control** | Full control | Managed service |
| **Best For** | Self-hosting, privacy | Quick deployments |

**Recommendation**:
- Use **Vercel** for easiest deployment
- Use **Docker** for self-hosting or air-gapped environments

---

## Need Help?

- Check logs: `docker compose logs`
- Restart: `docker compose restart`
- Full reset: `docker compose down && docker compose up --build`
