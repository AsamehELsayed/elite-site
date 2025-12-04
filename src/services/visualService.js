import { prisma } from '@/lib/prisma'

export const visualService = {
  async get() {
    try {
      // Check if Visual model exists in Prisma Client
      if (!prisma.visual) {
        throw new Error('Visual model not found. Please run: npm run db:generate')
      }
      return await prisma.visual.findFirst()
    } catch (error) {
      // If model doesn't exist, return null instead of throwing
      if (error.message.includes('not found') || error.message.includes('undefined')) {
        return null
      }
      throw error
    }
  },

  async create(data) {
    // Validate required fields
    if (!data) {
      throw new Error('Visual data cannot be empty')
    }

    return await prisma.visual.create({
      data: {
        ...data,
        gallery1Images: data.gallery1Images ? JSON.stringify(data.gallery1Images) : null,
        gallery2Images: data.gallery2Images ? JSON.stringify(data.gallery2Images) : null
      }
    })
  },

  async update(id, data) {
    const updateData = { ...data }
    if (updateData.gallery1Images && Array.isArray(updateData.gallery1Images)) {
      updateData.gallery1Images = JSON.stringify(updateData.gallery1Images)
    }
    if (updateData.gallery2Images && Array.isArray(updateData.gallery2Images)) {
      updateData.gallery2Images = JSON.stringify(updateData.gallery2Images)
    }
    return await prisma.visual.update({
      where: { id },
      data: updateData
    })
  },

  async upsert(data) {
    // Validate that we have at least some content
    if (!data || Object.keys(data).length === 0) {
      throw new Error('Visual data cannot be empty')
    }

    // Check if Visual model exists in Prisma Client
    if (!prisma.visual) {
      throw new Error('Visual model not found. Please run: npm run db:generate')
    }

    const existing = await prisma.visual.findFirst()
    const updateData = { ...data }
    
    // Handle gallery images - stringify arrays, set null for empty arrays
    if (updateData.gallery1Images !== undefined) {
      if (Array.isArray(updateData.gallery1Images) && updateData.gallery1Images.length > 0) {
        updateData.gallery1Images = JSON.stringify(updateData.gallery1Images)
      } else {
        updateData.gallery1Images = null
      }
    }
    if (updateData.gallery2Images !== undefined) {
      if (Array.isArray(updateData.gallery2Images) && updateData.gallery2Images.length > 0) {
        updateData.gallery2Images = JSON.stringify(updateData.gallery2Images)
      } else {
        updateData.gallery2Images = null
      }
    }

    if (existing) {
      return await prisma.visual.update({
        where: { id: existing.id },
        data: updateData
      })
    }
    return await prisma.visual.create({
      data: updateData
    })
  }
}

