import { NextResponse } from 'next/server'

/**
 * GET /api/auth/facebook
 * Redirect to Facebook OAuth
 */
export async function GET() {
  if (process.env.NEXT_PUBLIC_ENABLE_FACEBOOK_AUTH !== "true") {
    return NextResponse.json({ error: 'Facebook authentication is disabled' }, { status: 403 })
  }

  const facebookAuthUrl = new URL('https://www.facebook.com/v18.0/dialog/oauth')
  
  facebookAuthUrl.searchParams.set('client_id', process.env.FACEBOOK_APP_ID!)
  facebookAuthUrl.searchParams.set('redirect_uri', `${process.env.NEXTAUTH_URL}/api/auth/facebook/callback`)
  facebookAuthUrl.searchParams.set('scope', 'email')
  facebookAuthUrl.searchParams.set('response_type', 'code')

  return NextResponse.redirect(facebookAuthUrl.toString())
}