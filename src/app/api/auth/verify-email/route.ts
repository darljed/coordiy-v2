import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { verifyEmailVerificationToken } from '@/lib/auth'

const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Token is required')
})

/**
 * POST /api/auth/verify-email
 * Verify user email with token
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = verifyEmailSchema.parse(body)

    // Verify token
    const payload = verifyEmailVerificationToken(token)
    
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      )
    }

    // Find user and verify token matches
    const user = await prisma.user.findFirst({
      where: {
        email: payload.email,
        emailVerificationToken: token
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid verification token' },
        { status: 400 }
      )
    }

    // Update user as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null
      }
    })

    return NextResponse.json({
      message: 'Email verified successfully'
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Email verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}