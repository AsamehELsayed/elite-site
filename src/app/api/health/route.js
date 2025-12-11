import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * Health check endpoint for container monitoring
 * Checks database connectivity and application status
 */
export async function GET() {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      environment: process.env.NODE_ENV
    }, { status: 200 });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message
    }, { status: 503 });
  }
}


