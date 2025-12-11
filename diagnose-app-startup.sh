#!/bin/bash
# Diagnose App Startup Issues

echo "🔍 Diagnosing application startup..."
echo ""

echo "📋 Full container logs:"
docker logs elite-app 2>&1 | tail -100

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "🔄 Container restart count:"
docker inspect elite-app --format='Restart Count: {{.RestartCount}}'

echo ""
echo "📊 Container state:"
docker inspect elite-app --format='State: {{.State.Status}}, Exit Code: {{.State.ExitCode}}, Error: {{.State.Error}}'

echo ""
echo "🌐 Network connectivity test:"
docker exec elite-app sh -c "nc -z db-elite 3306 && echo '✅ Database reachable' || echo '❌ Database NOT reachable'"

echo ""
echo "🔌 Port listening check:"
docker exec elite-app sh -c "nc -z localhost 3000 && echo '✅ Port 3000 is listening' || echo '❌ Port 3000 is NOT listening'"

echo ""
echo "📁 Check if server.js exists:"
docker exec elite-app sh -c "ls -la server.js 2>&1 || echo 'server.js not found'"

echo ""
echo "💾 Check DATABASE_URL:"
docker exec elite-app sh -c "echo \$DATABASE_URL | sed 's/:[^:]*@/:****@/'"

echo ""
echo "🔍 Check if process is running:"
docker exec elite-app sh -c "ps aux | grep -E 'node|server' || echo 'No node process found'"

