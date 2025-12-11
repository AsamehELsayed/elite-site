#!/bin/bash

# Database backup script for raheedbrides.cloud
# Run this script to create a backup of the production database

set -e

# Configuration
BACKUP_DIR="/root/backups/elite"
DATE=$(date +%Y%m%d_%H%M%S)
CONTAINER_NAME="elite-db"
DB_USER="elite_user"
DB_NAME="elite_production"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "🗄️  raheedbrides.cloud Database Backup"
echo "=================================="

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

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

# Create backup
echo "📦 Creating backup..."
BACKUP_FILE="$BACKUP_DIR/elite_db_$DATE.sql"

docker exec $CONTAINER_NAME mysqldump \
    -u $DB_USER \
    -p$MYSQL_PASSWORD \
    $DB_NAME > $BACKUP_FILE

# Compress backup
echo "🗜️  Compressing backup..."
gzip $BACKUP_FILE

BACKUP_FILE_GZ="$BACKUP_FILE.gz"
BACKUP_SIZE=$(du -h $BACKUP_FILE_GZ | cut -f1)

echo -e "${GREEN}✅ Backup created: $BACKUP_FILE_GZ${NC}"
echo "   Size: $BACKUP_SIZE"

# Keep only last 7 days of backups
echo "🧹 Cleaning old backups (keeping last 7 days)..."
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete

# List recent backups
echo ""
echo "📋 Recent backups:"
ls -lh $BACKUP_DIR/*.sql.gz | tail -5

echo ""
echo -e "${GREEN}✅ Backup complete!${NC}"


