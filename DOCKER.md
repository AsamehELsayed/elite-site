# Docker Setup Guide

## Quick Start

### Prerequisites
- Docker Desktop installed and running
- Docker Compose (included with Docker Desktop)

### Start Development Environment

1. **Build and start the containers:**
   ```bash
   docker-compose up --build
   ```

   This will:
   - Build the Docker image
   - Install dependencies
   - Generate Prisma Client
   - Create database tables
   - Seed the database with initial data
   - Start the Next.js development server

2. **Access the application:**
   - Website: http://localhost:3000
   - Dashboard: http://localhost:3000/dashboard
   - Login: http://localhost:3000/dashboard/login
     - Email: `admin@elite.com`
     - Password: `admin123`

### Stop the containers:
```bash
docker-compose down
```

### View logs:
```bash
docker-compose logs -f
```

### Rebuild after dependency changes:
```bash
docker-compose up --build
```

### Run commands in the container:
```bash
# Access shell
docker-compose exec app sh

# Run Prisma commands
docker-compose exec app npx prisma studio
docker-compose exec app npx prisma db push
docker-compose exec app npm run db:seed
```

## Database

The app uses **MySQL** in Docker:

- Image: `mysql:8.0`
- Hostname inside Docker: `db`
- Default connection string (in `docker-compose.yml`):
  - `DATABASE_URL=mysql://root:@db:3306/elite`

Data is persisted in the `mysql_data` Docker volume, so it survives container restarts.

## Environment Variables

Default environment variables are set in `docker-compose.yml`. To customize:

1. Create a `.env` file in the project root
2. Override variables in `docker-compose.yml` or use environment file

## Production Build

For production, use the `Dockerfile` (not `Dockerfile.dev`):

```bash
docker build -t elite-site .
docker run -p 3000:3000 elite-site
```

Note: For production, you should:
- Use a proper database (PostgreSQL/MySQL) instead of SQLite
- Set secure JWT_SECRET
- Configure proper environment variables
- Use a reverse proxy (nginx, etc.)

## Troubleshooting

### Port already in use
If port 3000 is already in use, change it in `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Use port 3001 on host
```

### Database issues
If you need to reset the database:
```bash
docker-compose exec app npm run db:reset
docker-compose exec app npm run db:seed
```

### Clear everything and start fresh
```bash
docker-compose down -v
docker-compose up --build
```

