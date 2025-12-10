const { PrismaClient } = require('@prisma/client')

// Set default DATABASE_URL if not provided
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'mysql://root:@localhost:3306/elite'
  console.log('💡 DATABASE_URL not set, using default MySQL: mysql://root:@localhost:3306/elite')
}

const prisma = new PrismaClient()

async function addHeroTranslations() {
  try {
    console.log('📝 Adding Arabic translations to Hero...')
    
    // Get the existing hero
    const hero = await prisma.hero.findFirst()
    
    if (!hero) {
      console.error('❌ No hero record found. Please create one first.')
      return
    }
    
    console.log('✓ Found hero record:', hero.id)
    
    // Parse existing translations
    let translations = {}
    if (hero.translations) {
      if (typeof hero.translations === 'string') {
        translations = JSON.parse(hero.translations)
      } else {
        translations = hero.translations
      }
    }
    
    // Add Arabic translations
    translations.ar = {
      title: "إليت",
      subtitle: "وكالة تسويق رقمي متميزة",
      description: "نحن نصنع تجارب رقمية تتناسب مع العلامات التجارية الفاخرة والجمهور من ذوي الثروات العالية.",
      ctaText: "ابدأ الآن",
      ctaLink: "#contact"
    }
    
    // Update the hero with translations
    const updated = await prisma.hero.update({
      where: { id: hero.id },
      data: { translations }
    })
    
    console.log('✅ Arabic translations added successfully!')
    console.log('Translations:', JSON.stringify(updated.translations, null, 2))
    
  } catch (error) {
    console.error('❌ Error adding translations:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addHeroTranslations()

