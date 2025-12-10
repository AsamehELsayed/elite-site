import { prisma } from '@/lib/prisma'

export const logService = {
  /**
   * Create a new log entry
   * @param {Object} logData - Log data
   * @param {string} logData.level - Log level (info, warn, error, debug)
   * @param {string} logData.message - Log message
   * @param {Object} logData.context - Additional context (optional)
   * @param {string} logData.userId - User ID (optional)
   * @param {string} logData.ipAddress - IP address (optional)
   * @param {string} logData.userAgent - User agent (optional)
   * @param {string} logData.stack - Error stack trace (optional)
   * @returns {Promise<Object>} Created log entry
   */
  async createLog({ level, message, context, userId, ipAddress, userAgent, stack }) {
    return await prisma.Log.create({
      data: {
        level,
        message,
        context: context ? JSON.stringify(context) : null,
        userId,
        ipAddress,
        userAgent,
        stack
      }
    })
  },

  /**
   * Get all logs with optional filtering
   * @param {Object} options - Query options
   * @param {string} options.level - Filter by log level
   * @param {number} options.limit - Limit number of results
   * @param {number} options.skip - Skip number of results
   * @returns {Promise<Array>} Array of log entries
   */
  async getAllLogs({ level, limit = 100, skip = 0 } = {}) {
    try {
      const where = level ? { level } : {}
      
      return await prisma.Log.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip
      })
    } catch (error) {
      // Check if Log model exists
      if (error.message && error.message.includes('undefined') || error.message.includes('not found')) {
        throw new Error('Log model not found. Please run: npm run db:generate')
      }
      throw error
    }
  },

  /**
   * Get only error logs
   * @param {Object} options - Query options
   * @param {number} options.limit - Limit number of results
   * @param {number} options.skip - Skip number of results
   * @returns {Promise<Array>} Array of error log entries
   */
  async getErrorLogs({ limit = 100, skip = 0 } = {}) {
    return await prisma.Log.findMany({
      where: { level: 'error' },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip
    })
  },

  /**
   * Get log by ID
   * @param {string} id - Log ID
   * @returns {Promise<Object|null>} Log entry or null
   */
  async getLogById(id) {
    return await prisma.Log.findUnique({
      where: { id }
    })
  },

  /**
   * Delete log by ID
   * @param {string} id - Log ID
   * @returns {Promise<Object>} Deleted log entry
   */
  async deleteLog(id) {
    if (!id) {
      throw new Error('Log ID is required')
    }

    try {
      // Attempt to delete the log
      // Prisma will throw P2025 if the record doesn't exist
      return await prisma.Log.delete({
        where: { id }
      })
    } catch (error) {
      // If the record doesn't exist (P2025), treat it as successful deletion
      // This makes the delete operation idempotent
      if (error.code === 'P2025') {
        return { id, deleted: true } // Return success for already deleted items
      }
      if (error.message && (error.message.includes('undefined') || error.message.includes('not found'))) {
        throw new Error('Log model not found. Please run: npm run db:generate')
      }
      throw error
    }
  },

  /**
   * Delete all logs
   * @returns {Promise<Object>} Delete result
   */
  async deleteAllLogs() {
    return await prisma.Log.deleteMany({})
  },

  /**
   * Delete logs by level
   * @param {string} level - Log level
   * @returns {Promise<Object>} Delete result
   */
  async deleteLogsByLevel(level) {
    return await prisma.Log.deleteMany({
      where: { level }
    })
  }
}

