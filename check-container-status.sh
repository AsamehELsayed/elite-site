#!/bin/bash
# Container Status Check Script

echo "🔍 Checking elite-app container status..."
echo ""

# Check if container is running
if docker ps | grep -q elite-app; then
    echo "✅ Container is running"
else
    echo "❌ Container is not running"
    exit 1
fi

echo ""
echo "📊 Container details:"
docker ps --filter "name=elite-app" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "📋 Recent logs (last 50 lines):"
docker logs --tail 50 elite-app

echo ""
echo "🔍 Checking if port 3000 is listening inside container:"
docker exec elite-app nc -z localhost 3000 && echo "✅ Port 3000 is listening" || echo "❌ Port 3000 is not listening"

echo ""
echo "🌐 Checking port mapping:"
docker port elite-app

echo ""
echo "💾 Checking database connection:"
docker exec elite-app sh -c "nc -z db-elite 3306" && echo "✅ Can reach database" || echo "❌ Cannot reach database"

echo ""
echo "🏥 Health check status:"
docker inspect elite-app --format='{{json .State.Health}}' | python3 -m json.tool 2>/dev/null || docker inspect elite-app --format='{{json .State.Health}}'

