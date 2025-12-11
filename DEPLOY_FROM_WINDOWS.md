# Deploying raheedbrides.cloud from Windows to Linux Server

## 📋 Overview

You're developing on Windows but deploying to a Linux server. This guide shows you how to transfer files and deploy.

## 🚀 Deployment Methods

### Method 1: Using Git (Recommended)

#### Step 1: Push to Git Repository
```powershell
# On Windows (in your project directory)
git add .
git commit -m "Production deployment setup"
git push origin main
```

#### Step 2: Pull on Server
```bash
# SSH into your Linux server
ssh user@your-server-ip

# Navigate to deployment directory
cd /opt

# Clone or pull repository
git clone https://github.com/your-username/elite-site.git
# OR if already cloned:
cd elite-site
git pull origin main

# Make scripts executable
chmod +x deploy.sh scripts/*.sh
```

#### Step 3: Deploy
```bash
# Generate secrets
./scripts/generate-secrets.sh

# Create .env.production
nano .env.production
# Paste the generated secrets

# Run deployment
sudo ./deploy.sh
```

---

### Method 2: Using SCP/SFTP

#### Using WinSCP (GUI)
1. Download WinSCP: https://winscp.net/
2. Connect to your server
3. Upload entire `elite-site` folder to `/opt/`
4. Use PuTTY to SSH and run deployment commands

#### Using PowerShell SCP
```powershell
# On Windows
scp -r C:\Users\elite\elite-site user@your-server-ip:/opt/
```

Then SSH and deploy:
```bash
ssh user@your-server-ip
cd /opt/elite-site
chmod +x deploy.sh scripts/*.sh
sudo ./deploy.sh
```

---

### Method 3: Using FileZilla (FTP/SFTP)

1. Download FileZilla: https://filezilla-project.org/
2. Connect to your server using SFTP
3. Upload the `elite-site` folder
4. SSH to server and run deployment

---

## 🔧 Complete Deployment Steps

### On Windows (Preparation)

1. **Verify all files are ready**
```powershell
# Check if all deployment files exist
dir deploy.sh
dir docker-compose.prod.yml
dir Dockerfile.prod
dir nginx-elite-mark.conf
dir scripts\*.sh
```

2. **Commit to Git (if using Git method)**
```powershell
git status
git add .
git commit -m "Production deployment ready"
git push origin main
```

### On Linux Server (Deployment)

1. **Connect to server**
```bash
ssh user@your-server-ip
```

2. **Get the code**
```bash
# If using Git:
cd /opt
git clone https://github.com/your-username/elite-site.git
cd elite-site

# If uploaded via SCP/FTP:
cd /opt/elite-site
```

3. **Make scripts executable**
```bash
chmod +x deploy.sh
chmod +x scripts/*.sh
```

4. **Generate secrets**
```bash
./scripts/generate-secrets.sh
```

**Save this output!** You'll need it for the next step.

5. **Create environment file**
```bash
nano .env.production
```

Paste this template and fill in the secrets from step 4:
```env
# Database Configuration
MYSQL_ROOT_PASSWORD=<paste-from-generate-secrets>
MYSQL_DATABASE=elite_production
MYSQL_USER=elite_user
MYSQL_PASSWORD=<paste-from-generate-secrets>

# Application Configuration
NODE_ENV=production
DATABASE_URL=mysql://elite_user:<password>@db-elite:3306/elite_production

# Security
JWT_SECRET=<paste-from-generate-secrets>

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://raheedbrides.cloud
```

Save with `Ctrl+X`, then `Y`, then `Enter`

6. **Run deployment**
```bash
sudo ./deploy.sh
```

This will:
- ✅ Validate environment
- ✅ Build Docker images (~5 minutes)
- ✅ Start containers
- ✅ Run database migrations
- ✅ Seed initial data
- ✅ Verify health

7. **Get SSL certificates**
```bash
# Stop nginx temporarily
sudo systemctl stop nginx

# Get certificate
sudo certbot certonly --standalone \
  -d raheedbrides.cloud \
  -d www.raheedbrides.cloud \
  --agree-tos \
  --email your-email@example.com

# Start nginx
sudo systemctl start nginx
```

8. **Configure Nginx**
```bash
# Backup existing config
sudo cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup

# Edit nginx config
sudo nano /etc/nginx/nginx.conf
```

Add the raheedbrides.cloud configuration from `nginx-elite-mark.conf` file.

Or use the complete configuration:
```bash
sudo cp nginx-complete.conf /etc/nginx/nginx.conf
```

Test and reload:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

