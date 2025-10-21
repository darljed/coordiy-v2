#!/usr/bin/env node

const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')

// Set environment to production
process.env.NODE_ENV = 'production'

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })

// Set DATABASE_URL for Prisma
const prodUrl = process.env.DATABASE_URL_PROD
if (!prodUrl) {
  console.error('❌ DATABASE_URL_PROD is required for production migrations')
  process.exit(1)
}

process.env.DATABASE_URL = prodUrl

console.log('🚀 Running production database migrations...')
console.log(`📍 Database: ${prodUrl.replace(/:[^:@]*@/, ':****@')}`)

function getMigrationFiles() {
  const migrationsDir = path.join(__dirname, '..', 'prisma', 'migrations')
  if (!fs.existsSync(migrationsDir)) return []
  
  return fs.readdirSync(migrationsDir)
    .filter(dir => dir !== 'migration_lock.toml' && fs.statSync(path.join(migrationsDir, dir)).isDirectory())
    .sort()
}

try {
  // Check migration status first
  let statusOutput
  let needsBaseline = false
  
  try {
    statusOutput = execSync('npx prisma migrate status', { encoding: 'utf8' })
    if (statusOutput.includes('Database schema is up to date')) {
      console.log('✅ Database is already up to date, no migrations needed')
      process.exit(0)
    }
  } catch (statusError) {
    // If status check fails, it might be due to P3005 error (non-empty database)
    if (statusError.message.includes('P3005')) {
      needsBaseline = true
      console.log('📍 Database schema exists, attempting to baseline...')
      
      const migrations = getMigrationFiles()
      if (migrations.length === 0) {
        console.log('⚠️ No migrations found to baseline')
        process.exit(1)
      }
      
      console.log(`📍 Found ${migrations.length} migrations to baseline`)
      
      // Mark all existing migrations as applied
      for (const migration of migrations) {
        try {
          execSync(`npx prisma migrate resolve --applied "${migration}"`, { stdio: 'pipe' })
          console.log(`✅ Baselined migration: ${migration}`)
        } catch (resolveError) {
          // Ignore if already resolved
          if (!resolveError.message.includes('already resolved')) {
            throw resolveError
          }
        }
      }
      
      console.log('✅ Database baselined successfully!')
      
      // Check status again after baselining
      try {
        statusOutput = execSync('npx prisma migrate status', { encoding: 'utf8' })
        if (statusOutput.includes('Database schema is up to date')) {
          console.log('✅ Database is now up to date after baselining')
          process.exit(0)
        }
      } catch {
        console.log('📍 Proceeding with migration after baseline...')
      }
    } else {
      console.log('📍 Unable to check status, proceeding with migration...')
    }
  }
  
  // Run migrations
  execSync('npx prisma migrate deploy', { stdio: 'inherit' })
  console.log('✅ Production migrations completed successfully!')
} catch (error) {
  if (error.status === 0) {
    // Migration was successful but threw due to output
    console.log('✅ Production migrations completed successfully!')
  } else {
    console.error('❌ Migration failed:', error.message)
    process.exit(1)
  }
}