import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis

// Suppress Prisma errors during build (when database is not available)
// Check if we're in build phase or if DATABASE_URL is not set
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' || 
                    (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) ||
                    (!process.env.DATABASE_URL && process.env.NODE_ENV !== 'development')

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: isBuildTime 
      ? [] // Suppress all logs during build
      : process.env.NODE_ENV === 'development' 
        ? ['query', 'error', 'warn'] 
        : ['error'],
    errorFormat: isBuildTime ? 'minimal' : 'pretty',
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Helper function to check if Prisma client is properly initialized
export function checkPrismaClient() {
  if (!prisma) {
    throw new Error('Prisma client is not initialized. Please check your database connection.')
  }
  
  // Check if common models exist
  if (!prisma.caseStudy) {
    throw new Error('Prisma client models not found. Please run: npm run db:generate')
  }
  
  if (!prisma.log) {
    throw new Error('Log model not found in Prisma client. Please run: npm run db:generate')
  }
  
  return true
}






