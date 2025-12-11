#!/bin/bash

# Deploy pre-built Next.js application on server
# Run this script on your Linux server after transferring the built files

set -e

echo "📥 Deploying pre-built application..."
echo ""

# Check if zip file exists
ZIP_FILE=$(ls elite-site-built-*.zip 2>/dev/null | head -1)

if [ -z "$ZIP_FILE" ]; then
    echo "❌ No built package found!"
    echo "   Looking for: elite-site-built-*.zip"
    echo "   Please transfer the built package to this directory first."
    echo "   Example: scp elite-site-built-*.zip user@server:/root/elite-site/"
    exit 1
fi

echo "📦 Found package: $ZIP_FILE"
echo ""

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo "❌ .env.production not found!"
    echo "   Please create .env.production with all required variables."
    exit 1
fi

# Backup existing .next directory if it exists
if [ -d ".next" ]; then
    echo "💾 Backing up existing .next directory..."
    mv .next .next.backup.$(date +%Y%m%d-%H%M%S)
fi

# Extract the package
echo "📂 Extracting package..."
unzip -q -o "$ZIP_FILE"

if [ $? -ne 0 ]; then
    echo "❌ Failed to extract package!"
    exit 1
fi

echo "✅ Package extracted successfully!"
echo ""

# Verify .next directory exists
if [ ! -d ".next" ]; then
    echo "❌ .next directory not found after extraction!"
    exit 1
fi

# Verify .next/standalone exists (required for standalone mode)
if [ ! -d ".next/standalone" ]; then
    echo "❌ .next/standalone directory not found!"
    echo "   Make sure you built with 'output: standalone' in next.config.mjs"
    exit 1
fi

echo "✅ Build files verified!"
echo ""

# Build Docker image using pre-built files
echo "🏗️  Building Docker image with pre-built files..."
docker compose -f docker-compose.prod.prebuilt.yml build

if [ $? -ne 0 ]; then
    echo "❌ Docker build failed!"
    exit 1
fi

echo ""
echo "✅ Docker image built successfully!"
echo ""

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker compose -f docker-compose.prod.prebuilt.yml down 2>/dev/null || true

# Start containers
echo "🚀 Starting containers..."
docker compose -f docker-compose.prod.prebuilt.yml up -d

if [ $? -ne 0 ]; then
    echo "❌ Failed to start containers!"
    exit 1
fi

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📊 Container status:"
docker compose -f docker-compose.prod.prebuilt.yml ps

echo ""
echo "📋 Useful commands:"
echo "   View logs: docker compose -f docker-compose.prod.prebuilt.yml logs -f"
echo "   Stop: docker compose -f docker-compose.prod.prebuilt.yml down"
echo "   Restart: docker compose -f docker-compose.prod.prebuilt.yml restart"
echo ""

