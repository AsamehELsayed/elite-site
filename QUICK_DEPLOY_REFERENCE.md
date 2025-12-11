# Quick Deploy Reference - One Page Guide

## 🚀 Fastest Deployment Method (3 Steps)

### On Your Linux Server:

```bash
# 1. Navigate to project
cd /root/elite-site

# 2. Run the quick deploy script
chmod +x quick-deploy.sh
./quick-deploy.sh

# OR manually (if script not available):
export DOCKER_BUILDKIT=1 COMPOSE_DOCKER_CLI_BUILD=1 && \
docker compose -f docker-compose.prod.yml build && \
docker compose -f docker-compose.prod.yml up -d
```

---

## 📋 Pre-Deployment Checklist

- [ ] `.env` file exists with all required variables
- [ ] Code is pushed to Git (or transferred to server)
- [ ] Docker and Docker Compose are installed
- [ ] Server has enough disk space (at least 5GB free)

---

## 🔧 Required .env Variables

```env
MYSQL_ROOT_PASSWORD=your_secure_root_password
MYSQL_DATABASE=elite_db
MYSQL_USER=elite_user
MYSQL_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret_min_32_chars
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

---

## ⚡ Speed Optimization Commands

### Enable BuildKit (Always use this!)
```bash
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1
```

### Build with cache (Fast)
```bash
docker compose -f docker-compose.prod.yml build
```

### Build without cache (Slow, but clean)
```bash
docker compose -f docker-compose.prod.yml build --no-cache
```

---

## 📊 Common Commands

| Task | Command |
|------|---------|
| **Build** | `docker compose -f docker-compose.prod.yml build` |
| **Start** | `docker compose -f docker-compose.prod.yml up -d` |
| **Stop** | `docker compose -f docker-compose.prod.yml down` |
| **Restart** | `docker compose -f docker-compose.prod.yml restart` |
| **View Logs** | `docker compose -f docker-compose.prod.yml logs -f app-elite` |
| **Status** | `docker compose -f docker-compose.prod.yml ps` |
| **Rebuild & Restart** | `docker compose -f docker-compose.prod.yml up -d --build` |

---

## 🔍 Troubleshooting

### Build is slow?
```bash
# Enable BuildKit
export DOCKER_BUILDKIT=1 COMPOSE_DOCKER_CLI_BUILD=1

# Clean up old images
docker system prune -a
```

### Container won't start?
```bash
# Check logs
docker compose -f docker-compose.prod.yml logs app-elite

# Check if .env exists
ls -la .env

# Verify environment variables
docker compose -f docker-compose.prod.yml config
```

### Out of disk space?
```bash
# Check disk usage
df -h

# Clean Docker
docker system prune -a --volumes
```

---

## 🎯 Update Deployment (After Code Changes)

```bash
# Pull latest code
git pull origin main

# Rebuild and restart (with BuildKit)
export DOCKER_BUILDKIT=1 COMPOSE_DOCKER_CLI_BUILD=1 && \
docker compose -f docker-compose.prod.yml build && \
docker compose -f docker-compose.prod.yml up -d
```

---

## ⏱️ Expected Times

- **First Build**: 5-10 minutes
- **Subsequent Builds**: 2-5 minutes (with cache)
- **Container Startup**: 30-60 seconds
- **Total Deployment**: 8-15 minutes (first), 3-7 minutes (updates)

---

## 📚 Full Tutorial

See `FAST_DEPLOY_TUTORIAL.md` for detailed step-by-step instructions.

