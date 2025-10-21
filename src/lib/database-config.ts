export function getDatabaseUrl(): string {
  const env = process.env.NODE_ENV || 'development'
  
  if (env === 'production') {
    const prodUrl = process.env.DATABASE_URL_PROD
    if (!prodUrl) {
      throw new Error('DATABASE_URL_PROD is required in production environment')
    }
    return prodUrl
  }
  
  const devUrl = process.env.DATABASE_URL_DEV
  if (!devUrl) {
    throw new Error('DATABASE_URL_DEV is required in development environment')
  }
  return devUrl
}

// Set DATABASE_URL for Prisma based on environment
if (typeof window === 'undefined') {
  process.env.DATABASE_URL = getDatabaseUrl()
}