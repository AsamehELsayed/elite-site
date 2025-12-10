import { prisma } from '@/lib/prisma'
import { applyTranslations, defaultLocale, upsertTranslations } from '@/lib/i18n'

export const contactBookingService = {
  async getAll(locale = defaultLocale) {
    const bookings = await prisma.ContactBooking.findMany({
      orderBy: { order: 'asc' },
    })
    return bookings.map((b) => {
      const withLocale = applyTranslations(b, locale, [
        'day',
        'date',
        'slots',
        'name',
        'email',
        'phone',
        'message',
        'preferredDate',
        'preferredTime',
      ])
      return {
        ...withLocale,
        slots: withLocale.slots ? JSON.parse(withLocale.slots) : [],
      }
    })
  },

  async getById(id, locale = defaultLocale) {
    const booking = await prisma.ContactBooking.findUnique({
      where: { id },
    })
    if (!booking) return null
    const withLocale = applyTranslations(booking, locale, [
      'day',
      'date',
      'slots',
      'name',
      'email',
      'phone',
      'message',
      'preferredDate',
      'preferredTime',
    ])
    return {
      ...withLocale,
      slots: withLocale.slots ? JSON.parse(withLocale.slots) : [],
    }
  },

  async create(data, locale = defaultLocale) {
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
      
      if (locale !== defaultLocale) {
        return prisma.ContactBooking.create({
          data: {
            order: order || 0,
            translations: {
              [locale]: {
                name,
                email,
                phone,
                message,
                preferredDate,
                preferredTime,
              },
            },
          },
        })
      }

      const booking = await prisma.ContactBooking.create({
        data: {
          name,
          email,
          phone: phone || null,
          message: message || null,
          preferredDate: preferredDate || null,
          preferredTime: preferredTime || null,
          order: order || 0,
        },
      })
      return booking
    }
    
    // If it's a booking slot creation (has day/date)
    if (!day || !date) {
      throw new Error('Day and date are required for booking slots')
    }

    if (locale !== defaultLocale) {
      return prisma.ContactBooking.create({
        data: {
          order,
          translations: {
            [locale]: {
              day,
              date,
              slots,
            },
          },
        },
      })
    }

    const booking = await prisma.ContactBooking.create({
      data: {
        day,
        date,
        slots: JSON.stringify(slots || []),
        order,
      },
    })
    return {
      ...booking,
      slots: booking.slots ? JSON.parse(booking.slots) : [],
    }
  },

  async update(id, data, locale = defaultLocale) {
    if (locale === defaultLocale) {
      const updateData = { ...data }
      if (updateData.slots && Array.isArray(updateData.slots)) {
        updateData.slots = JSON.stringify(updateData.slots)
      }
      const booking = await prisma.ContactBooking.update({
        where: { id },
        data: updateData,
      })
      return {
        ...booking,
        slots: booking.slots ? JSON.parse(booking.slots) : [],
      }
    }

    const existing = await prisma.ContactBooking.findUnique({ where: { id } })
    const translations = upsertTranslations(existing, locale, data, [
      'day',
      'date',
      'slots',
      'name',
      'email',
      'phone',
      'message',
      'preferredDate',
      'preferredTime',
    ])

    const booking = await prisma.ContactBooking.update({
      where: { id },
      data: { translations },
    })
    return {
      ...booking,
      slots: booking.slots ? JSON.parse(booking.slots) : [],
    }
  },

  async delete(id) {
    try {
      return await prisma.ContactBooking.delete({
        where: { id }
      })
    } catch (error) {
      // If the record doesn't exist (P2025), treat it as successful deletion
      if (error.code === 'P2025') {
        return { id, deleted: true } // Return success for already deleted items
      }
      throw error
    }
  }
}

