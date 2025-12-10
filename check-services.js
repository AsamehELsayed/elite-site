const { PrismaClient } = require('@prisma/client')

async function checkServices() {
  const prisma = new PrismaClient()

  try {
    const services = await prisma.services.findFirst()
    console.log('Services data:', services)

    if (!services) {
      console.log('No services data found. Creating default services...')

      const defaultServices = [
        {
          id: "01",
          title: "Brand Identity",
          description: "Crafting visual systems that speak without words.",
          icon: "Palette"
        },
        {
          id: "02",
          title: "Digital Experience",
          description: "Immersive web and mobile solutions for the modern age.",
          icon: "Globe"
        },
        {
          id: "03",
          title: "Content Strategy",
          description: "Narratives that engage, convert, and retain.",
          icon: "FileText"
        },
        {
          id: "04",
          title: "Growth Marketing",
          description: "Data-driven campaigns for scalable success.",
          icon: "TrendingUp"
        }
      ]

      await prisma.services.create({
        data: {
          sectionTitle: "Comprehensive Solutions",
          sectionSubtitle: "Our Expertise",
          services: JSON.stringify(defaultServices)
        }
      })

      console.log('Default services created successfully!')
    }
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkServices()





