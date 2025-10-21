import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET!
const EMAIL_VERIFICATION_SECRET = process.env.EMAIL_VERIFICATION_SECRET!

export interface JWTPayload {
  userId: string
  email: string
  fullName: string
  avatar?: string
}

/**
 * Hash password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Generate JWT token for authentication
 */
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}

/**
 * Generate email verification token
 */
export function generateEmailVerificationToken(email: string): string {
  return jwt.sign({ email }, EMAIL_VERIFICATION_SECRET, { expiresIn: '24h' })
}

/**
 * Verify email verification token
 */
export function verifyEmailVerificationToken(token: string): { email: string } | null {
  try {
    return jwt.verify(token, EMAIL_VERIFICATION_SECRET) as { email: string }
  } catch {
    return null
  }
}

/**
 * Generate password reset token
 */
export function generatePasswordResetToken(email: string): string {
  return jwt.sign({ email }, EMAIL_VERIFICATION_SECRET, { expiresIn: '1h' })
}

/**
 * Verify password reset token
 */
export function verifyPasswordResetToken(token: string): { email: string } | null {
  try {
    return jwt.verify(token, EMAIL_VERIFICATION_SECRET) as { email: string }
  } catch {
    return null
  }
}

/**
 * Get current user from cookies
 */
export async function getCurrentUser(): Promise<JWTPayload | null> {
  const cookieStore = cookies()
  const token = (await cookieStore).get('auth-token')?.value
  
  if (!token) return null
  
  return verifyToken(token)
}

/**
 * Set authentication cookie
 */
export async function setAuthCookie(token: string) {
  const cookieStore = cookies()
  ;(await cookieStore).set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  })
}

/**
 * Clear authentication cookie
 */
export async function clearAuthCookie() {
  const cookieStore = cookies()
  ;(await cookieStore).delete('auth-token')
}