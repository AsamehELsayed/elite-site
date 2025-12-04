import { prisma } from '@/lib/prisma'

export const contactBookingService = {
  async getAll() {
    const bookings = await prisma.contactBooking.findMany({
      orderBy: { order: 'asc' }
    })
    // Parse slots JSON strings - logic in service
    return bookings.map(b => ({
      ...b,
      slots: b.slots ? JSON.parse(b.slots) : []
    }))
  },

  async getById(id) {
    const booking = await prisma.contactBooking.findUnique({
      where: { id }
    })
    if (!booking) return null
    // Parse slots JSON string - logic in service
    return {
      ...booking,
      slots: booking.slots ? JSON.parse(booking.slots) : []
    }
  },

  async create(data) {
    const { name, email, phone, message, preferredDate, preferredTime, day, date, slots, order = 0 } = data
    
    // Validate required fields for contact form submission
    if (!name && !day) {
      throw new Error('Invalid data format')
    }
    
    // If it's a contact form submission (has name/email)
    if (name || email) {
      if (!name || !email) {
        throw new Error('Name and email are required for contact submissions')
      }
      
      const booking = await prisma.contactBooking.create({
        data: {
          name,
          email,
          phone: phone || null,
          message: message || null,
          preferredDate: preferredDate || null,
          preferredTime: preferredTime || null,
          order: order || 0
        }
      })
      return booking
    }
    
    // If it's a booking slot creation (has day/date)
    if (!day || !date) {
      throw new Error('Day and date are required for booking slots')
    }

    const booking = await prisma.contactBooking.create({
      data: {
        day,
        date,
        slots: JSON.stringify(slots || []),
        order
      }
    })
    // Parse slots JSON string - logic in service
    return {
      ...booking,
      slots: booking.slots ? JSON.parse(booking.slots) : []
    }
  },

  async update(id, data) {
    const updateData = { ...data }
    if (updateData.slots && Array.isArray(updateData.slots)) {
      updateData.slots = JSON.stringify(updateData.slots)
    }
    const booking = await prisma.contactBooking.update({
      where: { id },
      data: updateData
    })
    // Parse slots JSON string - logic in service
    return {
      ...booking,
      slots: booking.slots ? JSON.parse(booking.slots) : []
    }
  },

  async delete(id) {
    return await prisma.contactBooking.delete({
      where: { id }
    })
  }
}

