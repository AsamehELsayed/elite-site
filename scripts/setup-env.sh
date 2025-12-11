#!/bin/bash

# Setup script for creating .env file with secure random values
# Run this on your production server: bash scripts/setup-env.sh

set -e

ENV_FILE=".env"

if [ -f "$ENV_FILE" ]; then
    echo "⚠️  .env file already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Aborted."
        exit 1
    fi
fi

echo "🔐 Generating secure values..."

# Generate secure random values
MYSQL_ROOT_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)
MYSQL_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)
JWT_SECRET=$(openssl rand -base64 48 | tr -d "=+/" | cut -c1-64)

# Default values (you can change these)
MYSQL_DATABASE="elite_production"
MYSQL_USER="elite_user"
NEXT_PUBLIC_SITE_URL="https://raheedbrides.cloud"

# Create .env file
cat > "$ENV_FILE" << EOF
# MySQL Database Configuration
MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
MYSQL_DATABASE=${MYSQL_DATABASE}
MYSQL_USER=${MYSQL_USER}
MYSQL_PASSWORD=${MYSQL_PASSWORD}

# Application Configuration
JWT_SECRET=${JWT_SECRET}
NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}

# Note: DATABASE_URL is automatically constructed from the above variables
EOF

echo "✅ .env file created successfully!"
echo ""
echo "📋 Generated values:"
echo "   MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}"
echo "   MYSQL_PASSWORD: ${MYSQL_PASSWORD}"
echo "   JWT_SECRET: ${JWT_SECRET}"
echo ""
echo "⚠️  IMPORTANT: Save these credentials securely!"
echo "   The .env file is gitignored and won't be committed."
echo ""
echo "🚀 You can now run: docker compose -f docker-compose.prod.yml build"

