# Update & Publishing Workflow

Standard procedure for making updates, publishing to Docker Hub, and testing.

## Quick Reference

```bash
# 1. Make your changes to the code
# 2. Rebuild and push
./docker-build-push.sh

# 3. Test locally
docker compose down && docker compose pull && docker compose up
```

---

## Detailed Workflow

### Step 1: Development Changes
```bash
# Make code changes
# Edit files as needed

# Test locally with npm (optional but recommended)
npm run dev
# Visit http://localhost:3030
```

### Step 2: Git Commit
```bash
git add -A
git commit -m "Your commit message"
git push
```

### Step 3: Build & Publish to Docker Hub
```bash
# Build and push new image (~130s)
./docker-build-push.sh

# Or with version tag
./docker-build-push.sh v1.0.1
```

This will:
- Build the Docker image with your latest changes
- Tag as `0xsalt/github-analyzer:latest`
- Push to Docker Hub

### Step 4: Test the Published Image
```bash
# Stop existing container
docker compose down

# Pull the latest image you just pushed
docker compose pull

# Start with the new image
docker compose up

# Or run detached
docker compose up -d && docker compose logs -f
```

### Step 5: Verify
- Visit http://localhost:3030
- Check that your changes are working
- Verify port message shows correct port (3030)

---

## Version Tagging

### Tag a specific version
```bash
# Build and push with version tag
./docker-build-push.sh v1.2.3

# Also tag as latest
docker tag 0xsalt/github-analyzer:v1.2.3 0xsalt/github-analyzer:latest
docker push 0xsalt/github-analyzer:latest
```

### Use specific version in docker-compose
```yaml
# docker-compose.yaml
services:
  app:
    image: 0xsalt/github-analyzer:v1.2.3  # Specific version
    # OR
    image: 0xsalt/github-analyzer:latest  # Always latest
```

---

## Troubleshooting Updates

### Image not updating?
```bash
# Force pull and rebuild
docker compose down
docker compose pull
docker system prune -f
docker compose up --force-recreate
```

### Want to test before publishing?
```bash
# Build locally without pushing
DOCKER_BUILDKIT=1 docker build -t 0xsalt/github-analyzer:test .

# Test local build
docker run -p 3030:3030 0xsalt/github-analyzer:test

# If good, push to Docker Hub
docker tag 0xsalt/github-analyzer:test 0xsalt/github-analyzer:latest
docker push 0xsalt/github-analyzer:latest
```

### Rollback to previous version
```bash
# Pull specific older version
docker pull 0xsalt/github-analyzer:v1.0.0

# Update docker-compose.yaml to use that version
# Then restart
docker compose up
```

---

## Best Practices

1. **Always test locally first** with `npm run dev`
2. **Commit to git** before building Docker image
3. **Use version tags** for important releases
4. **Test the published image** before announcing updates
5. **Keep docker-compose.yaml** pointing to `:latest` for auto-updates

---

## Quick Commands Cheat Sheet

```bash
# Full update cycle
git add -A && git commit -m "Update" && git push && ./docker-build-push.sh && docker compose down && docker compose pull && docker compose up -d

# Check running container
docker compose ps
docker compose logs -f

# Stop everything
docker compose down

# Clean rebuild
docker compose down && docker system prune -f && docker compose pull && docker compose up
```
