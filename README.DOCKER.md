# Elite Site - Docker Development Setup

This project is dockerized for easy development setup.

## Quick Start

```bash
# Start everything
docker-compose up --build

# Access the app
# http://localhost:3000
# Dashboard: http://localhost:3000/dashboard
# Login: admin@elite.com / admin123
```

## What's Included

- ✅ Next.js development server
- ✅ Prisma ORM with SQLite database
- ✅ Pre-seeded database with sample content
- ✅ Hot reload enabled
- ✅ Persistent database storage

## Commands

```bash
# Start
docker-compose up

# Start in background
docker-compose up -d

# Stop
docker-compose down

# View logs
docker-compose logs -f app

# Rebuild
docker-compose up --build

# Run commands in container
docker-compose exec app npm run db:seed
docker-compose exec app npx prisma studio
```

See `DOCKER.md` for detailed documentation.




