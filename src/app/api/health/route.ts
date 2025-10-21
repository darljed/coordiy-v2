import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateToken, verifyToken } from '@/lib/auth'


/**
 * GET /api/health
 * Check system health status for database, auth, and email services
 */
export async function GET() {
  const results = {
    timestamp: new Date().toISOString(),
    status: 'healthy',
    services: {
      database: { status: 'unknown', message: '' },
      auth: { status: 'unknown', message: '' },
      email: { status: 'unknown', message: '' }
    }
  }

  // Test Database Connection
  try {
    await prisma.$queryRaw`SELECT 1`
    results.services.database = { status: 'healthy', message: 'Database connection successful' }
  } catch (error) {
    results.services.database = { status: 'unhealthy', message: `Database error: ${error}` }
    results.status = 'unhealthy'
  }

  // Test Auth (JWT generation and verification)
  try {
    const testPayload = { userId: 'test-user', email: 'test@example.com', fullName: 'Test User', avatar: undefined }
    const token = generateToken(testPayload)
    const verified = verifyToken(token)
    
    if (verified && verified.userId === testPayload.userId) {
      results.services.auth = { status: 'healthy', message: 'JWT generation and verification working' }
    } else {
      results.services.auth = { status: 'unhealthy', message: 'JWT verification failed' }
      results.status = 'unhealthy'
    }
  } catch (error) {
    results.services.auth = { status: 'unhealthy', message: `Auth error: ${error}` }
    results.status = 'unhealthy'
  }

  // Test Email Service (configuration check)
  try {
    const requiredEnvVars = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASS', 'EMAIL_FROM']
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName])
    
    if (missingVars.length > 0) {
      results.services.email = { status: 'unhealthy', message: `Missing env vars: ${missingVars.join(', ')}` }
      results.status = 'unhealthy'
    } else {
      results.services.email = { status: 'healthy', message: 'Email configuration valid' }
    }
  } catch (error) {
    results.services.email = { status: 'unhealthy', message: `Email error: ${error}` }
    results.status = 'unhealthy'
  }

  const statusCode = results.status === 'healthy' ? 200 : 503
  return NextResponse.json(results, { status: statusCode })
}