import { caseStudyService } from '@/services/caseStudyService'
import { servicesService } from '@/services/servicesService'
import { defaultLocale, locales } from '@/lib/i18n'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://elite.com'

// Helper function to create slug from title
function toSlug(value) {
  if (!value) return ''
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}-]/gu, '')
    .replace(/^-+|-+$/g, '') || 'service'
}

export default async function sitemap() {
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
      alternates: {
        languages: {
          en: baseUrl,
          ar: `${baseUrl}?lang=ar`,
        },
      },
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: {
        languages: {
          en: `${baseUrl}/services`,
          ar: `${baseUrl}/services?lang=ar`,
        },
      },
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/contact`,
          ar: `${baseUrl}/contact?lang=ar`,
        },
      },
    },
    {
      url: `${baseUrl}/showreel`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: {
        languages: {
          en: `${baseUrl}/showreel`,
          ar: `${baseUrl}/showreel?lang=ar`,
        },
      },
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
      alternates: {
        languages: {
          en: `${baseUrl}/privacy`,
          ar: `${baseUrl}/privacy?lang=ar`,
        },
      },
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
      alternates: {
        languages: {
          en: `${baseUrl}/terms`,
          ar: `${baseUrl}/terms?lang=ar`,
        },
      },
    },
  ]

  // Fetch dynamic pages
  const dynamicPages = []

  // Try to fetch dynamic content, but gracefully handle failures during build
  // The sitemap will be regenerated at runtime when database is available
  try {
    // Get all case studies
    const caseStudies = await caseStudyService.getAll(defaultLocale)
    if (Array.isArray(caseStudies)) {
      caseStudies.forEach((caseStudy) => {
        if (caseStudy?.slug) {
          dynamicPages.push({
            url: `${baseUrl}/case-studies/${caseStudy.slug}`,
            lastModified: caseStudy.updatedAt ? new Date(caseStudy.updatedAt) : new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
            alternates: {
              languages: {
                en: `${baseUrl}/case-studies/${caseStudy.slug}`,
                ar: `${baseUrl}/case-studies/${caseStudy.slug}?lang=ar`,
              },
            },
          })
        }
      })
    }
  } catch (error) {
    // Database not available during build - this is expected
    // Sitemap will be generated dynamically at runtime
  }

  try {
    // Get all services
    const servicesData = await servicesService.get(defaultLocale)
    if (servicesData?.services) {
      const services = typeof servicesData.services === 'string' 
        ? JSON.parse(servicesData.services) 
        : servicesData.services

      if (Array.isArray(services)) {
        services.forEach((service) => {
          const slug = service.slug || toSlug(service.title) || service.id || 'service'
          dynamicPages.push({
            url: `${baseUrl}/services/${slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
            alternates: {
              languages: {
                en: `${baseUrl}/services/${slug}`,
                ar: `${baseUrl}/services/${slug}?lang=ar`,
              },
            },
          })
        })
      }
    }
  } catch (error) {
    // Database not available during build - this is expected
    // Sitemap will be generated dynamically at runtime
  }

  return [...staticPages, ...dynamicPages]
}


