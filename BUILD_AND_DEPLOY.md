# Build Locally and Deploy to Server

This guide explains how to build the Docker image locally (on Windows) and transfer it to your Linux server.

## Prerequisites

- Docker Desktop installed on your local Windows machine
- SSH access to your Linux server
- SCP or similar tool for file transfer

## Step 1: Build Image Locally (Windows)

Run the PowerShell script to build and save the image:

```powershell
.\build-and-transfer.ps1
```

This will:
1. Build the Docker image using `Dockerfile.prod`
2. Save it to `elite-site-latest.tar` file
3. Display the file size and next steps

**Alternative manual method:**
```powershell
# Build the image
docker build -f Dockerfile.prod -t elite-site:latest .

# Save to tar file
docker save elite-site:latest -o elite-site-latest.tar
```

## Step 2: Transfer Image to Server

Transfer the tar file to your server using SCP:

```bash
scp elite-site-latest.tar user@your-server:/root/elite-site/
```

Replace:
- `user` with your server username
- `your-server` with your server IP or hostname

**Example:**
```bash
scp elite-site-latest.tar root@srv1087024:/root/elite-site/
```

## Step 3: Load Image on Server

SSH into your server and load the image:

```bash
ssh user@your-server
cd /root/elite-site
docker load -i elite-site-latest.tar
```

**Or use the provided script:**
```bash
chmod +x scripts/load-and-deploy.sh
./scripts/load-and-deploy.sh
```

## Step 4: Deploy with Docker Compose

Make sure you have `.env.production` file on the server with all required variables:

```env
MYSQL_ROOT_PASSWORD=your-password
MYSQL_DATABASE=elite_production
MYSQL_USER=elite_user
MYSQL_PASSWORD=your-password
JWT_SECRET=your-jwt-secret
NEXT_PUBLIC_SITE_URL=https://raheedbrides.cloud
```

Then start the containers:

```bash
docker compose -f docker-compose.prod.yml up -d
```

## Verify Deployment

Check if containers are running:

```bash
docker compose -f docker-compose.prod.yml ps
```

Check logs:

```bash
docker compose -f docker-compose.prod.yml logs -f app-elite
```

Test health endpoint:

```bash
curl http://localhost:3000/api/health
```

## Updating the Image

When you need to update:

1. Make your code changes locally
2. Run `.\build-and-transfer.ps1` again
3. Transfer the new `elite-site-latest.tar` to server
4. On server:
   ```bash
   docker load -i elite-site-latest.tar
   docker compose -f docker-compose.prod.yml up -d --force-recreate app-elite
   ```

## Troubleshooting

### Image not found error
If you get "image not found", make sure you loaded the image:
```bash
docker images | grep elite-site
```

### Container won't start
Check logs:
```bash
docker compose -f docker-compose.prod.yml logs app-elite
```

### Environment variables missing
Make sure `.env.production` exists and has all required variables.

## File Sizes

The Docker image tar file is typically 200-500 MB depending on your dependencies. Make sure you have:
- Enough disk space locally
- Enough disk space on server
- Stable internet connection for transfer

