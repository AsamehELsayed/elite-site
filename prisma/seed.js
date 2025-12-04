const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const fs = require('fs')
const path = require('path')

// Set DATABASE_URL if not set and using SQLite
if (!process.env.DATABASE_URL) {
  const schemaPath = path.join(__dirname, 'schema.prisma')
  if (fs.existsSync(schemaPath)) {
    const schema = fs.readFileSync(schemaPath, 'utf8')
    if (schema.includes('provider = "sqlite"')) {
      process.env.DATABASE_URL = 'file:./dev.db'
      console.log('💡 DATABASE_URL not set, using default: file:./dev.db')
    }
  }
}

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const existingAdmin = await prisma.user.findUnique({ 
    where: { email: 'admin@elite.com' } 
  })
  
  if (existingAdmin) {
    console.log('ℹ️  Admin user already exists, skipping creation')
  } else {
    const hashedPassword = await bcrypt.hash('admin123', 10)
    const admin = await prisma.user.create({
      data: {
        email: 'admin@elite.com',
        password: hashedPassword,
        name: 'Admin User',
        role: 'admin'
      }
    })
    console.log('✅ Admin user created:', admin.email)
  }

  // Clear existing data
  await prisma.testimonial.deleteMany()
  await prisma.caseStudy.deleteMany()
  await prisma.stat.deleteMany()
  await prisma.contactBooking.deleteMany()
  await prisma.philosophy.deleteMany()
  await prisma.hero.deleteMany()

  // Seed Testimonials
  const testimonials = [
    {
      quote: "Elite made our private banking launch feel like a cinematic premiere. Conversion jumped 146% without any paid push.",
      author: "Nadia Farrow",
      role: "Global Brand VP — Orion Private",
      city: "Dubai",
      metrics: ["+146% launch conv.", "3 week rollout"],
      order: 0
    },
    {
      quote: "They choreographed an entire digital universe for our couture drops. Clients now queue online like it's Paris Fashion Week.",
      author: "Lucien Marche",
      role: "Creative Director — Maison Marche",
      city: "Paris",
      metrics: ["83% repeat rate", "$4.2M first drop"],
      order: 1
    },
    {
      quote: "Elite rebuilt the way UHNW families discover our properties. Leads doubled and every visit feels hand-crafted.",
      author: "Viola Ren",
      role: "Managing Partner — Ren Capital Estates",
      city: "Singapore",
      metrics: ["2.1x qualified leads", "6 markets synced"],
      order: 2
    },
    {
      quote: "Their sensory, editorial approach to experiential travel made our bookings surge while keeping the brand impossibly rare.",
      author: "Sora Ahn",
      role: "Founder — Nine Horizons",
      city: "Seoul",
      metrics: ["62% avg. cart uplift", "NPS 92"],
      order: 3
    }
  ]

  for (const testimonial of testimonials) {
    await prisma.testimonial.create({
      data: {
        ...testimonial,
        metrics: JSON.stringify(testimonial.metrics)
      }
    })
  }
  console.log(`✅ Created ${testimonials.length} testimonials`)

  // Seed Case Studies
  const caseStudies = [
    {
      title: "Lumina Fashion",
      category: "E-Commerce",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
      year: "2024",
      description: "A modern e-commerce platform revolutionizing the fashion retail experience",
      link: "https://google.com/",
      order: 0
    },
    {
      title: "Apex Architecture",
      category: "Branding",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
      year: "2024",
      description: "Brand identity design for a leading architecture firm",
      link: "https://google.com/",
      order: 1
    },
    {
      title: "Velvet Interiors",
      category: "Web Design",
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop",
      year: "2023",
      description: "Luxury interior design showcase website with immersive 3D experiences",
      link: "https://google.com/",
      order: 2
    }
  ]

  for (const caseStudy of caseStudies) {
    await prisma.caseStudy.create({
      data: caseStudy
    })
  }
  console.log(`✅ Created ${caseStudies.length} case studies`)

  // Seed Stats
  const stats = [
    {
      label: "Ultra-luxury launches activated",
      value: "38",
      order: 0
    },
    {
      label: "Average uplift in premium conversions",
      value: "212%",
      order: 1
    },
    {
      label: "Markets scaling same-day experiences",
      value: "11",
      order: 2
    }
  ]

  for (const stat of stats) {
    await prisma.stat.create({
      data: stat
    })
  }
  console.log(`✅ Created ${stats.length} stats`)

  // Seed Contact Bookings
  const contactBookings = [
    {
      day: "Mon",
      date: "May 05",
      slots: ["09:00", "11:30", "15:00"],
      order: 0
    },
    {
      day: "Tue",
      date: "May 06",
      slots: ["10:00", "13:30", "17:00"],
      order: 1
    },
    {
      day: "Wed",
      date: "May 07",
      slots: ["08:30", "12:00", "16:30"],
      order: 2
    },
    {
      day: "Thu",
      date: "May 08",
      slots: ["09:30", "14:00"],
      order: 3
    },
    {
      day: "Fri",
      date: "May 09",
      slots: ["10:30", "13:00", "18:00"],
      order: 4
    }
  ]

  for (const booking of contactBookings) {
    await prisma.contactBooking.create({
      data: {
        ...booking,
        slots: JSON.stringify(booking.slots)
      }
    })
  }
  console.log(`✅ Created ${contactBookings.length} contact bookings`)

  // Seed Philosophy
  const existingPhilosophy = await prisma.philosophy.findFirst()
  if (!existingPhilosophy) {
    await prisma.philosophy.create({
      data: {
        title: "Our Philosophy",
        content: "We craft digital experiences that resonate with luxury brands and high-net-worth audiences. Every pixel, every interaction, every moment is designed to elevate your brand and drive meaningful connections."
      }
    })
    console.log('✅ Created philosophy content')
  } else {
    console.log('ℹ️  Philosophy content already exists')
  }

  // Seed Hero
  const existingHero = await prisma.hero.findFirst()
  if (!existingHero) {
    await prisma.hero.create({
      data: {
        title: "Elite",
        subtitle: "Premium Digital Marketing Agency",
        description: "We craft digital experiences that resonate with luxury brands and high-net-worth audiences.",
        ctaText: "Get Started",
        ctaLink: "#contact"
      }
    })
    console.log('✅ Created hero content')
  } else {
    console.log('ℹ️  Hero content already exists')
  }

  console.log('🎉 Database seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

