import { NextResponse } from 'next/server'
import { testimonialService } from '@/services/testimonialService'

export async function GET(request, { params }) {
  try {
    const { id } = params
    const testimonial = await testimonialService.getById(id)
    if (!testimonial) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(testimonial)
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch testimonial' },
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    const testimonial = await testimonialService.update(id, body)
    return NextResponse.json(testimonial)
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to update testimonial' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params
    await testimonialService.delete(id)
    return NextResponse.json({ message: 'Testimonial deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete testimonial' },
      { status: 500 }
    )
  }
}

