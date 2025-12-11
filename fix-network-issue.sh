#!/bin/bash
# Fix Network Issue - Recreate containers on same network

set -e

echo "🔧 Fixing Docker network issue..."
echo ""

# Stop both containers
echo "🛑 Stopping containers..."
docker stop elite-app elite-db 2>/dev/null || true

# Remove both containers
echo "🗑️  Removing containers..."
docker rm elite-app elite-db 2>/dev/null || true

# Remove the network if it exists (to recreate fresh)
echo "🌐 Removing old network..."
docker network rm elite-network 2>/dev/null || echo "Network doesn't exist, creating new one..."

# Recreate everything with docker-compose (ensures same network)
echo "🚀 Recreating containers on same network..."
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1
docker compose -f docker-compose.prod.yml up -d

echo ""
echo "⏳ Waiting 15 seconds for containers to start..."
sleep 15

echo ""
echo "📊 Container status:"
docker ps --filter "name=elite" --format "table {{.Names}}\t{{.Status}}\t{{.Networks}}"

echo ""
echo "🌐 Network details:"
docker network inspect elite-network --format '{{range .Containers}}{{.Name}} {{end}}' 2>/dev/null || echo "Network not found"

echo ""
echo "📋 App logs (last 20 lines):"
docker logs --tail 20 elite-app

echo ""
echo "✅ Done! Check if containers can communicate:"
echo "   docker exec elite-app ping -c 2 elite-db"
echo "   docker exec elite-app nc -z db-elite 3306"

