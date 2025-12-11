# Fast Deployment Tutorial - Step by Step

This guide walks you through deploying your Next.js application to production with optimized build speeds.

## Prerequisites

- Linux server with Docker and Docker Compose installed
- SSH access to your server
- `.env` file prepared with required variables

---

## Step 1: Prepare Your Local Environment (Windows)

### 1.1 Ensure your code is ready
```powershell
# Navigate to your project directory
cd C:\Users\elite\elite-site

# Check git status (optional - make sure changes are committed)
git status
```

### 1.2 Create/verify your .env file
Create a `.env` file in the project root with these variables:
```env
MYSQL_ROOT_PASSWORD=your_secure_root_password_here
MYSQL_DATABASE=elite_db
MYSQL_USER=elite_user
MYSQL_PASSWORD=your_secure_password_here
JWT_SECRET=your_jwt_secret_here_min_32_chars
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

---

## Step 2: Transfer Files to Server

### 2.1 Using SCP (from Windows PowerShell)
```powershell
# Transfer entire project directory
scp -r C:\Users\elite\elite-site root@your-server-ip:/root/elite-site

# OR transfer specific files only (faster)
scp docker-compose.prod.yml Dockerfile.prod .dockerignore root@your-server-ip:/root/elite-site/
scp -r src prisma public scripts root@your-server-ip:/root/elite-site/
scp package.json package-lock.json next.config.mjs root@your-server-ip:/root/elite-site/
```

### 2.2 Using Git (Recommended - Fastest)
```powershell
# On Windows - commit and push
git add .
git commit -m "Production deployment"
git push origin main

# Then on server - pull latest
ssh root@your-server-ip
cd /root/elite-site
git pull origin main
```

---

## Step 3: Connect to Your Server

```powershell
# SSH into your server
ssh root@your-server-ip

# Navigate to project directory
cd /root/elite-site
```

---

## Step 4: Prepare Server Environment

### 4.1 Create .env file on server
```bash
# Create .env file
nano .env
```

Paste your environment variables:
```env
MYSQL_ROOT_PASSWORD=your_secure_root_password_here
MYSQL_DATABASE=elite_db
MYSQL_USER=elite_user
MYSQL_PASSWORD=your_secure_password_here
JWT_SECRET=your_jwt_secret_here_min_32_chars
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

Save and exit: `Ctrl+X`, then `Y`, then `Enter`

### 4.2 Verify Docker is running
```bash
# Check Docker version
docker --version

# Check Docker Compose version
docker compose version

# Check if Docker daemon is running
docker ps
```

### 4.3 Stop existing containers (if any)
```bash
# Stop and remove existing containers
docker compose -f docker-compose.prod.yml down

# Remove old image (optional - forces fresh build)
docker rmi elite-site:latest 2>/dev/null || true
```

---

## Step 5: Fast Build with BuildKit

### 5.1 Enable BuildKit and build (FASTEST METHOD)
```bash
# Set BuildKit environment variables
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

# Build with progress output
docker compose -f docker-compose.prod.yml build --progress=plain
```

**Expected time:** 
- First build: 5-10 minutes (depending on server specs)
- Subsequent builds: 2-5 minutes (with cache)

### 5.2 Alternative: Use the build script
```bash
# Make script executable
chmod +x build-prod.sh

# Run the build script
./build-prod.sh
```

---

## Step 6: Start Services

### 6.1 Start containers in detached mode
```bash
docker compose -f docker-compose.prod.yml up -d
```

### 6.2 Check container status
```bash
# View running containers
docker ps

# View logs (to see startup progress)
docker compose -f docker-compose.prod.yml logs -f app-elite
```

Wait for these messages:
- ✅ Database ready!
- 🔧 Running migrations...
- 🌱 Seeding database if needed...
- 🚀 Starting application...

Press `Ctrl+C` to exit logs view.

---

## Step 7: Verify Deployment

### 7.1 Check container health
```bash
# Check health status
docker compose -f docker-compose.prod.yml ps

# Check if app is responding
curl http://localhost:3000/api/health
```

