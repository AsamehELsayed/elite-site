const { PrismaClient } = require('@prisma/client')

// Set default DATABASE_URL if not provided
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'mysql://root:@localhost:3306/elite'
  console.log('💡 Using default MySQL: mysql://root:@localhost:3306/elite')
}

const prisma = new PrismaClient()

async function checkHero() {
  try {
    const hero = await prisma.hero.findFirst()
    console.log('Hero data:', JSON.stringify(hero, null, 2))
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkHero()


