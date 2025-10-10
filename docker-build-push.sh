#!/bin/bash
# Developer workflow: Build and publish Docker image to Docker Hub
# Usage: ./docker-build-push.sh [tag]
# Default tag: latest

set -e

IMAGE_NAME="0xsalt/github-analyzer"
TAG="${1:-latest}"
FULL_IMAGE="${IMAGE_NAME}:${TAG}"

echo "🏗️  Building Docker image: ${FULL_IMAGE}"
DOCKER_BUILDKIT=1 docker build -t "${FULL_IMAGE}" .

echo "✅ Build complete!"
echo ""
echo "📤 Pushing to Docker Hub: ${FULL_IMAGE}"
docker push "${FULL_IMAGE}"

echo "✅ Successfully pushed ${FULL_IMAGE}"
echo ""
echo "🎉 Users can now run:"
echo "   docker pull ${FULL_IMAGE}"
echo "   docker compose up"
