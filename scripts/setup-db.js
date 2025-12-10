#!/usr/bin/env node

/**
 * Database Setup Script
 * Automatically configures Prisma schema based on environment
 * - Local development: Uses SQLite (when DATABASE_URL starts with "file:" or not set)
 * - Production/Docker: Uses MySQL
 */

const fs = require('fs')
const path = require('path')

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma')
const env = process.env.NODE_ENV || 'development'
const databaseUrl = process.env.DATABASE_URL || ''
const isDocker = process.env.DOCKER_ENV === 'true' || process.env.IN_DOCKER === 'true'

// Determine database provider
let provider = 'mysql' // Default to MySQL
let isLocalDev = false

// Decide provider based on explicit DATABASE_URL
if (databaseUrl.startsWith('file:') || databaseUrl.includes('sqlite')) {
  provider = 'sqlite'
  isLocalDev = true
} else if (databaseUrl.startsWith('postgresql:')) {
  provider = 'postgresql'
} else {
  // Default to MySQL even when DATABASE_URL is not set
  provider = 'mysql'
}

// Read current schema
let schema = fs.readFileSync(schemaPath, 'utf8')

// Update provider in datasource
// For SQLite, set default DATABASE_URL if not provided
let databaseUrlConfig = 'env("DATABASE_URL")'
if (provider === 'sqlite' && !databaseUrl) {
  databaseUrlConfig = 'env("DATABASE_URL")'
  process.env.DATABASE_URL = 'file:./dev.db'
}
// For MySQL, set a sensible default when missing so Prisma stays on MySQL
if (provider === 'mysql' && !databaseUrl) {
  process.env.DATABASE_URL = 'mysql://root:@localhost:3306/elite'
  databaseUrlConfig = 'env("DATABASE_URL")'
}

schema = schema.replace(
  /datasource db \{[^}]*\}/s,
  `datasource db {
  provider = "${provider}"
  url      = ${databaseUrlConfig}
}`
)

// For SQLite, remove MySQL-specific annotations (@db.Text)
if (provider === 'sqlite') {
  // SQLite doesn't need @db.Text, it handles text automatically
  schema = schema.replace(/@db\.Text/g, '')
  console.log('✅ Configured for SQLite (local development)')
} else {
  console.log('✅ Configured for MySQL (production/Docker)')
}

// Write updated schema
fs.writeFileSync(schemaPath, schema, 'utf8')

console.log(`📝 Prisma schema updated: provider = ${provider}`)
console.log(`🌍 Environment: ${env}`)
console.log(`🐳 Docker: ${isDocker ? 'Yes' : 'No'}`)
console.log(`💾 Database: ${provider === 'sqlite' ? 'SQLite (local)' : 'MySQL (production)'}`)
console.log(`🔗 DATABASE_URL: ${databaseUrl ? 'Set' : 'Not set (will use default)'}`)

if (provider === 'sqlite' && !databaseUrl) {
  console.log(`\n💡 Tip: Add DATABASE_URL="file:./dev.db" to .env.local for local development`)
  console.log(`   Using default: file:./dev.db`)
  // Set environment variable for current process
  process.env.DATABASE_URL = 'file:./dev.db'
}

