import { NextRequest } from 'next/server'

/**
 * Get the base URL from the request headers
 * This ensures we use the correct domain in production
 */
export function getBaseUrl(request?: NextRequest): string {
  // If we have a request, use the headers to determine the URL
  if (request) {
    const host = request.headers.get('host')
    const protocol = request.headers.get('x-forwarded-proto') || 'http'
    
    if (host) {
      return `${protocol}://${host}`
    }
  }
  
  // Fallback to environment variable
  return process.env.NEXTAUTH_URL || 'http://localhost:3000'
}