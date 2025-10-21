# Coordiy Authentication API Documentation

## Overview
This document describes the authentication API endpoints for the Coordiy application. All endpoints use JSON for request/response bodies and follow REST conventions.

## Base URL
```
http://localhost:3000/api/auth
```

## Authentication Flow
1. User signs up with email/password → Email verification sent
2. User verifies email via link → Account activated
3. User logs in → JWT token created and stored in HTTP-only cookie
4. Protected routes check JWT token from cookie

## Endpoints

### POST /api/auth/signup
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "acceptTerms": true
}
```

**Validation Rules:**
- `email`: Valid email format
- `password`: Minimum 8 characters
- `confirmPassword`: Must match password
- `acceptTerms`: Must be true

**Success Response (201):**
```json
{
  "message": "User created successfully. Please check your email for verification.",
  "userId": "clx1234567890"
}
```

**Error Responses:**
- `400`: Validation failed or user already exists
- `500`: Internal server error

---

### POST /api/auth/login
Authenticate user and create session.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "clx1234567890",
    "email": "user@example.com",
    "emailVerified": true
  }
}
```

**Error Responses:**
- `401`: Invalid credentials or email not verified
- `400`: Validation failed
- `500`: Internal server error

**Side Effects:**
- Sets HTTP-only cookie `auth-token` with JWT

---

### POST /api/auth/verify-email
Verify user email address with token.

**Request Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200):**
```json
{
  "message": "Email verified successfully"
}
```

**Error Responses:**
- `400`: Invalid or expired token
- `500`: Internal server error

---

### POST /api/auth/logout
Clear user session.

**Request:** No body required

**Success Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

**Side Effects:**
- Clears `auth-token` cookie

## Authentication Utilities

### Server-side Authentication Check
```typescript
import { getCurrentUser } from '@/lib/auth'

// In server components or API routes
const user = await getCurrentUser()
if (!user) {
  // User not authenticated
  redirect('/login')
}
```

### Client-side Navigation
```typescript
// Redirect after successful login
router.push('/dashboard')

// Redirect after logout
router.push('/')
```

## Database Schema

### User Model
```prisma
model User {
  id                     String    @id @default(cuid())
  email                  String    @unique
  password               String
  emailVerified          Boolean   @default(false)
  emailVerificationToken String?
  createdAt              DateTime  @default(now())
  updatedAt              DateTime  @updatedAt

  @@map("users")
}
```

## Environment Variables Required

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/coordiy_db"

# JWT Secrets
JWT_SECRET="your-super-secret-jwt-key"
EMAIL_VERIFICATION_SECRET="your-email-verification-secret"

# Email Configuration
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
EMAIL_FROM="your-email@gmail.com"

# App Configuration
NEXTAUTH_URL="http://localhost:3000"
```

## Security Features

1. **Password Hashing**: Uses bcrypt with salt rounds of 12
2. **JWT Tokens**: 7-day expiration for auth tokens, 24-hour for email verification
3. **HTTP-only Cookies**: Prevents XSS attacks
4. **Input Validation**: Zod schema validation on all endpoints
5. **Email Verification**: Required before login
6. **CSRF Protection**: SameSite cookie attribute

## Error Handling

All endpoints return consistent error format:
```json
{
  "error": "Error message",
  "details": [] // Optional validation details
}
```

## Future Backend Migration

This API is designed to be easily migrated to a separate backend service:

1. **Stateless Design**: All authentication state in JWT tokens
2. **Standard REST**: Easy to replicate in any backend framework
3. **Environment Configuration**: All secrets externalized
4. **Database Agnostic**: Prisma ORM can target multiple databases
5. **Modular Structure**: Clear separation of concerns

To migrate:
1. Copy `/lib/auth.ts`, `/lib/email.ts`, `/lib/prisma.ts`
2. Recreate API endpoints in your backend framework
3. Update frontend fetch URLs to point to new backend
4. Migrate database using Prisma migrations