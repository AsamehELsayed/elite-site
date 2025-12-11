#!/bin/bash
# Quick Deployment Script - Fast Production Deployment
# Usage: ./quick-deploy.sh

set -e  # Exit on error

echo "🚀 Starting Fast Deployment..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Check prerequisites
echo -e "${YELLOW}Step 1: Checking prerequisites...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    exit 1
fi

if ! command -v docker compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed${NC}"
    exit 1
fi

if [ ! -f ".env" ]; then
    echo -e "${RED}❌ .env file not found!${NC}"
    echo "Please create a .env file with required variables."
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"
echo ""

# Step 2: Stop existing containers
echo -e "${YELLOW}Step 2: Stopping existing containers...${NC}"
docker compose -f docker-compose.prod.yml down 2>/dev/null || true
echo -e "${GREEN}✅ Containers stopped${NC}"
echo ""

# Step 3: Enable BuildKit
echo -e "${YELLOW}Step 3: Enabling BuildKit for faster builds...${NC}"
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1
echo -e "${GREEN}✅ BuildKit enabled${NC}"
echo ""

# Step 4: Build image
echo -e "${YELLOW}Step 4: Building production image (this may take a few minutes)...${NC}"
echo "Building with cache optimization..."
docker compose -f docker-compose.prod.yml build --progress=plain
echo -e "${GREEN}✅ Build complete${NC}"
echo ""

# Step 5: Start services
echo -e "${YELLOW}Step 5: Starting services...${NC}"
docker compose -f docker-compose.prod.yml up -d
echo -e "${GREEN}✅ Services started${NC}"
echo ""

# Step 6: Wait for services to be ready
echo -e "${YELLOW}Step 6: Waiting for services to be ready...${NC}"
sleep 5

# Check if containers are running
if docker ps | grep -q "elite-app"; then
    echo -e "${GREEN}✅ Application container is running${NC}"
else
    echo -e "${RED}❌ Application container failed to start${NC}"
    echo "Check logs with: docker compose -f docker-compose.prod.yml logs app-elite"
    exit 1
fi

if docker ps | grep -q "elite-db"; then
    echo -e "${GREEN}✅ Database container is running${NC}"
else
    echo -e "${RED}❌ Database container failed to start${NC}"
    echo "Check logs with: docker compose -f docker-compose.prod.yml logs db-elite"
    exit 1
fi
echo ""

# Step 7: Show status
echo -e "${YELLOW}Step 7: Container Status${NC}"
docker compose -f docker-compose.prod.yml ps
echo ""

# Step 8: Health check
echo -e "${YELLOW}Step 8: Performing health check...${NC}"
sleep 10  # Give app time to start

# Try to check health endpoint
if curl -f http://localhost:3000/api/health &>/dev/null; then
    echo -e "${GREEN}✅ Health check passed${NC}"
else
    echo -e "${YELLOW}⚠️  Health check endpoint not responding yet (this is normal, app may still be starting)${NC}"
    echo "Check logs with: docker compose -f docker-compose.prod.yml logs -f app-elite"
fi
echo ""

# Final summary
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo ""
echo "Useful commands:"
echo "  View logs:     docker compose -f docker-compose.prod.yml logs -f app-elite"
echo "  View status:   docker compose -f docker-compose.prod.yml ps"
echo "  Stop services: docker compose -f docker-compose.prod.yml down"
echo "  Restart app:   docker compose -f docker-compose.prod.yml restart app-elite"
echo ""

