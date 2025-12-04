# Database Setup Guide

## Overview

This project supports **two database configurations**:

- **SQLite** - For local development (default when running locally)
- **MySQL** - For production and Docker environments

The database provider is automatically detected based on your environment and `DATABASE_URL`.

## Local Development (SQLite)

### Quick Start

1. **Create `.env.local` file** in the project root:
   ```env
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="dev-secret-key"
   NODE_ENV="development"
   ```

2. **Setup database:**
   ```bash
   npm run db:setup    # Configures schema for SQLite
   npm run db:push     # Creates database and tables
   npm run db:seed     # Seeds initial data
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

### SQLite Database File

- Database file: `./dev.db` (created automatically)
- **Add to `.gitignore`** (already included):
  ```
  *.db
  *.db-journal
  dev.db
  ```

## Production/Docker (MySQL)

### Using Docker Compose

The `docker-compose.yml` is already configured for MySQL:

```bash
docker-compose up --build
```

This automatically:
- Starts MySQL container
- Sets `DATABASE_URL` to MySQL connection string
- Configures Prisma for MySQL
- Runs migrations and seeds

### Manual MySQL Setup

1. **Create `.env` file:**
   ```env
   DATABASE_URL="mysql://user:password@localhost:3306/database_name"
   JWT_SECRET="your-production-secret"
   NODE_ENV="production"
   DOCKER_ENV="true"  # Or set when in Docker
   ```

2. **Setup database:**
   ```bash
   npm run db:setup    # Configures schema for MySQL
   npm run db:push     # Creates database and tables
   npm run db:seed     # Seeds initial data
   ```

## How It Works

The `scripts/setup-db.js` script automatically:

1. **Checks environment:**
   - If `NODE_ENV=development` AND not in Docker → SQLite
   - If `DATABASE_URL` starts with `file:` → SQLite
   - Otherwise → MySQL

2. **Updates Prisma schema:**
   - Sets correct `provider` in `datasource`
   - Removes MySQL-specific annotations (`@db.Text`) for SQLite
   - Keeps MySQL annotations for MySQL

3. **Runs before Prisma commands:**
   - All `db:*` scripts automatically run `db:setup` first
   - Ensures schema matches your environment

## Environment Detection

| Condition | Database | Provider |
|-----------|----------|----------|
| `NODE_ENV=development` + No Docker | SQLite | `sqlite` |
| `DATABASE_URL` starts with `file:` | SQLite | `sqlite` |
| `DATABASE_URL` contains `sqlite` | SQLite | `sqlite` |
| `DOCKER_ENV=true` | MySQL | `mysql` |
| `DATABASE_URL` starts with `mysql:` | MySQL | `mysql` |
| Default | MySQL | `mysql` |

## Database Differences

### SQLite (Local Development)
- ✅ No server required
- ✅ Fast setup
- ✅ File-based (easy to reset)
- ✅ Perfect for development
- ❌ Not suitable for production

### MySQL (Production)
- ✅ Production-ready
- ✅ Better performance at scale
- ✅ Advanced features
- ✅ Used in Docker setup
- ❌ Requires database server

## Schema Compatibility

The Prisma schema is compatible with both databases:

- **SQLite**: Automatically removes `@db.Text` annotations
- **MySQL**: Keeps `@db.Text` for proper text columns

All models work identically in both databases.

## Switching Between Databases

### From SQLite to MySQL

1. Update `.env`:
   ```env
   DATABASE_URL="mysql://user:password@localhost:3306/db"
   ```

2. Run setup:
   ```bash
   npm run db:setup
   npm run db:push
   ```

### From MySQL to SQLite

1. Update `.env.local`:
   ```env
   DATABASE_URL="file:./dev.db"
   ```

2. Run setup:
   ```bash
   npm run db:setup
   npm run db:push
   ```

## Troubleshooting

### "Provider mismatch" error

Run `npm run db:setup` to reconfigure the schema for your current environment.

### SQLite database not found

The database file is created automatically on first `db:push`. Make sure you have write permissions in the project directory.

### MySQL connection failed

- Check MySQL server is running
- Verify `DATABASE_URL` format: `mysql://user:password@host:port/database`
- Ensure database exists
- Check firewall/network settings

### Schema out of sync

```bash
# Reset and reconfigure
npm run db:setup
npm run db:push
```

## Migration Notes

When switching databases, you may need to:

1. **Export data** from old database (if needed)
2. **Run setup** to configure new provider
3. **Push schema** to create tables
4. **Import data** (if needed)

## Best Practices

1. **Local Development**: Use SQLite for simplicity
2. **Docker Development**: Use MySQL (already configured)
3. **Production**: Always use MySQL or PostgreSQL
4. **Never commit**: Database files (`.db`) or `.env` files
5. **Always run**: `npm run db:setup` before Prisma commands

## Scripts Reference

| Command | Description |
|---------|-------------|
| `npm run db:setup` | Configure schema for current environment |
| `npm run db:generate` | Generate Prisma Client (auto-runs setup) |
| `npm run db:push` | Push schema to database (auto-runs setup) |
| `npm run db:studio` | Open Prisma Studio (auto-runs setup) |
| `npm run db:seed` | Seed database with initial data |
| `npm run db:migrate` | Run migrations (auto-runs setup) |
| `npm run db:reset` | Reset database (auto-runs setup) |

## Example .env Files

### .env.local (SQLite - Local Development)
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="dev-secret-key"
NODE_ENV="development"
```

### .env (MySQL - Production)
```env
DATABASE_URL="mysql://elite:password@localhost:3306/elite"
JWT_SECRET="your-production-secret-key"
NODE_ENV="production"
DOCKER_ENV="true"
```

