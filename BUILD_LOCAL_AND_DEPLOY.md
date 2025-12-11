# Build Locally and Deploy Pre-built Files

This guide explains how to build your Next.js application locally with `npm run build` and deploy the built files to your server.

## Prerequisites

- Node.js and npm installed locally (Windows)
- SSH access to your Linux server
- Docker installed on the server
- SCP or similar tool for file transfer

## Step 1: Build Locally (Windows)

Run the PowerShell script to build and package the application:

```powershell
.\build-local.ps1
```

This script will:
1. Install dependencies (if needed)
2. Generate Prisma Client
3. Run `npm run build` to build the Next.js app
4. Package all necessary files into a zip file

**Manual build method:**
```powershell
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Build the application
npm run build
```

The build will create a `.next` directory with the compiled application.

## Step 2: Transfer Built Files to Server

The script creates a zip file named `elite-site-built-YYYYMMDD-HHMMSS.zip`. Transfer it to your server:

```bash
scp elite-site-built-*.zip user@your-server:/root/elite-site/
```

**Example:**
```bash
scp elite-site-built-20241211-120000.zip root@srv1087024:/root/elite-site/
```

## Step 3: Deploy on Server

SSH into your server and run the deployment script:

```bash
ssh user@your-server
cd /root/elite-site

# Make script executable
chmod +x scripts/deploy-prebuilt.sh

# Run deployment
./scripts/deploy-prebuilt.sh
```

**Manual deployment method:**
```bash
# Extract the package
unzip elite-site-built-*.zip

# Make sure .env.production exists
# (create it if it doesn't exist)

# Build and start
docker compose -f docker-compose.prod.prebuilt.yml up -d --build
```

## What Gets Transferred

The build script packages:
- `.next/` - Built Next.js application (standalone output)
- `public/` - Static assets
- `prisma/` - Prisma schema and migrations
- `package.json` & `package-lock.json` - Dependencies info
- `scripts/` - Utility scripts
- `node_modules/.prisma` & `node_modules/@prisma` - Prisma runtime files

## Environment Variables

Make sure `.env.production` exists on the server with:

```env
MYSQL_ROOT_PASSWORD=your-password
MYSQL_DATABASE=elite_production
MYSQL_USER=elite_user
MYSQL_PASSWORD=your-password
JWT_SECRET=your-jwt-secret
NEXT_PUBLIC_SITE_URL=https://raheedbrides.cloud
```

## Verify Deployment

Check container status:
```bash
docker compose -f docker-compose.prod.prebuilt.yml ps
```

View logs:
```bash
docker compose -f docker-compose.prod.prebuilt.yml logs -f app-elite
```

Test health endpoint:
```bash
curl http://localhost:3000/api/health
```

## Updating the Application

When you need to update:

1. Make your code changes locally
2. Run `.\build-local.ps1` again
3. Transfer the new zip file to server
4. On server, run `./scripts/deploy-prebuilt.sh` again

The script will automatically:
- Backup existing `.next` directory
- Extract new files
- Rebuild Docker image
- Restart containers

## Troubleshooting

### Build fails locally
- Make sure all dependencies are installed: `npm install`
- Check that Prisma Client is generated: `npx prisma generate`
- Verify `next.config.mjs` has `output: 'standalone'`

### .next/standalone not found
- Make sure `next.config.mjs` has `output: 'standalone'` configured
- Rebuild: `npm run build`

### Docker build fails on server
- Check that all files were extracted correctly
- Verify `.next/standalone` directory exists
- Check Docker logs: `docker compose -f docker-compose.prod.prebuilt.yml logs`

### Container won't start
- Check environment variables in `.env.production`
- View container logs: `docker compose -f docker-compose.prod.prebuilt.yml logs app-elite`
- Verify database is running: `docker compose -f docker-compose.prod.prebuilt.yml ps`

## File Sizes

The built package is typically 50-150 MB (much smaller than a full Docker image). The `.next/standalone` directory contains everything needed to run the app.

## Benefits of This Approach

- ✅ Faster builds (no compilation on server)
- ✅ Consistent builds (same environment as development)
- ✅ Smaller transfer size (only built files, not source)
- ✅ Less server resources (no build tools needed on server)
- ✅ Easier debugging (build issues caught locally)

