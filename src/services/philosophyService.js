import { prisma } from '@/lib/prisma'

export const philosophyService = {
  async get() {
    return await prisma.philosophy.findFirst()
  },

  async create(data) {
    return await prisma.philosophy.create({
      data
    })
  },

  async update(id, data) {
    return await prisma.philosophy.update({
      where: { id },
      data
    })
  },

  async upsert(data) {
    const existing = await prisma.philosophy.findFirst()
    if (existing) {
      return await prisma.philosophy.update({
        where: { id: existing.id },
        data
      })
    }
    return await prisma.philosophy.create({
      data
    })
  }
}



