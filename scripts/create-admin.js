const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const email = process.argv[2] || 'admin@elite.com'
  const password = process.argv[3] || 'admin123'
  const name = process.argv[4] || 'Admin User'

  const hashedPassword = await bcrypt.hash(password, 10)
  
  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'admin'
      }
    })
    console.log('✅ Admin user created successfully!')
    console.log('Email:', user.email)
    console.log('Name:', user.name)
    console.log('Role:', user.role)
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('❌ User with this email already exists')
    } else {
      console.error('Error creating user:', error)
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())












