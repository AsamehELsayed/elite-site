import { prisma } from '@/lib/prisma'

export const newsletterService = {
  async getAll() {
    return await prisma.Newsletter.findMany({
      orderBy: { createdAt: 'desc' },
    })
  },

  async getById(id) {
    return await prisma.Newsletter.findUnique({
      where: { id },
    })
  },

  async subscribe(email) {
    // Check if email already exists
    const existing = await prisma.Newsletter.findUnique({
      where: { email },
    })

    if (existing) {
      // If unsubscribed, reactivate
      if (existing.status === 'unsubscribed') {
        return await prisma.Newsletter.update({
          where: { id: existing.id },
          data: { status: 'active' },
        })
      }
      // If already active, return existing
      return existing
    }

    // Create new subscription
    return await prisma.Newsletter.create({
      data: {
        email,
        status: 'active',
      },
    })
  },

  async unsubscribe(email) {
    const existing = await prisma.Newsletter.findUnique({
      where: { email },
    })

    if (!existing) {
      throw new Error('Email not found in newsletter list')
    }

    return await prisma.Newsletter.update({
      where: { id: existing.id },
      data: { status: 'unsubscribed' },
    })
  },

  async updateStatus(id, status) {
    return await prisma.Newsletter.update({
      where: { id },
      data: { status },
    })
  },

  async delete(id) {
    return await prisma.Newsletter.delete({
      where: { id },
    })
  },
}


