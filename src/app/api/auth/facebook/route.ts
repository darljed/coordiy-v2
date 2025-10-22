import { NextRequest, NextResponse } from 'next/server'
import { getBaseUrl } from '@/lib/url'

/**
 * GET /api/auth/facebook
 * Redirect to Facebook OAuth
 */
export async function GET(request: NextRequest) {
  if (process.env.NEXT_PUBLIC_ENABLE_FACEBOOK_AUTH !== "true") {
    return NextResponse.json({ error: 'Facebook authentication is disabled' }, { status: 403 })
  }

  const baseUrl = getBaseUrl(request)
  const facebookAuthUrl = new URL('https://www.facebook.com/v18.0/dialog/oauth')
  
  facebookAuthUrl.searchParams.set('client_id', process.env.FACEBOOK_APP_ID!)
  facebookAuthUrl.searchParams.set('redirect_uri', `${baseUrl}/api/auth/facebook/callback`)
  facebookAuthUrl.searchParams.set('scope', 'email')
  facebookAuthUrl.searchParams.set('response_type', 'code')

  return NextResponse.redirect(facebookAuthUrl.toString())
}