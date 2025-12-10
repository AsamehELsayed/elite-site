#!/bin/bash

# Elite-Mark.com Production Deployment Script
# Run this script on your production server

set -e

echo "🚀 Elite-Mark.com Production Deployment"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}❌ Please run with sudo${NC}"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo -e "${YELLOW}⚠️  .env.production not found!${NC}"
    echo "Creating from template..."
    
    if [ -f .env.production.template ]; then
        cp .env.production.template .env.production
        echo -e "${YELLOW}📝 Please edit .env.production with your secure credentials${NC}"
        echo "   Run: nano .env.production"
        echo ""
        echo "   Generate secure passwords with:"
        echo "   - JWT Secret: openssl rand -base64 48"
        echo "   - DB Password: openssl rand -base64 32"
        exit 1
    else
        echo -e "${RED}❌ .env.production.template not found${NC}"
        exit 1
    fi
fi

# Load environment variables
set -a
source .env.production
set +a

echo -e "${GREEN}✅ Environment loaded${NC}"

# Validate required environment variables
REQUIRED_VARS=("MYSQL_ROOT_PASSWORD" "MYSQL_DATABASE" "MYSQL_USER" "MYSQL_PASSWORD" "JWT_SECRET" "NEXT_PUBLIC_SITE_URL")
MISSING_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -ne 0 ]; then
    echo -e "${RED}❌ Missing required environment variables:${NC}"
    printf '   - %s\n' "${MISSING_VARS[@]}"
    exit 1
fi

echo -e "${GREEN}✅ All required environment variables set${NC}"

# Check if JWT_SECRET is strong enough
if [ ${#JWT_SECRET} -lt 32 ]; then
    echo -e "${RED}❌ JWT_SECRET is too short (minimum 32 characters)${NC}"
    echo "   Generate a secure one with: openssl rand -base64 48"
    exit 1
fi

echo -e "${GREEN}✅ JWT_SECRET is strong${NC}"

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p /var/www/elite-uploads
chown -R www-data:www-data /var/www/elite-uploads 2>/dev/null || chown -R 1001:1001 /var/www/elite-uploads
chmod -R 755 /var/www/elite-uploads

echo -e "${GREEN}✅ Directories created${NC}"

# Stop existing containers if running
echo "🛑 Stopping existing containers (if any)..."
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true

# Build the production image
echo "🏗️  Building production Docker image..."
echo "   This may take several minutes..."
docker-compose -f docker-compose.prod.yml build --no-cache

echo -e "${GREEN}✅ Build complete${NC}"

# Start the containers
echo "🚀 Starting containers..."
docker-compose -f docker-compose.prod.yml up -d

# Wait for containers to be healthy
echo "⏳ Waiting for containers to be healthy..."
sleep 10

# Check container status
echo "📊 Container status:"
docker-compose -f docker-compose.prod.yml ps

# Test health endpoint
echo "🏥 Testing health endpoint..."
sleep 5

MAX_RETRIES=30
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if docker exec elite-app wget -q -O- http://localhost:3000/api/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Application is healthy!${NC}"
        break
    fi
    
    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo "   Attempt $RETRY_COUNT/$MAX_RETRIES - waiting for app to be ready..."
    sleep 2
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo -e "${RED}❌ Application failed to become healthy${NC}"
    echo "   Check logs with: docker-compose -f docker-compose.prod.yml logs -f"
    exit 1
fi

# Display logs
echo ""
echo "📋 Recent logs:"
docker-compose -f docker-compose.prod.yml logs --tail=20

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🎉 Elite-Mark.com is now running!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 Next steps:"
echo ""
echo "1. Configure Nginx:"
echo "   - Copy nginx-elite-mark.conf to your nginx configuration"
echo "   - Test: sudo nginx -t"
echo "   - Reload: sudo systemctl reload nginx"
echo ""
echo "2. Setup SSL certificates:"
echo "   - sudo certbot certonly --standalone -d elite-mark.com -d www.elite-mark.com"
echo ""
echo "3. Monitor the application:"
echo "   - View logs: docker-compose -f docker-compose.prod.yml logs -f"
echo "   - Check health: curl http://localhost:3000/api/health"
echo ""
echo "4. Create admin user:"
echo "   - docker exec -it elite-app node scripts/create-admin.js"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📚 Full documentation: See DEPLOYMENT_GUIDE.md"
echo ""