### 7.2 View application logs
```bash
# View recent logs
docker compose -f docker-compose.prod.yml logs --tail=50 app-elite

# Follow logs in real-time
docker compose -f docker-compose.prod.yml logs -f app-elite
```

---

## Step 8: Configure Reverse Proxy (Nginx)

### 8.1 Install Nginx (if not installed)
```bash
# Ubuntu/Debian
apt update && apt install -y nginx

# CentOS/RHEL
yum install -y nginx
```

### 8.2 Create Nginx configuration
```bash
# Create config file
nano /etc/nginx/sites-available/elite-site
```

Paste this configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Save and exit: `Ctrl+X`, then `Y`, then `Enter`

### 8.3 Enable site and restart Nginx
```bash
# Create symlink (Ubuntu/Debian)
ln -s /etc/nginx/sites-available/elite-site /etc/nginx/sites-enabled/

# Test configuration
nginx -t

# Restart Nginx
systemctl restart nginx

# Enable Nginx on boot
systemctl enable nginx
```

---

## Step 9: SSL Certificate (Let's Encrypt)

### 9.1 Install Certbot
```bash
# Ubuntu/Debian
apt install -y certbot python3-certbot-nginx

# CentOS/RHEL
yum install -y certbot python3-certbot-nginx
```

### 9.2 Obtain SSL certificate
```bash
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow the prompts. Certbot will automatically configure Nginx.

---

## Quick Reference Commands

### Build and Deploy (One-liner)
```bash
export DOCKER_BUILDKIT=1 COMPOSE_DOCKER_CLI_BUILD=1 && \
docker compose -f docker-compose.prod.yml build && \
docker compose -f docker-compose.prod.yml up -d
```

### View Logs
```bash
# App logs
docker compose -f docker-compose.prod.yml logs -f app-elite

# Database logs
docker compose -f docker-compose.prod.yml logs -f db-elite

# All logs
docker compose -f docker-compose.prod.yml logs -f
```

### Restart Services
```bash
# Restart app only
docker compose -f docker-compose.prod.yml restart app-elite

# Restart all services
docker compose -f docker-compose.prod.yml restart
```

### Stop Services
```bash
docker compose -f docker-compose.prod.yml down
```

### Update and Redeploy
```bash
# Pull latest code
git pull origin main

# Rebuild and restart
export DOCKER_BUILDKIT=1 COMPOSE_DOCKER_CLI_BUILD=1 && \
docker compose -f docker-compose.prod.yml build && \
docker compose -f docker-compose.prod.yml up -d
```

---

## Troubleshooting

### Build fails
```bash
# Check Docker disk space
df -h

# Clean up Docker system
docker system prune -a

# Rebuild without cache
docker compose -f docker-compose.prod.yml build --no-cache
```

### Container won't start
```bash
# Check logs
docker compose -f docker-compose.prod.yml logs app-elite

# Check environment variables
docker compose -f docker-compose.prod.yml config

# Verify .env file exists
cat .env
```

### Database connection issues
```bash
# Check if database is running
docker compose -f docker-compose.prod.yml ps db-elite

# Check database logs
docker compose -f docker-compose.prod.yml logs db-elite

# Test database connection
docker exec -it elite-db mysql -u elite_user -p
```

---

## Performance Tips

1. **Use BuildKit**: Always set `DOCKER_BUILDKIT=1` for faster builds
2. **Cache layers**: The optimized Dockerfile uses cache mounts for npm
3. **Incremental builds**: Only rebuild when code changes
4. **Use Git**: Faster than SCP for transferring files
5. **SSD storage**: Use SSD for Docker volumes for better I/O

---

## Estimated Times

- **File transfer (Git)**: 30 seconds - 2 minutes
- **First build**: 5-10 minutes
- **Subsequent builds**: 2-5 minutes (with cache)
- **Container startup**: 30-60 seconds
- **Total deployment time**: 8-15 minutes (first time), 3-7 minutes (updates)

---

## Next Steps

- Set up automated backups for MySQL database
- Configure monitoring and alerts
- Set up CI/CD pipeline for automated deployments
- Configure log rotation
- Set up health check monitoring

