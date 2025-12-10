import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
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






