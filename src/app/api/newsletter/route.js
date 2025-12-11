import { NextResponse } from 'next/server'
import { newsletterService } from '@/services/newsletterService'
import { requireAdmin } from '@/lib/auth'

// Public: Anyone can subscribe to newsletter
export async function POST(request) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const subscription = await newsletterService.subscribe(email.trim().toLowerCase())
    
    return NextResponse.json(
      { 
        message: 'Successfully subscribed to newsletter',
        subscription 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to subscribe to newsletter' },
      { status: 500 }
    )
  }
}

// Protected: Only authenticated admin can view all subscriptions
export async function GET(request) {
  // Verify authentication
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) {
    return authResult // Return error response if not authenticated
  }

  try {
    const subscriptions = await newsletterService.getAll()
    return NextResponse.json(subscriptions)
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch newsletter subscriptions' },
      { status: 500 }
    )
  }
}


