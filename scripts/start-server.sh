#!/bin/bash

# Start the pre-built Next.js application directly (no Docker)
# Run this on your Linux server after pushing built files

set -e

APP_DIR="/root/elite-site"
cd "$APP_DIR"

echo "🚀 Starting raheedbrides.cloud application..."
echo ""

# Check if .next/standalone exists
if [ ! -d ".next/standalone" ]; then
    echo "❌ .next/standalone directory not found!"
    echo "   Make sure you've pushed the built files to the server."
    exit 1
fi

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo "⚠️  Warning: .env.production not found!"
    echo "   Creating from template..."
    cat > .env.production << EOF
MYSQL_ROOT_PASSWORD=change-me
MYSQL_DATABASE=elite_production
MYSQL_USER=elite_user
MYSQL_PASSWORD=change-me
JWT_SECRET=change-me-generate-with-openssl-rand-base64-48
NEXT_PUBLIC_SITE_URL=https://raheedbrides.cloud
EOF
    echo "   Please edit .env.production with your actual values!"
    exit 1
fi

# Load environment variables
set -a
source .env.production
set +a

# Install production dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing production dependencies..."
    npm install --production
fi

# Generate Prisma Client if needed
if [ ! -d "node_modules/.prisma" ]; then
    echo "🔧 Generating Prisma Client..."
    npx prisma generate
fi

# Check if MySQL is accessible
echo "⏳ Checking database connection..."
if ! nc -z localhost 3306 2>/dev/null; then
    echo "⚠️  Warning: MySQL not accessible on localhost:3306"
    echo "   Make sure MySQL is running or update DATABASE_URL"
fi

# Run migrations
echo "🔧 Running database migrations..."
npx prisma migrate deploy || echo "⚠️  Migrations failed or already applied"

# Start the application
echo ""
echo "🚀 Starting application..."
echo "   Port: 3000"
echo "   Environment: production"
echo ""

# Use PM2 if available, otherwise run directly
if command -v pm2 &> /dev/null; then
    echo "📊 Using PM2 to manage the process..."
    pm2 delete elite-site 2>/dev/null || true
    pm2 start .next/standalone/server.js --name elite-site --update-env
    pm2 save
    echo ""
    echo "✅ Application started with PM2!"
    echo "   View logs: pm2 logs elite-site"
    echo "   Status: pm2 status"
else
    echo "⚠️  PM2 not found. Running directly (not recommended for production)"
    echo "   Install PM2: npm install -g pm2"
    echo ""
    node .next/standalone/server.js
fi

