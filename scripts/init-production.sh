#!/bin/bash

# Elite-Mark.com Production Initialization Script
# This script runs inside the Docker container on first startup

set -e

echo "🚀 Initializing Elite-Mark.com Production..."

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
until nc -z db-elite 3306; do
  echo "   Database is unavailable - sleeping"
  sleep 2
done
echo "✅ Database is ready!"

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Run database migrations
echo "📦 Running database migrations..."
npx prisma migrate deploy

# Check if database needs seeding (only if empty)
echo "🌱 Checking if database needs seeding..."
RECORD_COUNT=$(node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.user.count().then(count => {
  console.log(count);
  prisma.\$disconnect();
}).catch(e => {
  console.log('0');
  prisma.\$disconnect();
});
")

if [ "$RECORD_COUNT" -eq "0" ]; then
  echo "📝 Database is empty, running seed..."
  npm run db:seed
else
  echo "ℹ️  Database already has data, skipping seed"
fi

echo "✅ Production initialization complete!"
echo "🌐 Elite-Mark.com is ready to serve!"

