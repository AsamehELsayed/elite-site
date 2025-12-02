import { NextResponse } from 'next/server'
import { testimonialService } from '@/services/testimonialService'

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

export async function POST(request) {
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

