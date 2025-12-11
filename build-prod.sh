#!/bin/bash
# Fast production build script with BuildKit enabled

set -e

echo "🚀 Building production image with BuildKit..."

# Enable BuildKit for faster builds
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

# Build with cache
docker compose -f docker-compose.prod.yml build --progress=plain

echo "✅ Build complete!"
echo ""
echo "To start the containers, run:"
echo "  docker compose -f docker-compose.prod.yml up -d"

