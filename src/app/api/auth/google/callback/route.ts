import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { prisma } from '@/lib/prisma'
import { generateToken, setAuthCookie } from '@/lib/auth'

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXTAUTH_URL}/api/auth/google/callback`
)

/**
 * GET /api/auth/google/callback
 * Handle Google OAuth callback
 */
export async function GET(request: NextRequest) {
  if (process.env.NEXT_PUBLIC_ENABLE_GOOGLE_AUTH !== "true") {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/?error=google_auth_disabled`)
  }

  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    if (error) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/?error=google_auth_failed`)
    }

    if (!code) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/?error=missing_code`)
    }

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens)

    // Get user info from Google
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client })
    const { data: googleUser } = await oauth2.userinfo.get()

    if (!googleUser.email) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/?error=no_email`)
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

    // Set auth cookie
    await setAuthCookie(token)

    // Redirect to dashboard
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard`)

  } catch (error) {
    console.error('Google OAuth callback error:', error)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/?error=auth_failed`)
  }
}