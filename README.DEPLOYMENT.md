# 🚀 Elite-Mark.com - Production Deployment Package

> **Complete Docker setup for deploying your Next.js application to production**

## 🎯 What You Get

A **production-ready** deployment package with:

✅ **Docker Configuration** - Optimized multi-stage Dockerfile  
✅ **MySQL Database** - Persistent data with automated backups  
✅ **Nginx Integration** - Reverse proxy with SSL support  
✅ **Automated Scripts** - One-command deployment  
✅ **Health Monitoring** - Built-in health checks  
✅ **Security Hardened** - Rate limiting, security headers, attack prevention  
✅ **Comprehensive Docs** - Step-by-step guides for every scenario  

## 📚 Documentation Guide

Choose the right guide for your needs:

| Document | Best For | Time Required |
|----------|----------|---------------|
| **[DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md)** | Quick overview & reference | 5 min read |
| **[QUICK_DEPLOY.md](QUICK_DEPLOY.md)** | Fast deployment walkthrough | 25 min total |
| **[DEPLOY_FROM_WINDOWS.md](DEPLOY_FROM_WINDOWS.md)** | Deploying from Windows to Linux | 30 min total |
| **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** | Comprehensive reference | Full guide |
| **[README.PRODUCTION.md](README.PRODUCTION.md)** | Day-to-day operations | Reference |

## ⚡ Quick Start (3 Commands)

```bash
# 1. Generate secrets
./scripts/generate-secrets.sh > secrets.txt

# 2. Create environment file
cp .env.production.template .env.production
# Edit .env.production with secrets from secrets.txt

# 3. Deploy!
sudo ./deploy.sh
```

Then configure SSL and Nginx (see [QUICK_DEPLOY.md](QUICK_DEPLOY.md))

## 📁 Project Structure

```
elite-site/
├── 📄 Deployment Files
│   ├── docker-compose.prod.yml    # Production Docker Compose
│   ├── Dockerfile.prod            # Optimized production build
│   ├── deploy.sh                  # Automated deployment script
│   └── .env.production.template   # Environment variables template
│
├── 🌐 Nginx Configuration
│   ├── nginx-elite-mark.conf      # Elite-mark.com config
│   └── nginx-complete.conf        # All sites (3 domains)
│
├── 🔧 Utility Scripts
│   ├── scripts/generate-secrets.sh    # Generate secure passwords
│   ├── scripts/backup-database.sh     # Database backup
│   ├── scripts/restore-database.sh    # Database restore
│   ├── scripts/health-check.sh        # System health check
│   └── scripts/setup-cron.sh          # Automated tasks
│
├── 📚 Documentation
│   ├── DEPLOYMENT_SUMMARY.md      # Overview (start here!)
│   ├── QUICK_DEPLOY.md            # 25-minute guide
│   ├── DEPLOY_FROM_WINDOWS.md     # Windows to Linux
│   ├── DEPLOYMENT_GUIDE.md        # Comprehensive guide
│   └── README.PRODUCTION.md       # Operations manual
│
└── 🎯 Application
    ├── src/                       # Next.js application
    ├── prisma/                    # Database schema
    └── public/                    # Static assets
```

## 🎬 Deployment Scenarios

### Scenario 1: First Time Deployment
👉 Start with **[QUICK_DEPLOY.md](QUICK_DEPLOY.md)**

### Scenario 2: Deploying from Windows
👉 Follow **[DEPLOY_FROM_WINDOWS.md](DEPLOY_FROM_WINDOWS.md)**

### Scenario 3: Need Detailed Reference
👉 Read **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)**

### Scenario 4: Daily Operations
👉 Use **[README.PRODUCTION.md](README.PRODUCTION.md)**

## 🏗️ Architecture

