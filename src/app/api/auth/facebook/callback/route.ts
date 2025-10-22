import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { prisma } from '@/lib/prisma'
import { generateToken, setAuthCookie } from '@/lib/auth'
import { getBaseUrl } from '@/lib/url'

/**
 * GET /api/auth/facebook/callback
 * Handle Facebook OAuth callback
 */
export async function GET(request: NextRequest) {
  if (process.env.NEXT_PUBLIC_ENABLE_FACEBOOK_AUTH !== "true") {
    const baseUrl = getBaseUrl(request)
    return NextResponse.redirect(`${baseUrl}/?error=facebook_auth_disabled`)
  }

  try {
    const baseUrl = getBaseUrl(request)
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    if (error) {
      return NextResponse.redirect(`${baseUrl}/?error=facebook_auth_failed`)
    }

    if (!code) {
      return NextResponse.redirect(`${baseUrl}/?error=missing_code`)
    }

    // Exchange code for access token
    const tokenResponse = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
      params: {
        client_id: process.env.FACEBOOK_APP_ID,
        client_secret: process.env.FACEBOOK_APP_SECRET,
        redirect_uri: `${baseUrl}/api/auth/facebook/callback`,
        code
      }
    })

    const { access_token } = tokenResponse.data

    // Get user info from Facebook
    const userResponse = await axios.get('https://graph.facebook.com/me', {
      params: {
        fields: 'id,name,email,picture',
        access_token
      }
    })

    const facebookUser = userResponse.data

    if (!facebookUser.email) {
      return NextResponse.redirect(`${baseUrl}/?error=no_email`)
    }

    // Check if user exists by email
    let user = await prisma.user.findUnique({
      where: { email: facebookUser.email }
    })

    if (user) {
      // Link Facebook account to existing user
      if (!user.facebookId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            facebookId: facebookUser.id,
            avatar: facebookUser.picture?.data?.url,
            emailVerified: true
          }
        })
      }
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          email: facebookUser.email,
          fullName: facebookUser.name || facebookUser.email,
          facebookId: facebookUser.id,
          avatar: facebookUser.picture?.data?.url,
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
    console.error('Facebook OAuth callback error:', error)
    const baseUrl = getBaseUrl(request)
    return NextResponse.redirect(`${baseUrl}/?error=auth_failed`)
  }
}