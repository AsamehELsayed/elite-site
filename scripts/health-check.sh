#!/bin/bash

# Health check script for Elite-Mark.com
# Checks application, database, and system health

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🏥 Elite-Mark.com Health Check"
echo "=============================="
echo ""

# Check if containers are running
echo "🐳 Docker Containers:"
if docker ps | grep -q elite-app; then
    echo -e "   ${GREEN}✅ elite-app: Running${NC}"
else
    echo -e "   ${RED}❌ elite-app: Not running${NC}"
fi

if docker ps | grep -q elite-db; then
    echo -e "   ${GREEN}✅ elite-db: Running${NC}"
else
    echo -e "   ${RED}❌ elite-db: Not running${NC}"
fi

echo ""

# Check application health endpoint
echo "🌐 Application Health:"
if docker exec elite-app wget -q -O- http://localhost:3000/api/health > /dev/null 2>&1; then
    HEALTH_RESPONSE=$(docker exec elite-app wget -q -O- http://localhost:3000/api/health)
    echo -e "   ${GREEN}✅ Application: Healthy${NC}"
    echo "   Response: $HEALTH_RESPONSE"
else
    echo -e "   ${RED}❌ Application: Unhealthy${NC}"
fi

echo ""

# Check database connection
echo "🗄️  Database:"
if docker exec elite-db mysql -u root -e "SELECT 1" > /dev/null 2>&1; then
    echo -e "   ${GREEN}✅ Database: Connected${NC}"
    
    # Get database size
    DB_SIZE=$(docker exec elite-db mysql -u root -e "SELECT ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)' FROM information_schema.tables WHERE table_schema = 'elite_production';" -s -N)
    echo "   Size: ${DB_SIZE} MB"
else
    echo -e "   ${RED}❌ Database: Connection failed${NC}"
fi

echo ""

# Check disk space
echo "💾 Disk Space:"
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -lt 80 ]; then
    echo -e "   ${GREEN}✅ Disk usage: ${DISK_USAGE}%${NC}"
else
    echo -e "   ${YELLOW}⚠️  Disk usage: ${DISK_USAGE}% (High)${NC}"
fi

echo ""

# Check memory usage
echo "🧠 Memory:"
MEMORY_USAGE=$(free | awk 'NR==2 {printf "%.0f", $3*100/$2}')
if [ $MEMORY_USAGE -lt 80 ]; then
    echo -e "   ${GREEN}✅ Memory usage: ${MEMORY_USAGE}%${NC}"
else
    echo -e "   ${YELLOW}⚠️  Memory usage: ${MEMORY_USAGE}% (High)${NC}"
fi

echo ""

# Check CPU load
echo "⚡ CPU Load:"
CPU_LOAD=$(uptime | awk -F'load average:' '{print $2}' | awk '{print $1}')
echo "   Load average: $CPU_LOAD"

echo ""

# Check SSL certificate expiry
echo "🔒 SSL Certificate:"
if [ -f /etc/letsencrypt/live/elite-mark.com/cert.pem ]; then
    EXPIRY_DATE=$(openssl x509 -enddate -noout -in /etc/letsencrypt/live/elite-mark.com/cert.pem | cut -d= -f2)
    EXPIRY_EPOCH=$(date -d "$EXPIRY_DATE" +%s)
    NOW_EPOCH=$(date +%s)
    DAYS_LEFT=$(( ($EXPIRY_EPOCH - $NOW_EPOCH) / 86400 ))
    
    if [ $DAYS_LEFT -gt 30 ]; then
        echo -e "   ${GREEN}✅ Certificate valid for $DAYS_LEFT days${NC}"
    elif [ $DAYS_LEFT -gt 7 ]; then
        echo -e "   ${YELLOW}⚠️  Certificate expires in $DAYS_LEFT days${NC}"
    else
        echo -e "   ${RED}❌ Certificate expires in $DAYS_LEFT days!${NC}"
    fi
else
    echo -e "   ${YELLOW}⚠️  Certificate not found${NC}"
fi

echo ""

# Check nginx status
echo "🌍 Nginx:"
if systemctl is-active --quiet nginx; then
    echo -e "   ${GREEN}✅ Nginx: Running${NC}"
else
    echo -e "   ${RED}❌ Nginx: Not running${NC}"
fi

echo ""

# Check recent errors in logs
echo "📋 Recent Errors (last 10):"
ERROR_COUNT=$(docker logs elite-app --since 1h 2>&1 | grep -i error | wc -l)
if [ $ERROR_COUNT -eq 0 ]; then
    echo -e "   ${GREEN}✅ No errors in last hour${NC}"
else
    echo -e "   ${YELLOW}⚠️  $ERROR_COUNT errors in last hour${NC}"
    docker logs elite-app --since 1h 2>&1 | grep -i error | tail -5
fi

echo ""
echo "=============================="
echo "🏥 Health check complete"

