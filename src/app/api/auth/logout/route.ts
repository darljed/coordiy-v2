import { NextResponse } from 'next/server'
import { clearAuthCookie } from '@/lib/auth'

/**
 * POST /api/auth/logout
 * Clear authentication session
 */
export async function POST() {
  try {
    const response = NextResponse.json({
      message: 'Logged out successfully'
    })
    
    // Clear auth cookie
    response.cookies.delete('auth-token')
    
    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}