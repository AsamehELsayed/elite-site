import { prisma } from '@/lib/prisma'

export const heroService = {
  async get() {
    return await prisma.hero.findFirst()
  },

  async create(data) {
    return await prisma.hero.create({
      data
    })
  },

  async update(id, data) {
    return await prisma.hero.update({
      where: { id },
      data
    })
  },

  async upsert(data) {
    // Validate that we have at least some content
    if (!data || Object.keys(data).length === 0) {
      throw new Error('Hero data cannot be empty')
    }

    const existing = await prisma.hero.findFirst()
    if (existing) {
      return await prisma.hero.update({
        where: { id: existing.id },
        data
      })
    }
    return await prisma.hero.create({
      data
    })
  }
}




