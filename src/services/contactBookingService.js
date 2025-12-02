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
    const { day, date, slots, order = 0 } = data
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

