# Elite-Mark.com Production Setup

## 📋 Overview

This repository contains a production-ready Next.js application with MySQL database, containerized with Docker and configured for deployment behind Nginx reverse proxy.

## 🏗️ Architecture

```
Internet
    ↓
Nginx (Port 80/443)
    ↓
Docker Network (elite-network)
    ├── elite-app (Next.js on port 3000)
    └── db-elite (MySQL on port 3306)
```

## 📁 Key Files

### Docker Configuration
- `Dockerfile.prod` - Production-optimized multi-stage Dockerfile
- `docker-compose.prod.yml` - Production Docker Compose configuration
- `.dockerignore` - Files to exclude from Docker build

### Deployment Scripts
- `deploy.sh` - Automated deployment script
- `scripts/init-production.sh` - Container initialization script

### Nginx Configuration
- `nginx-elite-mark.conf` - Elite-mark.com specific configuration
- `nginx-complete.conf` - Complete configuration with all sites

### Environment
- `.env.production.template` - Template for production environment variables
- `.env.production` - Actual production config (create from template, **DO NOT COMMIT**)

### Documentation
- `DEPLOYMENT_GUIDE.md` - Comprehensive deployment documentation
- `QUICK_DEPLOY.md` - Fast-track deployment guide (25 minutes)
- `README.PRODUCTION.md` - This file

## 🚀 Quick Start

### Option 1: Automated Deployment (Recommended)

```bash
# 1. Setup environment
cp .env.production.template .env.production
nano .env.production  # Edit with your credentials

# 2. Run deployment script
sudo chmod +x deploy.sh
sudo ./deploy.sh

# 3. Configure SSL & Nginx (see QUICK_DEPLOY.md)
```

### Option 2: Manual Deployment

```bash
# 1. Build and start containers
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d

# 2. Check status
docker-compose -f docker-compose.prod.yml ps

# 3. View logs
docker-compose -f docker-compose.prod.yml logs -f
```

## 🔐 Security Checklist

- [ ] Strong passwords in `.env.production`
- [ ] JWT_SECRET is 64+ characters
- [ ] SSL certificates installed and auto-renewing
- [ ] Firewall configured (UFW recommended)
- [ ] Database not exposed to public
- [ ] Regular backups scheduled
- [ ] Security headers enabled in Nginx
- [ ] Rate limiting configured

## 📊 Monitoring

### Health Check
```bash
curl https://elite-mark.com/api/health
```

### Container Status
```bash
docker-compose -f docker-compose.prod.yml ps
```

### View Logs
```bash
# All logs
docker-compose -f docker-compose.prod.yml logs -f

# Application only
docker logs -f elite-app

# Database only
docker logs -f elite-db
```

### Resource Usage
```bash
docker stats elite-app elite-db
```

## 🔄 Common Operations

### Restart Application
```bash
docker-compose -f docker-compose.prod.yml restart app-elite
```

### Update Application
```bash
git pull origin main
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
docker exec -it elite-app npx prisma migrate deploy
```

### Database Backup
```bash
docker exec elite-db mysqldump -u elite_user -p elite_production > backup_$(date +%Y%m%d).sql
```

### Database Restore
```bash
docker exec -i elite-db mysql -u elite_user -p elite_production < backup_20241210.sql
```

### Access Database
```bash
docker exec -it elite-db mysql -u elite_user -p
```

### Run Migrations
```bash
docker exec -it elite-app npx prisma migrate deploy
```

### Create Admin User
```bash
docker exec -it elite-app node scripts/create-admin.js
```

## 🐛 Troubleshooting

### Container Won't Start
```bash
# Check logs
docker logs elite-app

# Check if port is already in use
sudo netstat -tulpn | grep :3000

# Restart Docker
sudo systemctl restart docker
```

### Database Connection Failed
```bash
# Check if database is running
docker ps | grep elite-db

# Check database logs
docker logs elite-db

# Test connection
docker exec elite-app npx prisma db pull
```

### Nginx Can't Reach Container
```bash
# Check if containers are on same network
docker network inspect elite-network

# Test from inside container
docker exec elite-app wget -O- http://localhost:3000/api/health

# Check nginx logs
sudo tail -f /var/log/nginx/error.log
```

### Site Not Accessible
```bash
# Check DNS
dig elite-mark.com

# Check SSL
curl -vI https://elite-mark.com

# Test nginx config
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

## 📈 Performance Tips

1. **Enable Nginx Caching** - Cache static assets and API responses
2. **Optimize Images** - Use Next.js Image component
3. **Database Indexing** - Add indexes to frequently queried fields
4. **CDN** - Use CloudFlare or similar for static assets
5. **Monitoring** - Setup Grafana/Prometheus for metrics

## 🔒 Security Best Practices

1. **Regular Updates**
   ```bash
   sudo apt update && sudo apt upgrade
   docker-compose -f docker-compose.prod.yml pull
   ```

2. **Firewall Rules**
   ```bash
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw allow 22/tcp
   sudo ufw enable
   ```

3. **Fail2Ban** (Brute force protection)
   ```bash
   sudo apt install fail2ban
   sudo systemctl enable fail2ban
   ```

4. **Automated Backups**
   - Database: Daily at 2 AM
   - Files: Daily at 3 AM
   - Retention: 7 days

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Docker Documentation](https://docs.docker.com)
- [Nginx Documentation](https://nginx.org/en/docs)

## 🆘 Support

1. **Check Logs First**
   ```bash
   docker-compose -f docker-compose.prod.yml logs -f
   ```

2. **Review Documentation**
   - `DEPLOYMENT_GUIDE.md` - Comprehensive guide
   - `QUICK_DEPLOY.md` - Quick reference

3. **Common Issues**
   - Port conflicts: Change port mapping in docker-compose.prod.yml
   - Permission errors: Check file ownership and permissions
   - Database errors: Verify DATABASE_URL and credentials

## 📝 Environment Variables

### Required
- `MYSQL_ROOT_PASSWORD` - MySQL root password
- `MYSQL_DATABASE` - Database name (elite_production)
- `MYSQL_USER` - Database user
- `MYSQL_PASSWORD` - Database password
- `DATABASE_URL` - Full connection string
- `JWT_SECRET` - JWT signing secret (64+ chars)
- `NEXT_PUBLIC_SITE_URL` - Public site URL

### Optional
- `SMTP_HOST` - Email server host
- `SMTP_PORT` - Email server port
- `SMTP_USER` - Email username
- `SMTP_PASS` - Email password

## 🎯 Production Checklist

Before going live:

- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] Nginx configured and tested
- [ ] Database migrated and seeded
- [ ] Admin user created
- [ ] Health check passing
- [ ] Backups configured
- [ ] Monitoring setup
- [ ] DNS configured
- [ ] Firewall rules set
- [ ] Security headers verified
- [ ] Rate limiting tested
- [ ] Error pages customized
- [ ] Analytics integrated
- [ ] SEO metadata configured

## 📊 Metrics to Monitor

- Response time (< 200ms ideal)
- Error rate (< 0.1% ideal)
- CPU usage (< 70% average)
- Memory usage (< 80% average)
- Disk space (> 20% free)
- Database connections (< 80% of max)
- Request rate (within rate limits)

---

**Version**: 1.0.0  
**Last Updated**: December 2024  
**Maintainer**: Elite Development Team

