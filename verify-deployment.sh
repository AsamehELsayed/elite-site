#!/bin/bash
# Verify Deployment Script

echo "🔍 Verifying deployment..."
echo ""

# Check container status
echo "📊 Container Status:"
docker ps --filter "name=elite" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "🌐 Network Connectivity:"
docker network inspect elite-network --format '{{range .Containers}}{{.Name}} ({{.IPv4Address}}){{"\n"}}{{end}}' 2>/dev/null

echo ""
echo "📋 Application Logs (last 30 lines):"
docker logs --tail 30 elite-app

echo ""
echo "🏥 Health Check:"
docker inspect elite-app --format='{{json .State.Health}}' | python3 -m json.tool 2>/dev/null || docker inspect elite-app --format='{{.State.Health.Status}}'

echo ""
echo "🌐 Port Mapping:"
docker port elite-app

echo ""
echo "✅ Testing HTTP endpoint:"
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost:3000/api/health || echo "Endpoint not ready yet"

echo ""
echo "📦 Container Resource Usage:"
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}" elite-app elite-db

