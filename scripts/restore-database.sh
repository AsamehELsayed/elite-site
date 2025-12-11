#!/bin/bash

# Database restore script for raheedbrides.cloud
# Usage: ./restore-database.sh <backup-file.sql.gz>

set -e

# Configuration
CONTAINER_NAME="elite-db"
DB_USER="elite_user"
DB_NAME="elite_production"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🔄 raheedbrides.cloud Database Restore"
echo "=================================="

# Check if backup file is provided
if [ -z "$1" ]; then
    echo -e "${RED}❌ Please provide a backup file${NC}"
    echo "Usage: $0 <backup-file.sql.gz>"
    echo ""
    echo "Available backups:"
    ls -lh /root/backups/elite/*.sql.gz 2>/dev/null || echo "No backups found"
    exit 1
fi

BACKUP_FILE=$1

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo -e "${RED}❌ Backup file not found: $BACKUP_FILE${NC}"
    exit 1
fi

# Check if container is running
if ! docker ps | grep -q $CONTAINER_NAME; then
    echo -e "${RED}❌ Container $CONTAINER_NAME is not running${NC}"
    exit 1
fi

# Load password from environment
if [ -f .env.production ]; then
    source .env.production
else
    echo -e "${RED}❌ .env.production not found${NC}"
    exit 1
fi

# Warning
echo -e "${YELLOW}⚠️  WARNING: This will replace the current database!${NC}"
echo "   Backup file: $BACKUP_FILE"
echo "   Database: $DB_NAME"
echo ""
read -p "Are you sure you want to continue? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Restore cancelled"
    exit 0
fi

# Create a backup of current database first
echo "📦 Creating backup of current database..."
SAFETY_BACKUP="/tmp/elite_db_before_restore_$(date +%Y%m%d_%H%M%S).sql"
docker exec $CONTAINER_NAME mysqldump \
    -u $DB_USER \
    -p$MYSQL_PASSWORD \
    $DB_NAME > $SAFETY_BACKUP
gzip $SAFETY_BACKUP
echo -e "${GREEN}✅ Safety backup created: $SAFETY_BACKUP.gz${NC}"

# Decompress if needed
if [[ $BACKUP_FILE == *.gz ]]; then
    echo "🗜️  Decompressing backup..."
    TEMP_SQL="/tmp/restore_$(date +%Y%m%d_%H%M%S).sql"
    gunzip -c $BACKUP_FILE > $TEMP_SQL
else
    TEMP_SQL=$BACKUP_FILE
fi

# Restore database
echo "🔄 Restoring database..."
docker exec -i $CONTAINER_NAME mysql \
    -u $DB_USER \
    -p$MYSQL_PASSWORD \
    $DB_NAME < $TEMP_SQL

# Clean up temp file
if [[ $BACKUP_FILE == *.gz ]]; then
    rm $TEMP_SQL
fi

echo -e "${GREEN}✅ Database restored successfully!${NC}"
echo ""
echo "🔧 Restarting application..."
docker-compose -f docker-compose.prod.yml restart app-elite

echo ""
echo -e "${GREEN}✅ Restore complete!${NC}"
echo "   Safety backup: $SAFETY_BACKUP.gz"


