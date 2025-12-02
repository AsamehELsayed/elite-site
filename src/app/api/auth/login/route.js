import { NextResponse } from 'next/server'
import { authService } from '@/services/authService'

export async function POST(request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const result = await authService.login(email, password)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Login failed' },
      { status: 401 }
    )
  }
}



