# Docker Deployment Guide

Pre-compiled Docker images for instant deployment. No build required!

## For End Users (Download & Run)

```bash
# Pull the latest image and start
docker compose up

# Access at http://localhost:3030
```

That's it! 🎉

The image is pre-compiled and published to Docker Hub. You're running the exact same container the developer built.

---

## For Developers (Build & Publish)

### First Time Setup
```bash
# Login to Docker Hub
docker login
```

### Build and Publish
```bash
# Make executable (first time only)
chmod +x docker-build-push.sh

# Build and push to Docker Hub
./docker-build-push.sh

# Or with a specific tag
./docker-build-push.sh v1.0.0
```

This builds the image ONCE and publishes it to Docker Hub. All users can then pull the pre-compiled image.

---

## Commands (End Users)

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

### Update to latest version
```bash
docker compose pull
docker compose up
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

**Pre-compiled Image Distribution:**
- Developer builds image ONCE (~130s) and pushes to Docker Hub
- End users pull pre-compiled image (~10-30s depending on internet)
- End users run immediately (no compilation on their machine!)
- Everyone runs the exact same container ("ship your machine" principle)

**Build Stages (Developer Only):**
1. **deps**: Install npm packages (with BuildKit cache)
2. **builder**: Compile Next.js app (with Next.js cache)
3. **runner**: Minimal production runtime (only artifacts, no build tools)

**Result**: Users get instant deployment, developers maintain quality control

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

| Feature | Docker (Pre-compiled) | Vercel |
|---------|----------------------|--------|
| **Setup** | `docker compose up` | Click deploy |
| **Build Time** | None (pulls pre-compiled) | ~2-3 minutes per deploy |
| **Cost** | Self-hosted (your server) | Free tier available |
| **Control** | Full control | Managed service |
| **Best For** | Self-hosting, privacy, air-gapped | Quick deployments, auto-scaling |

**Recommendation**:
- Use **Docker** for instant deployment with pre-compiled images
- Use **Vercel** for managed infrastructure with auto-scaling

---

## Need Help?

- Check logs: `docker compose logs`
- Restart: `docker compose restart`
- Full reset: `docker compose down && docker compose up --build`
