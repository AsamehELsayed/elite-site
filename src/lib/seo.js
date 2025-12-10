// SEO Configuration for the Elite site
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://elite.com'

export const defaultSEO = {
  title: 'Elite | Premium Digital Marketing Agency',
  titleTemplate: '%s | Elite',
  description: 'Elite is a professional digital marketing agency offering integrated marketing solutions including social media management, paid advertising, and brand growth strategies.',
  canonical: baseUrl,
  languageAlternates: [
    {
      hrefLang: 'en',
      href: `${baseUrl}`,
    },
    {
      hrefLang: 'ar',
      href: `${baseUrl}?lang=ar`,
    },
    {
      hrefLang: 'x-default',
      href: baseUrl,
    },
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocales: ['ar_SA'],
    url: baseUrl,
    siteName: 'Elite',
    title: 'Elite | Premium Digital Marketing Agency',
    description: 'Elite is a professional digital marketing agency offering integrated marketing solutions including social media management, paid advertising, and brand growth strategies.',
    images: [
      {
        url: `${baseUrl}/icon.svg`,
        width: 1200,
        height: 630,
        alt: 'Elite Digital Marketing Agency',
      },
    ],
  },
  twitter: {
    handle: '@elite',
    site: '@elite',
    cardType: 'summary_large_image',
  },
  additionalMetaTags: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
    {
      name: 'theme-color',
      content: '#EDC9AF',
    },
    {
      name: 'author',
      content: 'Elite',
    },
    {
      name: 'robots',
      content: 'index, follow',
    },
    {
      name: 'googlebot',
      content: 'index, follow',
    },
  ],
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/icon.svg',
    },
    {
      rel: 'apple-touch-icon',
      href: '/apple-icon.png',
    },
    {
      rel: 'alternate',
      hrefLang: 'en',
      href: baseUrl,
    },
    {
      rel: 'alternate',
      hrefLang: 'ar',
      href: `${baseUrl}?lang=ar`,
    },
  ],
}

// Arabic SEO defaults
export const arabicSEO = {
  title: 'إيليت | وكالة تسويق رقمي متميزة',
  titleTemplate: '%s | إيليت',
  description: 'إيليت هي وكالة تسويق رقمي محترفة تقدم حلول تسويق متكاملة تشمل إدارة وسائل التواصل الاجتماعي والإعلانات المدفوعة واستراتيجيات نمو العلامة التجارية.',
  canonical: `${baseUrl}?lang=ar`,
  languageAlternates: [
    {
      hrefLang: 'en',
      href: baseUrl,
    },
    {
      hrefLang: 'ar',
      href: `${baseUrl}?lang=ar`,
    },
    {
      hrefLang: 'x-default',
      href: baseUrl,
    },
  ],
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    alternateLocales: ['en_US'],
    url: `${baseUrl}?lang=ar`,
    siteName: 'إيليت',
    title: 'إيليت | وكالة تسويق رقمي متميزة',
    description: 'إيليت هي وكالة تسويق رقمي محترفة تقدم حلول تسويق متكاملة تشمل إدارة وسائل التواصل الاجتماعي والإعلانات المدفوعة واستراتيجيات نمو العلامة التجارية.',
    images: [
      {
        url: `${baseUrl}/icon.svg`,
        width: 1200,
        height: 630,
        alt: 'إيليت وكالة التسويق الرقمي',
      },
    ],
  },
  twitter: {
    handle: '@elite',
    site: '@elite',
    cardType: 'summary_large_image',
  },
}

export const getPageSEO = (pageData, locale = 'en') => {
  const baseConfig = locale === 'ar' ? arabicSEO : defaultSEO
  
  if (!pageData) return baseConfig

  const pageUrl = pageData.url || baseConfig.canonical
  const enUrl = locale === 'ar' ? pageUrl.replace('?lang=ar', '') : pageUrl
  const arUrl = locale === 'ar' ? pageUrl : `${pageUrl}${pageUrl.includes('?') ? '&' : '?'}lang=ar`

  return {
    title: pageData.title || baseConfig.title,
    description: pageData.description || baseConfig.description,
    canonical: pageUrl,
    languageAlternates: [
      {
        hrefLang: 'en',
        href: enUrl,
      },
      {
        hrefLang: 'ar',
        href: arUrl,
      },
      {
        hrefLang: 'x-default',
        href: enUrl,
      },
    ],
    openGraph: {
      ...baseConfig.openGraph,
      title: pageData.title || baseConfig.openGraph.title,
      description: pageData.description || baseConfig.openGraph.description,
      url: pageUrl,
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
      alternateLocales: locale === 'ar' ? ['en_US'] : ['ar_SA'],
      images: pageData.image
        ? [
            {
              url: pageData.image.startsWith('http') ? pageData.image : `${baseUrl}${pageData.image}`,
              width: 1200,
              height: 630,
              alt: pageData.title || (locale === 'ar' ? 'إيليت' : 'Elite'),
            },
          ]
        : baseConfig.openGraph.images,
    },
    twitter: {
      ...baseConfig.twitter,
      title: pageData.title || baseConfig.title,
      description: pageData.description || baseConfig.description,
    },
  }
}

