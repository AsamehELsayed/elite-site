import { NextResponse } from 'next/server'
import { philosophyService } from '@/services/philosophyService'

export async function GET() {
  try {
    const philosophy = await philosophyService.get()
    return NextResponse.json(philosophy)
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch philosophy' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const philosophy = await philosophyService.create(body)
    return NextResponse.json(philosophy, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to create philosophy' },
      { status: 500 }
    )
  }
}

export async function PUT(request) {
  try {
    const body = await request.json()
    const philosophy = await philosophyService.upsert(body)
    return NextResponse.json(philosophy)
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to update philosophy' },
      { status: 500 }
    )
  }
}



