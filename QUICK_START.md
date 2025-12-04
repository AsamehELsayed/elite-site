# Quick Start Guide

## Local Development (SQLite)

### 1. Setup Environment

Create `.env.local` file:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="dev-secret-key"
NODE_ENV="development"
```

### 2. Install & Setup

```bash
# Install dependencies
npm install

# Setup database (auto-detects SQLite for local dev)
npm run db:push

# Seed database
npm run db:seed

# Start development server
npm run dev
```

### 3. Access Application

- Website: http://localhost:3000
- Dashboard: http://localhost:3000/dashboard
- Login: admin@elite.com / admin123

## Docker Development (MySQL)

```bash
# Start with Docker (uses MySQL)
docker-compose up --build
```

## How Database Selection Works

The system automatically detects your environment:

- **Local Development** (`NODE_ENV=development` + no Docker):
  - Uses **SQLite** if `DATABASE_URL` starts with `file:` or is not set
  - Database file: `./dev.db`

- **Docker/Production**:
  - Uses **MySQL** if `DATABASE_URL` starts with `mysql:`
  - Or if `DOCKER_ENV=true` is set

## Commands

```bash
npm run db:setup    # Configure schema for current environment
npm run db:push     # Create/update database tables
npm run db:seed     # Seed initial data
npm run db:studio   # Open Prisma Studio
npm run dev         # Start development server
```

## Troubleshooting

**Database provider mismatch?**
```bash
npm run db:setup
npm run db:push
```

**Reset database?**
```bash
# Delete dev.db file (SQLite)
rm dev.db

# Or reset with Prisma
npm run db:reset
```

See `DATABASE_SETUP.md` for detailed documentation.

