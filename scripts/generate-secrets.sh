#!/bin/bash

# Generate secure secrets for production deployment

echo "🔐 Generating Secure Secrets for raheedbrides.cloud"
echo "================================================"
echo ""

# Generate JWT Secret (64 characters)
JWT_SECRET=$(openssl rand -base64 48)
echo "JWT_SECRET (64 chars):"
echo "$JWT_SECRET"
echo ""

# Generate MySQL Root Password
MYSQL_ROOT_PASSWORD=$(openssl rand -base64 32)
echo "MYSQL_ROOT_PASSWORD:"
echo "$MYSQL_ROOT_PASSWORD"
echo ""

# Generate MySQL User Password
MYSQL_PASSWORD=$(openssl rand -base64 32)
echo "MYSQL_PASSWORD:"
echo "$MYSQL_PASSWORD"
echo ""

# Generate complete DATABASE_URL
echo "DATABASE_URL:"
echo "mysql://elite_user:$MYSQL_PASSWORD@db-elite:3306/elite_production"
echo ""

echo "================================================"
echo "⚠️  IMPORTANT: Save these securely!"
echo "   Copy them to your .env.production file"
echo "   NEVER commit these to version control"
echo "================================================"


