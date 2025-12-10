# Elite-Mark.com Production Deployment Guide

## Prerequisites

1. **Server with Docker installed**
2. **Domain configured** (elite-mark.com pointing to your server IP)
3. **SSL Certificates** (Let's Encrypt recommended)
4. **Nginx already running** with your existing sites

## Step-by-Step Deployment

### 1. Prepare Environment Variables

```bash
# On your production server, navigate to your elite-site directory
cd /path/to/elite-site

# Copy the example environment file
cp .env.production.example .env.production

# Edit with secure credentials
nano .env.production
```

**Important**: Generate strong passwords and JWT secret:
```bash
# Generate a secure JWT secret (64 characters)
openssl rand -base64 48

# Generate database passwords
openssl rand -base64 32
```

### 2. SSL Certificate Setup

```bash
# Install certbot if not already installed
sudo apt update
sudo apt install certbot

# Stop nginx temporarily
sudo systemctl stop nginx

# Generate SSL certificate for elite-mark.com
sudo certbot certonly --standalone -d elite-mark.com -d www.elite-mark.com

# Start nginx again
sudo systemctl start nginx
```

Certificates will be at:
- `/etc/letsencrypt/live/elite-mark.com/fullchain.pem`
- `/etc/letsencrypt/live/elite-mark.com/privkey.pem`

### 3. Build and Start Docker Containers

```bash
# Build the production image
docker-compose -f docker-compose.prod.yml build --no-cache

# Start the containers
docker-compose -f docker-compose.prod.yml up -d

# Check if containers are running
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f app-elite
```

### 4. Initialize Database

```bash
# Run Prisma migrations
docker exec -it elite-app npx prisma migrate deploy

# Seed the database (optional, for initial data)
docker exec -it elite-app npm run db:seed

# Create admin user (if needed)
docker exec -it elite-app node scripts/create-admin.js
```

### 5. Configure Nginx

```bash
# Copy the elite-mark nginx configuration
sudo nano /etc/nginx/sites-available/elite-mark.conf

# Paste the contents from nginx-elite-mark.conf file

# Or append to your existing nginx config file
sudo nano /etc/nginx/nginx.conf
# Add the elite-mark.com server blocks

# Test nginx configuration
sudo nginx -t

# If test passes, reload nginx
sudo systemctl reload nginx
```

### 6. Setup Upload Volume

```bash
# Create uploads directory on host (for persistence)
sudo mkdir -p /var/www/elite-uploads

# Set proper permissions
sudo chown -R www-data:www-data /var/www/elite-uploads
sudo chmod -R 755 /var/www/elite-uploads

# Mount this in nginx configuration
# (already configured in nginx-elite-mark.conf)
```

### 7. Connect Nginx to Docker Network

```bash
# Connect nginx to elite-network if nginx is in Docker
docker network connect elite-network nginx-container-name

# If nginx is on host, it can reach containers via localhost:port mapping
# or via Docker network IP
```

### 8. Verify Deployment

```bash
# Check health endpoint
curl https://elite-mark.com/api/health

# Expected response:
# {"status":"healthy","timestamp":"...","database":"connected","environment":"production"}

# Check main site
curl -I https://elite-mark.com

# Should return 200 OK
```

### 9. Setup Auto-Restart

```bash
# Containers are set to restart: always
# They will auto-restart on system reboot

# To verify restart policy:
docker inspect elite-app | grep -A 3 RestartPolicy
```

### 10. SSL Certificate Auto-Renewal

```bash
# Setup cron job for certificate renewal
sudo crontab -e

# Add this line (runs twice daily):
0 0,12 * * * certbot renew --quiet --post-hook "systemctl reload nginx"
```

## Monitoring and Maintenance

### View Logs

```bash
# Application logs
docker logs -f elite-app

# Database logs
docker logs -f elite-db

# All services
docker-compose -f docker-compose.prod.yml logs -f
```

### Database Backup

```bash
# Create backup script
cat > /root/backup-elite-db.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/root/backups/elite"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

docker exec elite-db mysqldump -u elite_user -p${MYSQL_PASSWORD} elite_production > $BACKUP_DIR/elite_db_$DATE.sql
gzip $BACKUP_DIR/elite_db_$DATE.sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete
EOF

chmod +x /root/backup-elite-db.sh

# Add to crontab (daily at 2 AM)
sudo crontab -e
# Add: 0 2 * * * /root/backup-elite-db.sh
```

### Update Application

```bash
# Pull latest code
cd /path/to/elite-site
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

# Run migrations if needed
docker exec -it elite-app npx prisma migrate deploy
```

### Rollback

```bash
# Stop current containers
docker-compose -f docker-compose.prod.yml down

# Restore database backup
docker exec -i elite-db mysql -u elite_user -p${MYSQL_PASSWORD} elite_production < /root/backups/elite/elite_db_YYYYMMDD_HHMMSS.sql

# Start previous version
# (checkout previous git commit first)
docker-compose -f docker-compose.prod.yml up -d
```

## Troubleshooting

### Container won't start

```bash
# Check logs
docker logs elite-app

# Check if database is ready
docker exec -it elite-db mysql -u root -p -e "SHOW DATABASES;"

# Restart specific service
docker-compose -f docker-compose.prod.yml restart app-elite
```

### Database connection issues

```bash
# Verify DATABASE_URL in container
docker exec elite-app env | grep DATABASE_URL

# Test database connection
docker exec elite-app npx prisma db pull
```

### Nginx can't reach container

```bash
# Check if containers are on same network
docker network inspect elite-network

# Test from host
curl http://localhost:3000/api/health  # Should fail if not exposed
docker exec elite-app wget -O- http://localhost:3000/api/health  # Should work

# Check nginx can resolve hostname
docker exec nginx-container nslookup elite-app
```

### Upload files not persisting

```bash
# Check volume mounts
docker inspect elite-app | grep -A 10 Mounts

# Check permissions
ls -la /var/www/elite-uploads/

# Fix permissions
sudo chown -R 1001:1001 /var/www/elite-uploads/  # nextjs user in container
```

## Performance Optimization

### Enable Nginx Caching (Optional)

Add to nginx config:
```nginx
proxy_cache_path /var/cache/nginx/elite levels=1:2 keys_zone=elite_cache:10m max_size=100m inactive=60m;

location / {
    proxy_cache elite_cache;
    proxy_cache_valid 200 10m;
    proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
    proxy_cache_bypass $http_cache_control;
    add_header X-Cache-Status $upstream_cache_status;
    
    # ... rest of proxy settings
}
```

### Database Optimization

```bash
# Inside container, optimize MySQL
docker exec -it elite-db mysql -u root -p

# Run these SQL commands:
ANALYZE TABLE User, Testimonial, CaseStudy, Philosophy;
OPTIMIZE TABLE User, Testimonial, CaseStudy, Philosophy;
```

## Security Checklist

- [x] Strong database passwords set in .env.production
- [x] JWT_SECRET is random and secure (64+ characters)
- [x] SSL certificates configured and auto-renewing
- [x] Security headers enabled in nginx
- [x] Rate limiting configured
- [x] Database not exposed to public (no port mapping)
- [x] File upload size limited (20MB)
- [x] WordPress attack vectors blocked
- [x] Sensitive files (.env, .git) not accessible
- [ ] Firewall configured (UFW recommended)
- [ ] Fail2ban installed for brute force protection
- [ ] Regular security updates scheduled

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| MYSQL_ROOT_PASSWORD | MySQL root password | `secure_random_password_123` |
| MYSQL_DATABASE | Database name | `elite_production` |
| MYSQL_USER | Database user | `elite_user` |
| MYSQL_PASSWORD | Database password | `secure_db_password_456` |
| DATABASE_URL | Full database connection string | `mysql://elite_user:password@db-elite:3306/elite_production` |
| JWT_SECRET | Secret for JWT tokens | `64_character_random_string` |
| NEXT_PUBLIC_SITE_URL | Public site URL | `https://elite-mark.com` |
| NODE_ENV | Environment | `production` |

## Support

For issues or questions:
1. Check logs: `docker-compose -f docker-compose.prod.yml logs -f`
2. Review nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Check health endpoint: `curl https://elite-mark.com/api/health`
4. Verify DNS: `dig elite-mark.com`
5. Test SSL: `curl -vI https://elite-mark.com`

## Next Steps

1. **Monitor for 24 hours** - Watch logs and ensure stability
2. **Setup monitoring** - Consider tools like Grafana, Prometheus, or cloud monitoring
3. **Configure backups** - Automate database and file backups
4. **Performance testing** - Use tools like Apache Bench or k6
5. **SEO optimization** - Submit sitemap to Google Search Console
6. **Analytics** - Setup Google Analytics or alternative

