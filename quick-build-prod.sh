#!/bin/bash
# Quick Production Build Script - Optimized with BuildKit
# Usage: ./quick-build-prod.sh

set -e

echo "🚀 Starting optimized production build..."
echo ""

# Enable BuildKit
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📦 Step 1: Building with BuildKit and parallel builds...${NC}"
START_TIME=$(date +%s)
docker compose -f docker-compose.prod.yml build --parallel
END_TIME=$(date +%s)
BUILD_TIME=$((END_TIME - START_TIME))

echo ""
echo -e "${GREEN}✅ Build completed in ${BUILD_TIME} seconds${NC}"
echo ""

# Show image size
echo -e "${YELLOW}📊 Image size:${NC}"
docker images elite-site:latest --format "{{.Repository}}:{{.Tag}} - {{.Size}}"

echo ""
echo -e "${YELLOW}🚀 Step 2: Starting services...${NC}"
docker compose -f docker-compose.prod.yml up -d

echo ""
echo -e "${GREEN}✅ Services started!${NC}"
echo ""
echo "📋 Useful commands:"
echo "  View logs:    docker compose -f docker-compose.prod.yml logs -f app-elite"
echo "  Stop:         docker compose -f docker-compose.prod.yml down"
echo "  Restart:      docker compose -f docker-compose.prod.yml restart app-elite"
echo "  Health check: curl http://localhost:3000/api/health"
echo ""

