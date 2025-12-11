# Quick Deployment Guide for raheedbrides.cloud

## 🚀 Fast Track to Production

### Prerequisites
- Ubuntu/Debian server with Docker installed
- Domain `raheedbrides.cloud` pointing to your server
- Nginx already running (for other sites)

### Step 1: Clone & Setup (5 minutes)

```bash
# SSH into your server
ssh user@your-server-ip

# Clone the repository (or upload via FTP/SCP)
cd /opt
sudo git clone <your-repo-url> elite-site
cd elite-site

# Or if uploading manually:
# scp -r elite-site user@your-server:/opt/
```

### Step 2: Configure Environment (2 minutes)

```bash
# Copy environment template
sudo cp .env.production.template .env.production

# Generate secure credentials
JWT_SECRET=$(openssl rand -base64 48)
DB_PASSWORD=$(openssl rand -base64 32)
ROOT_PASSWORD=$(openssl rand -base64 32)

# Edit .env.production
sudo nano .env.production
```

Replace these values:
```env
MYSQL_ROOT_PASSWORD=<paste ROOT_PASSWORD here>
MYSQL_PASSWORD=<paste DB_PASSWORD here>
JWT_SECRET=<paste JWT_SECRET here>
```

Save with `Ctrl+X`, `Y`, `Enter`

### Step 3: Deploy (10 minutes)

```bash
# Make deploy script executable
sudo chmod +x deploy.sh

# Run deployment
sudo ./deploy.sh
```

The script will:
- ✅ Validate environment
- ✅ Build Docker images
- ✅ Start containers
- ✅ Run database migrations
- ✅ Seed initial data
- ✅ Verify health

### Step 4: SSL Certificates (3 minutes)

```bash
# Stop nginx temporarily
sudo systemctl stop nginx

# Get SSL certificate
sudo certbot certonly --standalone \
  -d raheedbrides.cloud \
  -d www.raheedbrides.cloud \
  --agree-tos \
  --email your-email@example.com

# Start nginx
sudo systemctl start nginx
```

### Step 5: Configure Nginx (2 minutes)

```bash
# Backup existing nginx config
sudo cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup

# Add elite-mark configuration
sudo nano /etc/nginx/nginx.conf
```

Copy the entire content from `nginx-elite-mark.conf` and paste it **before** the last closing brace `}` in your nginx.conf.

Or create a separate site file:
```bash
sudo cp nginx-elite-mark.conf /etc/nginx/sites-available/elite-mark
sudo ln -s /etc/nginx/sites-available/elite-mark /etc/nginx/sites-enabled/
```

Test and reload:
```bash
# Test configuration
sudo nginx -t

# If OK, reload
sudo systemctl reload nginx
```

### Step 6: Create Admin User (1 minute)

```bash
# Run admin creation script
docker exec -it elite-app node scripts/create-admin.js
```

Follow the prompts to create your admin account.

### Step 7: Verify Deployment ✅

```bash
# Check if site is accessible
curl https://raheedbrides.cloud/api/health

# Should return:
# {"status":"healthy","timestamp":"...","database":"connected"}

# Check in browser
# Visit: https://raheedbrides.cloud
```

## 🎉 Done! Your site is live!

### Access Points:
- **Website**: https://raheedbrides.cloud
- **Dashboard**: https://raheedbrides.cloud/dashboard
- **Health Check**: https://raheedbrides.cloud/api/health

### Common Commands:

```bash
# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Restart application
docker-compose -f docker-compose.prod.yml restart app-elite

# Stop everything
docker-compose -f docker-compose.prod.yml down

# Start everything
docker-compose -f docker-compose.prod.yml up -d

# Database backup
docker exec elite-db mysqldump -u elite_user -p elite_production > backup.sql
```

### Troubleshooting:

**Container won't start:**
```bash
docker logs elite-app
```

**Can't access site:**
```bash
# Check if nginx can reach container
docker exec elite-app wget -O- http://localhost:3000/api/health

# Check nginx logs
sudo tail -f /var/log/nginx/error.log
```

**Database issues:**
```bash
# Check database
docker exec -it elite-db mysql -u elite_user -p

# Inside MySQL:
SHOW DATABASES;
USE elite_production;
SHOW TABLES;
```

## 📚 Need More Details?

See `DEPLOYMENT_GUIDE.md` for comprehensive documentation including:
- Monitoring & maintenance
- Backup strategies
- Performance optimization
- Security hardening
- Rollback procedures

## 🆘 Emergency Rollback:

```bash
# Stop containers
docker-compose -f docker-compose.prod.yml down

# Restore database
docker exec -i elite-db mysql -u elite_user -p elite_production < backup.sql

# Start containers
docker-compose -f docker-compose.prod.yml up -d
```

---

**Total Time: ~25 minutes** ⚡

Need help? Check logs first, then review DEPLOYMENT_GUIDE.md


