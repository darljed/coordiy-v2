import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { prisma } from '@/lib/prisma'
import { generateToken, setAuthCookie } from '@/lib/auth'

/**
 * GET /api/auth/facebook/callback
 * Handle Facebook OAuth callback
 */
export async function GET(request: NextRequest) {
  if (process.env.NEXT_PUBLIC_ENABLE_FACEBOOK_AUTH !== "true") {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/?error=facebook_auth_disabled`)
  }

  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    if (error) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/?error=facebook_auth_failed`)
    }

    if (!code) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/?error=missing_code`)
    }

    // Exchange code for access token
    const tokenResponse = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
      params: {
        client_id: process.env.FACEBOOK_APP_ID,
        client_secret: process.env.FACEBOOK_APP_SECRET,
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/facebook/callback`,
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
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/?error=no_email`)
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

    // Set auth cookie
    await setAuthCookie(token)

    // Redirect to dashboard
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard`)

  } catch (error) {
    console.error('Facebook OAuth callback error:', error)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/?error=auth_failed`)
  }
}