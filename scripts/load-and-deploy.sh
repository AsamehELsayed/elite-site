#!/bin/bash

# Load Docker image and deploy on server
# Run this script on your Linux server after transferring the image

set -e

echo "📥 Loading Docker image..."
echo ""

# Check if image file exists
IMAGE_FILE="elite-site-latest.tar"

if [ ! -f "$IMAGE_FILE" ]; then
    echo "❌ Image file $IMAGE_FILE not found!"
    echo "   Please transfer the image file to this directory first."
    echo "   Example: scp elite-site-latest.tar user@server:/root/elite-site/"
    exit 1
fi

# Load the image
echo "🔄 Loading image from $IMAGE_FILE..."
docker load -i "$IMAGE_FILE"

if [ $? -ne 0 ]; then
    echo "❌ Failed to load image!"
    exit 1
fi

echo ""
echo "✅ Image loaded successfully!"
echo ""

# Tag the image for docker-compose (if needed)
docker tag elite-site:latest elite-site-app-elite:latest 2>/dev/null || true

echo "🚀 Image is ready!"
echo ""
echo "📋 Next steps:"
echo "   1. Make sure .env.production exists with all required variables"
echo "   2. Run: docker compose -f docker-compose.prod.yml up -d"
echo ""

