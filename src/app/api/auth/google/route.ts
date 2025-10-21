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
 * GET /api/auth/google
 * Redirect to Google OAuth
 */
export async function GET() {
  if (process.env.NEXT_PUBLIC_ENABLE_GOOGLE_AUTH !== "true") {
    return NextResponse.json({ error: 'Google authentication is disabled' }, { status: 403 })
  }

  const scopes = ['email', 'profile']
  
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  })

  return NextResponse.redirect(authUrl)
}

/**
 * POST /api/auth/google
 * Handle Google OAuth callback
 */
export async function POST(request: NextRequest) {
  if (process.env.NEXT_PUBLIC_ENABLE_GOOGLE_AUTH !== "true") {
    return NextResponse.json({ error: 'Google authentication is disabled' }, { status: 403 })
  }

  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json({ error: 'Authorization code required' }, { status: 400 })
    }

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens)

    // Get user info from Google
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client })
    const { data: googleUser } = await oauth2.userinfo.get()

    if (!googleUser.email) {
      return NextResponse.json({ error: 'Email not provided by Google' }, { status: 400 })
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
            emailVerified: true // Google emails are verified
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
      fullName: user.fullName
    })

    // Set auth cookie
    await setAuthCookie(token)

    return NextResponse.json({
      message: 'Google login successful',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        emailVerified: user.emailVerified,
        avatar: user.avatar
      }
    })

  } catch (error) {
    console.error('Google OAuth error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}