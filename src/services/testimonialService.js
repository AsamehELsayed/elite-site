import { prisma } from '@/lib/prisma'

export const testimonialService = {
  async getAll() {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { order: 'asc' }
    })
    // Parse metrics JSON strings - logic in service
    return testimonials.map(t => ({
      ...t,
      metrics: t.metrics ? JSON.parse(t.metrics) : []
    }))
  },

  async getById(id) {
    const testimonial = await prisma.testimonial.findUnique({
      where: { id }
    })
    if (!testimonial) return null
    // Parse metrics JSON string - logic in service
    return {
      ...testimonial,
      metrics: testimonial.metrics ? JSON.parse(testimonial.metrics) : []
    }
  },

  async create(data) {
    const { quote, author, role, city, metrics, order = 0 } = data
    const testimonial = await prisma.testimonial.create({
      data: {
        quote,
        author,
        role,
        city,
        metrics: JSON.stringify(metrics || []),
        order
      }
    })
    // Parse metrics JSON string - logic in service
    return {
      ...testimonial,
      metrics: testimonial.metrics ? JSON.parse(testimonial.metrics) : []
    }
  },

  async update(id, data) {
    const updateData = { ...data }
    if (updateData.metrics && Array.isArray(updateData.metrics)) {
      updateData.metrics = JSON.stringify(updateData.metrics)
    }
    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: updateData
    })
    // Parse metrics JSON string - logic in service
    return {
      ...testimonial,
      metrics: testimonial.metrics ? JSON.parse(testimonial.metrics) : []
    }
  },

  async delete(id) {
    return await prisma.testimonial.delete({
      where: { id }
    })
  }
}

