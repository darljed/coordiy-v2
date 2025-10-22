import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { prisma } from '@/lib/prisma'
import { generateToken, setAuthCookie } from '@/lib/auth'
import { getBaseUrl } from '@/lib/url'

/**
 * GET /api/auth/google/callback
 * Handle Google OAuth callback
 */
export async function GET(request: NextRequest) {
  if (process.env.NEXT_PUBLIC_ENABLE_GOOGLE_AUTH !== "true") {
    const baseUrl = getBaseUrl(request)
    return NextResponse.redirect(`${baseUrl}/?error=google_auth_disabled`)
  }

  try {
    const baseUrl = getBaseUrl(request)
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${baseUrl}/api/auth/google/callback`
    )

    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    if (error) {
      return NextResponse.redirect(`${baseUrl}/?error=google_auth_failed`)
    }

    if (!code) {
      return NextResponse.redirect(`${baseUrl}/?error=missing_code`)
    }

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens)

    // Get user info from Google
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client })
    const { data: googleUser } = await oauth2.userinfo.get()

    if (!googleUser.email) {
      return NextResponse.redirect(`${baseUrl}/?error=no_email`)
    }

    // Check if user exists by email
    let user = await prisma.user.findUnique({
      where: { email: googleUser.email }
    })

    if (user) {
      // Link Google account to existing user
      if (!user.googleId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            googleId: googleUser.id,
            avatar: googleUser.picture,
            emailVerified: true
          }
        })
      }
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          email: googleUser.email,
          fullName: googleUser.name || googleUser.email,
          googleId: googleUser.id,
          avatar: googleUser.picture,
          emailVerified: true
        }
      })
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      avatar: user.avatar || undefined
    })

    // Redirect to dashboard with auth cookie
    const response = NextResponse.redirect(`${baseUrl}/dashboard`)
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response

  } catch (error) {
    console.error('Google OAuth callback error:', error)
    const baseUrl = getBaseUrl(request)
    return NextResponse.redirect(`${baseUrl}/?error=auth_failed`)
  }
}