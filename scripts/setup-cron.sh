#!/bin/bash

# Setup automated tasks for Elite-Mark.com
# - Daily database backups
# - SSL certificate renewal
# - Log rotation

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "⏰ Setting up Automated Tasks for Elite-Mark.com"
echo "==============================================="

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}❌ Please run with sudo${NC}"
    exit 1
fi

# Get the current directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "📁 Project directory: $PROJECT_DIR"

# Make scripts executable
echo "🔧 Making scripts executable..."
chmod +x $PROJECT_DIR/scripts/backup-database.sh
chmod +x $PROJECT_DIR/scripts/restore-database.sh

# Setup cron jobs
echo "⏰ Setting up cron jobs..."

# Create temporary cron file
CRON_FILE="/tmp/elite-cron"
crontab -l > $CRON_FILE 2>/dev/null || true

# Remove existing elite-mark cron jobs
sed -i '/elite-mark/d' $CRON_FILE

# Add new cron jobs
cat >> $CRON_FILE << EOF

# Elite-Mark.com Automated Tasks
# Database backup - Daily at 2:00 AM
0 2 * * * cd $PROJECT_DIR && $PROJECT_DIR/scripts/backup-database.sh >> /var/log/elite-backup.log 2>&1

# SSL certificate renewal - Twice daily
0 0,12 * * * certbot renew --quiet --post-hook "systemctl reload nginx" >> /var/log/elite-ssl-renew.log 2>&1

# Docker cleanup - Weekly on Sunday at 3:00 AM
0 3 * * 0 docker system prune -af --volumes >> /var/log/elite-docker-cleanup.log 2>&1

EOF

# Install new cron jobs
crontab $CRON_FILE
rm $CRON_FILE

echo -e "${GREEN}✅ Cron jobs installed${NC}"

# Create log files
echo "📝 Creating log files..."
touch /var/log/elite-backup.log
touch /var/log/elite-ssl-renew.log
touch /var/log/elite-docker-cleanup.log
chmod 644 /var/log/elite-*.log

echo -e "${GREEN}✅ Log files created${NC}"

# Setup logrotate
echo "🔄 Setting up log rotation..."
cat > /etc/logrotate.d/elite-mark << EOF
/var/log/elite-*.log {
    daily
    rotate 14
    compress
    delaycompress
    missingok
    notifempty
    create 644 root root
}
EOF

echo -e "${GREEN}✅ Log rotation configured${NC}"

# Display current cron jobs
echo ""
echo "📋 Current cron jobs:"
crontab -l | grep -A 10 "Elite-Mark"

echo ""
echo -e "${GREEN}✅ Automated tasks setup complete!${NC}"
echo ""
echo "Scheduled tasks:"
echo "  • Database backup: Daily at 2:00 AM"
echo "  • SSL renewal: Twice daily (midnight and noon)"
echo "  • Docker cleanup: Weekly on Sunday at 3:00 AM"
echo ""
echo "Logs:"
echo "  • Backups: /var/log/elite-backup.log"
echo "  • SSL: /var/log/elite-ssl-renew.log"
echo "  • Docker: /var/log/elite-docker-cleanup.log"

