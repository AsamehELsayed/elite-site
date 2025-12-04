import { prisma } from '@/lib/prisma'

export const statService = {
  async getAll() {
    return await prisma.stat.findMany({
      orderBy: { order: 'asc' }
    })
  },

  async getById(id) {
    return await prisma.stat.findUnique({
      where: { id }
    })
  },

  async create(data) {
    const { label, value, order = 0 } = data
    
    // Validate required fields
    if (!label || !value) {
      throw new Error('Missing required fields: label and value are required')
    }

    return await prisma.stat.create({
      data: {
        label,
        value,
        order
      }
    })
  },

  async update(id, data) {
    return await prisma.stat.update({
      where: { id },
      data
    })
  },

  async delete(id) {
    return await prisma.stat.delete({
      where: { id }
    })
  }
}




