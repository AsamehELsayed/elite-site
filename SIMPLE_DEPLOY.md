# Simple Deploy: Build Locally, Push to Server

The simplest approach: build locally with `npm run build`, push built files to server, and run directly with Node.js (no Docker).

## Why This Approach?

- ✅ **Simplest**: No Docker complexity
- ✅ **Fastest**: Just push files and run
- ✅ **Direct**: Run Node.js directly on server
- ✅ **Easy to debug**: Standard Node.js process

## Prerequisites

- Node.js installed on server (Node 22+)
- MySQL running on server (or accessible)
- SSH access to server
- rsync or SCP for file transfer

## Step 1: Build Locally

```powershell
# Build the application
.\build-and-push.ps1
```

Or manually:
```powershell
npm install
npx prisma generate
npm run build
```

This creates `.next/standalone` directory with everything needed.

## Step 2: Push Built Files to Server

### Option A: Using rsync (Recommended - faster, incremental)

```bash
rsync -avz --delete \
  .next/ \
  public/ \
  prisma/ \
  package.json \
  package-lock.json \
  root@srv1087024:/root/elite-site/
```

### Option B: Using SCP

```bash
scp -r .next public prisma package.json package-lock.json root@srv1087024:/root/elite-site/
```

## Step 3: Start on Server

SSH into your server:

```bash
ssh root@srv1087024
cd /root/elite-site

# Make script executable
chmod +x scripts/start-server.sh

# Start the application
./scripts/start-server.sh
```

**Manual start:**
```bash
cd /root/elite-site

# Install production dependencies
npm install --production

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Start the app
node .next/standalone/server.js
```

## Using PM2 (Recommended for Production)

PM2 keeps your app running and restarts it if it crashes:

```bash
# Install PM2 globally
npm install -g pm2

# Start with PM2
pm2 start .next/standalone/server.js --name elite-site

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

**PM2 Commands:**
```bash
pm2 logs elite-site      # View logs
pm2 status               # Check status
pm2 restart elite-site   # Restart
pm2 stop elite-site      # Stop
pm2 delete elite-site    # Remove
```

## Environment Variables

Create `.env.production` on server:

```env
DATABASE_URL=mysql://elite_user:password@localhost:3306/elite_production
JWT_SECRET=your-64-character-secret
NEXT_PUBLIC_SITE_URL=https://raheedbrides.cloud
NODE_ENV=production
```

## File Structure on Server

```
/root/elite-site/
├── .next/
│   └── standalone/     # Built application
│       └── server.js   # Entry point
├── .next/static/       # Static assets
├── public/             # Public files
├── prisma/             # Prisma schema
├── node_modules/       # Production dependencies
├── package.json
└── .env.production     # Environment variables
```

## Updating the Application

1. **Build locally:**
   ```powershell
   npm run build
   ```

2. **Push to server:**
   ```bash
   rsync -avz --delete .next/ public/ root@srv1087024:/root/elite-site/
   ```

3. **Restart on server:**
   ```bash
   # With PM2
   pm2 restart elite-site
   
   # Or manually
   pkill -f "node .next/standalone/server.js"
   node .next/standalone/server.js &
   ```

## Reverse Proxy Setup (nginx)

If using nginx, configure it to proxy to port 3000:

```nginx
server {
    listen 80;
    server_name raheedbrides.cloud;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Advantages Over Docker

- ✅ Simpler: No Docker knowledge needed
- ✅ Faster deployments: Just push and restart
- ✅ Easier debugging: Standard Node.js process
- ✅ Less overhead: No container layer
- ✅ Direct access: Easy to inspect files

## Disadvantages

- ❌ No isolation: App runs directly on server
- ❌ Manual dependency management
- ❌ Need to manage Node.js version
- ❌ Process management (use PM2)

## Troubleshooting

### App won't start
```bash
# Check if port 3000 is in use
lsof -i :3000

# Check logs
pm2 logs elite-site

# Check environment variables
cat .env.production
```

### Database connection errors
```bash
# Test MySQL connection
mysql -u elite_user -p elite_production

# Check DATABASE_URL format
echo $DATABASE_URL
```

### Build files missing
```bash
# Verify .next/standalone exists
ls -la .next/standalone/

# Rebuild and push if needed
```

This is the simplest deployment method - just build, push, and run!

