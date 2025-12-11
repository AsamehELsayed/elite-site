#!/bin/bash
# Cleanup Orphan Containers

echo "🧹 Cleaning up orphan containers..."
echo ""

# Remove orphan containers
docker compose -f docker-compose.prod.yml up -d --remove-orphans

echo ""
echo "📊 Current containers:"
docker ps --filter "name=elite" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "✅ Cleanup complete!"

