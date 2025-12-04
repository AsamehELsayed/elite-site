import { NextResponse } from 'next/server'
import { testimonialService } from '@/services/testimonialService'
import { requireAdmin } from '@/lib/auth'

// Public: Guest users can view testimonials
export async function GET() {
  try {
    const testimonials = await testimonialService.getAll()
    return NextResponse.json(testimonials)
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch testimonials' },
      { status: 500 }
    )
  }
}

// Protected: Only authenticated admin can create testimonials
export async function POST(request) {
  // Verify authentication
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) {
    return authResult // Return error response if not authenticated
  }

  try {
    const body = await request.json()
    const testimonial = await testimonialService.create(body)
    return NextResponse.json(testimonial, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to create testimonial' },
      { status: 500 }
    )
  }
}

