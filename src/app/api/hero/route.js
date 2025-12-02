import { NextResponse } from 'next/server'
import { heroService } from '@/services/heroService'

export async function GET() {
  try {
    const hero = await heroService.get()
    return NextResponse.json(hero)
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch hero' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const hero = await heroService.create(body)
    return NextResponse.json(hero, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to create hero' },
      { status: 500 }
    )
  }
}

export async function PUT(request) {
  try {
    const body = await request.json()
    const hero = await heroService.upsert(body)
    return NextResponse.json(hero)
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to update hero' },
      { status: 500 }
    )
  }
}



