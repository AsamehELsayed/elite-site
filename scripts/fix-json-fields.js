/**
 * Script to fix empty JSON string fields in the database
 * This replaces empty strings with NULL to prevent JSON parse errors
 */

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function fixJsonFields() {
  console.log('🔧 Fixing empty JSON string fields...\n')

  try {
    // Fix Contact table
    console.log('Checking Contact table...')
    const contacts = await prisma.contact.findMany()
    for (const contact of contacts) {
      const updates = {}
      
      if (contact.briefingSteps === '') updates.briefingSteps = '[]'
      if (contact.sessionFocus === '') updates.sessionFocus = '[]'
      if (contact.bookingSlots === '') updates.bookingSlots = '{"week":[]}'
      if (contact.sectionDescription === '') updates.sectionDescription = null
      
      if (Object.keys(updates).length > 0) {
        await prisma.contact.update({
          where: { id: contact.id },
          data: updates
        })
        console.log(`✓ Fixed Contact record ${contact.id}`)
      }
    }

    // Fix Footer table
    console.log('\nChecking Footer table...')
    const footers = await prisma.footer.findMany()
    for (const footer of footers) {
      const updates = {}
      
      if (footer.socialLinks === '') updates.socialLinks = '[]'
      if (footer.servicesLinks === '') updates.servicesLinks = '[]'
      if (footer.companyLinks === '') updates.companyLinks = '[]'
      if (footer.companyDescription === '') updates.companyDescription = null
      if (footer.newsletterDescription === '') updates.newsletterDescription = null
      if (footer.privacyPolicyLink === '') updates.privacyPolicyLink = null
      if (footer.termsOfServiceLink === '') updates.termsOfServiceLink = null
      
      if (Object.keys(updates).length > 0) {
        await prisma.footer.update({
          where: { id: footer.id },
          data: updates
        })
        console.log(`✓ Fixed Footer record ${footer.id}`)
      }
    }

    // Fix Header table
    console.log('\nChecking Header table...')
    const headers = await prisma.header.findMany()
    for (const header of headers) {
      const updates = {}
      
      if (header.navLinks === '') updates.navLinks = '[]'
      if (header.serviceLinks === '') updates.serviceLinks = '[]'
      if (header.socialLinks === '') updates.socialLinks = '[]'
      if (header.galleryImages === '') updates.galleryImages = '[]'
      
      if (Object.keys(updates).length > 0) {
        await prisma.header.update({
          where: { id: header.id },
          data: updates
        })
        console.log(`✓ Fixed Header record ${header.id}`)
      }
    }

    // Fix Services table
    console.log('\nChecking Services table...')
    const services = await prisma.services.findMany()
    for (const service of services) {
      const updates = {}
      
      if (service.services === '') updates.services = '[]'
      
      if (Object.keys(updates).length > 0) {
        await prisma.services.update({
          where: { id: service.id },
          data: updates
        })
        console.log(`✓ Fixed Services record ${service.id}`)
      }
    }

    // Fix Visual table
    console.log('\nChecking Visual table...')
    const visuals = await prisma.visual.findMany()
    for (const visual of visuals) {
      const updates = {}
      
      if (visual.gallery1Images === '') updates.gallery1Images = '[]'
      if (visual.gallery2Images === '') updates.gallery2Images = '[]'
      
      if (Object.keys(updates).length > 0) {
        await prisma.visual.update({
          where: { id: visual.id },
          data: updates
        })
        console.log(`✓ Fixed Visual record ${visual.id}`)
      }
    }

    // Fix Testimonial table
    console.log('\nChecking Testimonial table...')
    const testimonials = await prisma.testimonial.findMany()
    for (const testimonial of testimonials) {
      const updates = {}
      
      if (testimonial.metrics === '') updates.metrics = '[]'
      
      if (Object.keys(updates).length > 0) {
        await prisma.testimonial.update({
          where: { id: testimonial.id },
          data: updates
        })
        console.log(`✓ Fixed Testimonial record ${testimonial.id}`)
      }
    }

    // Fix ContactBooking table
    console.log('\nChecking ContactBooking table...')
    const contactBookings = await prisma.contactBooking.findMany()
    for (const booking of contactBookings) {
      const updates = {}
      
      if (booking.slots === '') updates.slots = '[]'
      
      if (Object.keys(updates).length > 0) {
        await prisma.contactBooking.update({
          where: { id: booking.id },
          data: updates
        })
        console.log(`✓ Fixed ContactBooking record ${booking.id}`)
      }
    }

    console.log('\n✅ All JSON fields fixed successfully!')
  } catch (error) {
    console.error('❌ Error fixing JSON fields:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

fixJsonFields()


