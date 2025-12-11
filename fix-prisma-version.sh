#!/bin/bash
# Fix Prisma Version Issue

echo "🔧 Fixing Prisma version mismatch..."
echo ""

# Stop container
echo "🛑 Stopping elite-app..."
docker stop elite-app
docker rm elite-app

# Rebuild with correct Prisma version
echo "🔨 Rebuilding image with locked Prisma version..."
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

# Rebuild just the app service
docker compose -f docker-compose.prod.yml build --no-cache app-elite

# Start container
echo "🚀 Starting container..."
docker compose -f docker-compose.prod.yml up -d app-elite

echo ""
echo "⏳ Waiting 10 seconds..."
sleep 10

echo ""
echo "📋 Checking Prisma version in container:"
docker exec elite-app sh -c "node_modules/.bin/prisma --version 2>&1 || npx prisma --version"

echo ""
echo "📋 Application logs:"
docker logs --tail 30 elite-app

