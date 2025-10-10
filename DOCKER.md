# Docker Deployment Guide

Simple, one-command Docker deployment for GitHub Commit Analyzer.

## Quick Start

```bash
# Start the application
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

**BuildKit Optimization:**
- Uses Docker BuildKit cache mounts for intelligent caching
- First build: ~130s (installs all dependencies, compiles app)
- Subsequent builds with code changes: ~20-30s (reuses cached packages)
- Subsequent builds without changes: ~5s (fully cached)

**Build Stages:**
1. **deps**: Install npm packages (with BuildKit cache)
2. **builder**: Compile Next.js app (with Next.js cache)
3. **runner**: Minimal production runtime (only artifacts, no build tools)

**Result**: Smart caching = faster iteration during development

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
