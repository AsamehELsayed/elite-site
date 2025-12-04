import { prisma } from '@/lib/prisma'

export const caseStudyService = {
  async getAll() {
    return await prisma.caseStudy.findMany({
      orderBy: { order: 'asc' }
    })
  },

  async getById(id) {
    return await prisma.caseStudy.findUnique({
      where: { id }
    })
  },

  async create(data) {
    const { title, category, image, year, description, link, order = 0 } = data
    
    // Validate required fields
    if (!title || !category || !image || !year || !description) {
      throw new Error('Missing required fields: title, category, image, year, and description are required')
    }

    return await prisma.caseStudy.create({
      data: {
        title,
        category,
        image,
        year,
        description,
        link: link || null,
        order
      }
    })
  },

  async update(id, data) {
    return await prisma.caseStudy.update({
      where: { id },
      data
    })
  },

  async delete(id) {
    return await prisma.caseStudy.delete({
      where: { id }
    })
  }
}




