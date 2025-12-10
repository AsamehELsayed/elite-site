import { NextResponse } from 'next/server'
import { authService } from '@/services/authService'

/**
 * Middleware to verify JWT token and authenticate requests
 * @param {Request} request - The incoming request
 * @returns {Object|NextResponse} - Returns decoded token or error response
 */
export async function authenticate(request) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required. Please provide a valid token.' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication token is missing' },
        { status: 401 }
      )
    }

    const decoded = await authService.verifyToken(token)
    
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      )
    }

    return decoded // Return decoded token with user info
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication failed. Invalid or expired token.' },
      { status: 401 }
    )
  }
}

/**
 * Check if user has admin role
 * @param {Object} user - The decoded user object from token
 * @returns {boolean} - Returns true if user is admin
 */
export function isAdmin(user) {
  return user && user.role === 'admin'
}

/**
 * Middleware to require admin role
 * @param {Request} request - The incoming request
 * @returns {Object|NextResponse} - Returns user object or error response
 */
export async function requireAdmin(request) {
  const authResult = await authenticate(request)
  
  // If authResult is a NextResponse (error), return it
  if (authResult instanceof NextResponse) {
    return authResult
  }
  
  // Check if user is admin
  if (!isAdmin(authResult)) {
    return NextResponse.json(
      { error: 'Access denied. Admin privileges required.' },
      { status: 403 }
    )
  }
  
  return authResult // Return user object
}