```
                    Internet
                       ↓
              ┌────────────────┐
              │  Nginx :80/443 │
              │  (Reverse Proxy)│
              └────────┬───────┘
                       ↓
        ┌──────────────┴──────────────┐
        │   Docker Network            │
        │   (elite-network)           │
        │                             │
        │  ┌──────────────────────┐  │
        │  │   elite-app          │  │
        │  │   Next.js :3000      │  │
        │  │   - API Routes       │  │
        │  │   - SSR Pages        │  │
        │  │   - Static Assets    │  │
        │  └──────────┬───────────┘  │
        │             ↓               │
        │  ┌──────────────────────┐  │
        │  │   elite-db           │  │
        │  │   MySQL :3306        │  │
        │  │   - User data        │  │
        │  │   - Content          │  │
        │  │   - Logs             │  │
        │  └──────────────────────┘  │
        └─────────────────────────────┘
                 ↓         ↓
          ┌──────────┐  ┌──────────┐
          │ Uploads  │  │  MySQL   │
          │ Volume   │  │  Volume  │
          └──────────┘  └──────────┘
```

## 🔐 Security Features

### Network Security
- ✅ Database not exposed to internet
- ✅ Internal Docker network isolation
- ✅ Rate limiting (10 req/s per IP)
- ✅ Attack vector blocking (WordPress, etc.)

### SSL/TLS
- ✅ HTTPS with Let's Encrypt
- ✅ TLS 1.2 & 1.3 only
- ✅ Strong cipher suites
- ✅ HSTS enabled

### Application Security
- ✅ Non-root container user
- ✅ Environment variable secrets
- ✅ JWT authentication
- ✅ Input validation
- ✅ Security headers

### Data Security
- ✅ Automated daily backups
- ✅ Encrypted connections
- ✅ Password hashing (bcrypt)
- ✅ SQL injection prevention (Prisma)

## 📊 Monitoring & Maintenance

### Health Monitoring
```bash
# Quick health check
./scripts/health-check.sh

# Detailed monitoring
docker stats elite-app elite-db
```

### Logs
```bash
# Application logs
docker logs -f elite-app

# All services
docker-compose -f docker-compose.prod.yml logs -f

# Nginx logs
sudo tail -f /var/log/nginx/error.log
```

### Backups
```bash
# Manual backup
./scripts/backup-database.sh

# Setup automated backups
sudo ./scripts/setup-cron.sh
```

### Updates
```bash
# Update application
git pull origin main
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

## 🎯 Your Three Sites

After deployment, nginx will serve:

### 1. raheedbrides.com (Existing Production)
- Upstream: `http://app:3000`
- SSL: `/etc/nginx/certs/live/raheedbrides.com/`
- Features: phpMyAdmin access

### 2. raheedbrides.cloud (Existing Staging)
- Upstream: `http://app-staging:3000`
- SSL: `/etc/nginx/certs/staging/`
- Features: Basic auth, SEO blocked

### 3. elite-mark.com (New Production) ⭐
- Upstream: `http://elite-app:3000`
- SSL: `/etc/nginx/certs/live/elite-mark.com/`
- Features: Full production setup

## 🔄 Common Commands

### Container Management
```bash
# Start all services
docker-compose -f docker-compose.prod.yml up -d

# Stop all services
docker-compose -f docker-compose.prod.yml down

# Restart application
docker-compose -f docker-compose.prod.yml restart app-elite

# View status
docker-compose -f docker-compose.prod.yml ps
```

### Database Operations
```bash
# Backup
./scripts/backup-database.sh

# Restore
./scripts/restore-database.sh /path/to/backup.sql.gz

# Access MySQL
docker exec -it elite-db mysql -u elite_user -p

# Run migrations
docker exec -it elite-app npx prisma migrate deploy
```

### Application Management
```bash
# Create admin user
docker exec -it elite-app node scripts/create-admin.js

# View logs
docker logs -f elite-app

# Execute command in container
docker exec -it elite-app npm run <command>
```

## 🐛 Troubleshooting