9. **Create admin user**
```bash
docker exec -it elite-app node scripts/create-admin.js
```

10. **Setup automated tasks**
```bash
sudo ./scripts/setup-cron.sh
```

11. **Verify deployment**
```bash
# Run health check
./scripts/health-check.sh

# Test in browser
curl https://raheedbrides.cloud/api/health
```

---

## 🔍 Verification Checklist

After deployment, verify:

- [ ] Containers are running: `docker ps`
- [ ] Health check passes: `curl https://raheedbrides.cloud/api/health`
- [ ] Website loads: Open https://raheedbrides.cloud in browser
- [ ] Dashboard accessible: https://raheedbrides.cloud/dashboard
- [ ] SSL certificate valid: Check in browser
- [ ] No errors in logs: `docker logs elite-app`

---

## 🐛 Troubleshooting

### Can't SSH to Server
```powershell
# Test connection
ssh -v user@your-server-ip

# Check if port 22 is open
Test-NetConnection -ComputerName your-server-ip -Port 22
```

### SCP Upload Fails
```powershell
# Make sure SSH works first
ssh user@your-server-ip

# Try with verbose mode
scp -v -r elite-site user@your-server-ip:/opt/
```

### Permission Denied on Server
```bash
# Check file ownership
ls -la /opt/elite-site

# Fix ownership
sudo chown -R $USER:$USER /opt/elite-site

# Or run with sudo
sudo ./deploy.sh
```

### Docker Not Found
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt update
sudo apt install docker-compose-plugin
```

### Containers Won't Start
```bash
# Check logs
docker logs elite-app
docker logs elite-db

# Check if ports are in use
sudo netstat -tulpn | grep :3000

# Restart Docker
sudo systemctl restart docker
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📝 Quick Reference Commands

### On Windows (Development)
```powershell
# Push code to Git
git add .
git commit -m "Update"
git push origin main

# Connect to server
ssh user@your-server-ip
```

### On Linux Server (Production)
```bash
# Update code
cd /opt/elite-site
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Health check
./scripts/health-check.sh

# Backup database
./scripts/backup-database.sh

# Restart application
docker-compose -f docker-compose.prod.yml restart app-elite
```

---

## 🔐 Security Notes

### Protect Your Secrets
- ✅ Never commit `.env.production` to Git
- ✅ Use strong passwords (generated by `generate-secrets.sh`)
- ✅ Keep SSH keys secure
- ✅ Use SSH key authentication instead of passwords

### SSH Key Setup (Recommended)
```powershell
# On Windows, generate SSH key
ssh-keygen -t ed25519 -C "your-email@example.com"

# Copy public key to server
type $env:USERPROFILE\.ssh\id_ed25519.pub | ssh user@your-server-ip "cat >> ~/.ssh/authorized_keys"

# Now you can SSH without password
ssh user@your-server-ip
```

---

## 📚 Additional Resources

### Windows Tools
- **WinSCP**: https://winscp.net/ (GUI file transfer)
- **PuTTY**: https://www.putty.org/ (SSH client)
- **Git for Windows**: https://git-scm.com/download/win
- **Windows Terminal**: https://aka.ms/terminal (Better PowerShell)

### Documentation
- `QUICK_DEPLOY.md` - Fast deployment guide
- `DEPLOYMENT_GUIDE.md` - Comprehensive guide
- `README.PRODUCTION.md` - Operations manual
- `DEPLOYMENT_SUMMARY.md` - Quick reference

---

## ✅ Success!

Once deployed, your site will be live at:
- **Website**: https://raheedbrides.cloud
- **Dashboard**: https://raheedbrides.cloud/dashboard
- **Health**: https://raheedbrides.cloud/api/health

Your nginx will serve three sites:
1. raheedbrides.com (existing)
2. raheedbrides.cloud (staging)
3. raheedbrides.cloud (new) ⭐

---

## 🆘 Need Help?

1. **Check logs first**
   ```bash
   docker-compose -f docker-compose.prod.yml logs -f
   ```

2. **Run health check**
   ```bash
   ./scripts/health-check.sh
   ```

3. **Review documentation**
   - Start with `QUICK_DEPLOY.md`
   - Detailed help in `DEPLOYMENT_GUIDE.md`

4. **Common issues**
   - Port conflicts: Change port in docker-compose.prod.yml
   - Permission errors: Run with `sudo`
   - Database errors: Check `.env.production`
   - SSL errors: Verify certificate paths

---

**Total Time**: ~30 minutes from Windows to production! 🚀

Good luck with your deployment!


