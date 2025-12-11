#!/bin/bash
# Fix Port Issue Script

echo "🔧 Fixing port mapping issue..."
echo ""

# Stop the container
echo "🛑 Stopping elite-app..."
docker stop elite-app

# Remove the container
echo "🗑️  Removing elite-app..."
docker rm elite-app

# Recreate with proper port mapping
echo "🚀 Recreating container with proper port mapping..."
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1
docker compose -f docker-compose.prod.yml up -d

echo ""
echo "⏳ Waiting 10 seconds for container to start..."
sleep 10

echo ""
echo "📊 Container status:"
docker ps --filter "name=elite-app" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "📋 Recent logs:"
docker logs --tail 30 elite-app

echo ""
echo "✅ Done! Check if port 3000 is now mapped:"
docker port elite-app