### Quick Diagnostics
```bash
# 1. Check health
./scripts/health-check.sh

# 2. Check logs
docker-compose -f docker-compose.prod.yml logs -f

# 3. Check nginx
sudo nginx -t
sudo systemctl status nginx

# 4. Test connectivity
curl http://localhost:3000/api/health
curl https://elite-mark.com/api/health
```

### Common Issues

**Container won't start**
```bash
docker logs elite-app
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d
```

**Database connection failed**
```bash
docker exec -it elite-db mysql -u root -p
# Verify DATABASE_URL in .env.production
```

**Site not accessible**
```bash
# Check DNS
dig elite-mark.com

# Check SSL
curl -vI https://elite-mark.com

# Check nginx
sudo nginx -t
sudo systemctl reload nginx
```

## 📈 Performance Optimization

### Caching
- Static assets: 1 year cache
- API responses: No cache (dynamic)
- Next.js static: Immutable cache

### Resource Limits
```yaml
# Add to docker-compose.prod.yml if needed
deploy:
  resources:
    limits:
      cpus: '2'
      memory: 2G
    reservations:
      cpus: '1'
      memory: 1G
```

### Database Optimization
```sql
-- Run inside MySQL
ANALYZE TABLE User, Testimonial, CaseStudy;
OPTIMIZE TABLE User, Testimonial, CaseStudy;
```

## ✅ Pre-Deployment Checklist

### Server Requirements
- [ ] Ubuntu/Debian Linux server
- [ ] Docker & Docker Compose installed
- [ ] Nginx installed and running
- [ ] Domain pointing to server IP
- [ ] Ports 80 and 443 open
- [ ] SSH access configured

### Configuration
- [ ] `.env.production` created with secure secrets
- [ ] SSL certificates obtained
- [ ] Nginx configuration updated
- [ ] Firewall rules configured
- [ ] Backup strategy planned

### Post-Deployment
- [ ] Health check passing
- [ ] Website accessible via HTTPS
- [ ] Dashboard login working
- [ ] Database operations working
- [ ] File uploads working
- [ ] Automated backups scheduled
- [ ] Monitoring configured

## 🆘 Support & Resources

### Documentation
1. **Quick Start**: [QUICK_DEPLOY.md](QUICK_DEPLOY.md)
2. **Windows Guide**: [DEPLOY_FROM_WINDOWS.md](DEPLOY_FROM_WINDOWS.md)
3. **Full Guide**: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
4. **Operations**: [README.PRODUCTION.md](README.PRODUCTION.md)
5. **Summary**: [DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md)

### Useful Scripts
- `./scripts/generate-secrets.sh` - Generate secure passwords
- `./scripts/health-check.sh` - System health check
- `./scripts/backup-database.sh` - Database backup
- `./scripts/restore-database.sh` - Database restore
- `./scripts/setup-cron.sh` - Automated tasks

### External Resources
- [Next.js Docs](https://nextjs.org/docs)
- [Docker Docs](https://docs.docker.com)
- [Nginx Docs](https://nginx.org/en/docs)
- [Prisma Docs](https://www.prisma.io/docs)

## 🎉 Ready to Deploy?

1. **Choose your guide** based on your scenario
2. **Follow the steps** carefully
3. **Test thoroughly** after deployment
4. **Monitor** for 24 hours
5. **Celebrate!** 🎊

---

## 📞 Quick Help

**Deployment failing?**
```bash
./scripts/health-check.sh
docker-compose -f docker-compose.prod.yml logs -f
```

**Need to rollback?**
```bash
docker-compose -f docker-compose.prod.yml down
./scripts/restore-database.sh /path/to/backup.sql.gz
docker-compose -f docker-compose.prod.yml up -d
```

**Site not loading?**
```bash
sudo nginx -t
sudo systemctl status nginx
curl https://elite-mark.com/api/health
```

---

**Version**: 1.0.0  
**Last Updated**: December 2024  
**Maintainer**: Elite Development Team

**Good luck with your deployment! 🚀**

