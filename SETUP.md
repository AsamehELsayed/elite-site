# Dashboard Setup Instructions

## Quick Start with Docker (Recommended)

```bash
# Start everything with Docker
docker-compose up --build

# Access the app
# Website: http://localhost:3000
# Dashboard: http://localhost:3000/dashboard
# Login: admin@elite.com / admin123
```

See `DOCKER.md` for detailed Docker documentation.

---

## Manual Setup

## 1. Install Dependencies

```bash
npm install
```

This will install:
- Prisma ORM and Prisma Client
- bcryptjs for password hashing
- jsonwebtoken for authentication

## 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
# Local MySQL example
DATABASE_URL="mysql://elite:elitepassword@localhost:3306/elite"
JWT_SECRET="your-secret-key-change-this-in-production"
NODE_ENV="development"
```

## 3. Initialize Database

```bash
# Generate Prisma Client
npm run db:generate

# Create database and tables
npm run db:push
```

## 4. Create Admin User

You can create an admin user by running a script or using Prisma Studio:

```bash
npm run db:studio
```

Or create a script at `scripts/create-admin.js`:

```javascript
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const user = await prisma.user.create({
    data: {
      email: 'admin@elite.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin'
    }
  })
  console.log('Admin user created:', user)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

Then run: `node scripts/create-admin.js`

## 5. Start Development Server

```bash
npm run dev
```

## 6. Access Dashboard

- Dashboard: http://localhost:3000/dashboard
- Login: http://localhost:3000/dashboard/login

Default credentials (if you created the admin user):
- Email: admin@elite.com
- Password: admin123

## API Endpoints

All API routes are in `src/app/api/`:

- `POST /api/auth/login` - Login
- `GET /api/testimonials` - Get all testimonials
- `POST /api/testimonials` - Create testimonial
- `PUT /api/testimonials/[id]` - Update testimonial
- `DELETE /api/testimonials/[id]` - Delete testimonial

Similar endpoints exist for:
- `/api/case-studies`
- `/api/visuals`
- `/api/philosophy`
- `/api/hero`
- `/api/stats`
- `/api/contact-bookings`

## Database Schema

The database uses **MySQL** via Prisma. You can change connection details through `DATABASE_URL` in `.env` and `docker-compose.yml`.

Models:
- User (authentication)
- Testimonial
- CaseStudy
- Visual
- Philosophy
- Hero
- Stat
- ContactBooking

## Architecture

- **Routes** (`src/app/api/*/route.js`) - Handle HTTP requests/responses only
- **Services** (`src/services/*Service.js`) - Contain all business logic
- **Database** - Prisma ORM with SQLite (easily switchable to PostgreSQL/MySQL)

