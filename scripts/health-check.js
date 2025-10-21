#!/usr/bin/env node

const http = require('http')

const HEALTH_URL = 'http://localhost:3000/api/health'

function checkHealth() {
  return new Promise((resolve, reject) => {
    const req = http.get(HEALTH_URL, (res) => {
      let data = ''
      
      res.on('data', (chunk) => {
        data += chunk
      })
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data)
          resolve({ status: res.statusCode, data: result })
        } catch (error) {
          reject(new Error(`Failed to parse response: ${error.message}`))
        }
      })
    })
    
    req.on('error', (error) => {
      reject(new Error(`Request failed: ${error.message}`))
    })
    
    req.setTimeout(10000, () => {
      req.destroy()
      reject(new Error('Request timeout'))
    })
  })
}

async function main() {
  console.log('🔍 Checking system health...\n')
  
  try {
    const { status, data } = await checkHealth()
    
    console.log(`📊 Overall Status: ${data.status === 'healthy' ? '✅ HEALTHY' : '❌ UNHEALTHY'}`)
    console.log(`🕐 Timestamp: ${data.timestamp}`)
    console.log(`📡 HTTP Status: ${status}\n`)
    
    console.log('📋 Service Details:')
    console.log('─'.repeat(50))
    
    Object.entries(data.services).forEach(([service, info]) => {
      const icon = info.status === 'healthy' ? '✅' : '❌'
      console.log(`${icon} ${service.toUpperCase()}: ${info.status}`)
      console.log(`   Message: ${info.message}\n`)
    })
    
    process.exit(data.status === 'healthy' ? 0 : 1)
    
  } catch (error) {
    console.error('❌ Health check failed:', error.message)
    console.log('\n💡 Make sure the development server is running: npm run dev')
    process.exit(1)
  }
}

main()