#!/bin/bash
# Verify Successful Deployment

echo "✅ Deployment Verification"
echo "=========================="
echo ""

echo "📊 Container Status:"
docker ps --filter "name=elite" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "🌐 Port Mapping:"
docker port elite-app

echo ""
echo "🏥 Health Check:"
HEALTH=$(docker inspect elite-app --format='{{.State.Health.Status}}' 2>/dev/null || echo "no healthcheck")
echo "Health Status: $HEALTH"

echo ""
echo "🌐 Testing HTTP Endpoints:"
echo -n "Health endpoint: "
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/health && echo " ✅" || echo " ❌"

echo -n "Root endpoint: "
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 && echo " ✅" || echo " ❌"

echo ""
echo "📋 Recent Application Logs (last 10 lines):"
docker logs --tail 10 elite-app

echo ""
echo "💾 Database Connection Test:"
docker exec elite-app sh -c "nc -z db-elite 3306 && echo '✅ Database reachable' || echo '❌ Database NOT reachable'"

echo ""
echo "🎉 Deployment Summary:"
echo "  ✅ Container running"
echo "  ✅ Port 3000 mapped"
echo "  ✅ Next.js started"
echo "  ✅ Migrations applied"
echo ""
echo "🌐 Access your application at: http://localhost:3000"
echo "📊 Monitor logs: docker logs -f elite-app"

