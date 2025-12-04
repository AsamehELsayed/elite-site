#!/usr/bin/env node

/**
 * Prisma Command Wrapper
 * Ensures DATABASE_URL is set before running Prisma commands
 * Sets default SQLite path if DATABASE_URL is not set and we're using SQLite
 */

const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  // Check if we're using SQLite by reading the schema
  const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma')
  const schema = fs.readFileSync(schemaPath, 'utf8')
  
  if (schema.includes('provider = "sqlite"')) {
    // Set default SQLite database path
    process.env.DATABASE_URL = 'file:./dev.db'
    console.log('💡 DATABASE_URL not set, using default: file:./dev.db')
  } else {
    console.error('❌ Error: DATABASE_URL environment variable is required')
    console.error('   Please set DATABASE_URL in your .env file')
    process.exit(1)
  }
}

// Get the Prisma command and arguments
const args = process.argv.slice(2)

if (args.length === 0) {
  console.error('❌ Error: No Prisma command specified')
  process.exit(1)
}

// Run Prisma with the provided command
// Use shell: true on Windows for better compatibility
const isWindows = process.platform === 'win32'
const prisma = spawn('npx', ['prisma', ...args], {
  stdio: 'inherit',
  shell: isWindows,
  env: {
    ...process.env,
    DATABASE_URL: process.env.DATABASE_URL
  }
})

prisma.on('error', (error) => {
  console.error(`❌ Error running Prisma: ${error.message}`)
  process.exit(1)
})

prisma.on('exit', (code) => {
  process.exit(code || 0)
})

