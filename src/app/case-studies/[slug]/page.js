import Link from 'next/link'
import Image from 'next/image'
import { cookies } from 'next/headers'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { caseStudyService } from '@/services/caseStudyService'
import { defaultLocale, isLocaleSupported } from '@/lib/i18n'

// Blur placeholder data URL
const blurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='

export const dynamic = 'force-dynamic'

const fallbackCaseStudies = {
  raheed: {
    title: 'Raheed Logistics Platform',
    category: 'Logistics & Mobility',
    year: '2024',
    description:
      'A placeholder narrative for Raheed, covering fulfillment, courier coordination, and customer tracking UX while the full case study is prepared.',
    link: null,
    image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1600&q=80',
    heroVideo: '/hero-video.mp4',
  },
}

const stripHtml = (value = '') =>
  value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

export async function generateMetadata({ params }) {
  const { slug } = await params
  const localeCookie = cookies().get('locale')?.value
  const locale = isLocaleSupported(localeCookie) ? localeCookie : defaultLocale
  const caseStudy = await loadCaseStudy(slug, locale)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://elite.com'
  const pageUrl = `${baseUrl}/case-studies/${slug}`

  if (!caseStudy) {
    return {
      title: `${slug ? slug.replace(/-/g, ' ') : 'Case Study'}`,
      description: 'Case study details coming soon.',
      openGraph: {
        title: `${slug ? slug.replace(/-/g, ' ') : 'Case Study'} | Elite`,
        description: 'Case study details coming soon.',
        url: pageUrl,
      },
      alternates: {
        canonical: pageUrl,
        languages: {
          'en': pageUrl,
          'ar': `${pageUrl}?lang=ar`,
        },
      },
    }
  }

  const description = stripHtml(caseStudy.description || '')

  return {
    title: caseStudy.title,
    description: description || 'Case study details and highlights.',
    openGraph: {
      title: `${caseStudy.title} | Elite`,
      description: description || 'Case study details and highlights.',
      url: pageUrl,
      images: caseStudy.image ? [{ url: caseStudy.image, width: 1200, height: 630, alt: caseStudy.title }] : undefined,
    },
    alternates: {
      canonical: pageUrl,
      languages: {
        'en': pageUrl,
        'ar': `${pageUrl}?lang=ar`,
      },
    },
  }
}

async function loadCaseStudy(slug, locale = defaultLocale) {
  if (!slug) return null
  try {
    return await caseStudyService.getBySlugOrId(slug, locale)
  } catch (error) {
    console.error('[case-study]', error)
    return null
  }
}

export default async function CaseStudyPage({ params, searchParams }) {
  const { slug } = await params
  const lang = searchParams?.lang
  const cookieLocale = cookies().get('locale')?.value
  const locale = isLocaleSupported(lang)
    ? lang
    : isLocaleSupported(cookieLocale)
      ? cookieLocale
      : defaultLocale
  const caseStudy = await loadCaseStudy(slug, locale)

  const fallback = slug ? fallbackCaseStudies[slug] : null

  const data =
    caseStudy ||
    fallback || {
      title: slug ? slug.replace(/-/g, ' ') : 'Case Study',
      category: 'Coming Soon',
      year: new Date().getFullYear().toString(),
      description: 'This case study is being prepared. Check back shortly for the full story.',
      link: null,
      image: null,
      heroVideo: null,
    }

  const heroVideo = data.heroVideo || data.video || '/hero-video.mp4'
  const heroImage = data.image
  const statusText = data.link ? 'Live experience' : 'In production'
  const descriptionHtml = data.description ? { __html: data.description } : null
  const plainDescription =
    descriptionHtml?.__html ? stripHtml(descriptionHtml.__html) : 'This case study is being prepared.'
  const isRTL = locale === 'ar'

  return (
    <main className="bg-black text-white min-h-screen">
      <SiteHeader />

      <section className="relative min-h-screen max-h-screen flex items-center justify-center overflow-hidden py-16 md:py-20">
        <div className="absolute inset-0 z-0">
          <video
            key={heroVideo}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            poster={heroImage || undefined}
          >
            <source src={heroVideo} type="video/mp4" />
            <source src="/hero-video.webm" type="video/webm" />
          </video>
          <div className="absolute inset-0 bg-black/65" />
        </div>

        <div className="pointer-events-none absolute top-12 left-6 h-56 w-56 rounded-full bg-primary/25 blur-[120px] animate-pulse" />
        <div className="pointer-events-none absolute bottom-10 right-6 h-64 w-64 rounded-full bg-white/10 blur-[140px] animate-pulse" />

        <div className={`absolute top-6 z-20 ${isRTL ? 'right-4' : 'left-4'}`}>
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/70 px-4 py-2 text-sm text-gray-200 backdrop-blur transition hover:border-primary hover:text-white"
          >
            <ArrowLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} aria-hidden />
            Back to work
          </Link>
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="rounded-[32px] border border-white/15 bg-black/70 backdrop-blur shadow-2xl shadow-black/40 overflow-hidden max-h-[80vh] w-full">
            <div className={`grid lg:grid-cols-[1.1fr_0.9fr] h-full ${isRTL ? 'lg:grid-flow-col-dense' : ''}`}>
              <div className={`p-8 md:p-10 lg:p-12 space-y-6 overflow-y-auto ${isRTL ? 'lg:order-2' : 'lg:order-1'}`}>
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`h-[2px] flex-1 ${isRTL ? 'bg-linear-to-l' : 'bg-linear-to-r'} from-primary via-primary/40 to-transparent`} />
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-primary border border-primary/30">
                    {statusText}
                  </span>
                </div>

                <p className="text-xs uppercase tracking-[0.32em] text-gray-300">
                  {data.category || 'Case Study'}
                </p>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-serif leading-[0.95]">
                  {data.title}
                </h1>
                {descriptionHtml ? (
                  <div className="space-y-2">
                    <div
                      className="prose prose-invert max-w-none text-base sm:text-lg md:text-xl leading-relaxed text-gray-100"
                      dangerouslySetInnerHTML={descriptionHtml}
                    />
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="text-sm font-semibold text-white mb-2">Project description</div>
                      <div
                        className="prose prose-invert max-w-none text-sm sm:text-base text-gray-200 leading-relaxed"
                        dangerouslySetInnerHTML={descriptionHtml}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-sm font-semibold text-white mb-2">Project description</div>
                    <p className="text-sm sm:text-base text-gray-200 leading-relaxed">
                      {plainDescription}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/contact"
                    className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-black transition hover:bg-primary/90 shadow-lg shadow-primary/25"
                  >
                    Start a project
                  </Link>
                  <Link
                    href="/#work"
                    className="rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-gray-100 transition hover:border-primary hover:text-primary"
                  >
                    View more work
                  </Link>
                  {data.link ? (
                    <Link
                      href={data.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-6 py-3 text-sm font-medium text-primary transition hover:border-primary hover:bg-primary/15"
                    >
                      Live experience
                      <ExternalLink className="h-4 w-4" aria-hidden />
                    </Link>
                  ) : null}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                    <div className="text-[11px] uppercase tracking-[0.25em] text-gray-400">Year</div>
                    <div className="mt-2 text-lg font-semibold">{data.year || '—'}</div>
                  </div>
                  <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                    <div className="text-[11px] uppercase tracking-[0.25em] text-gray-400">Category</div>
                    <div className="mt-2 text-lg font-semibold text-gray-100">{data.category || 'Case Study'}</div>
                  </div>
                  <div className="sm:col-span-2 rounded-2xl border border-white/15 bg-white/5 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[11px] uppercase tracking-[0.25em] text-gray-400">Link</div>
                        <div className="mt-2 text-sm text-gray-200">
                          {data.link ? (
                            <Link
                              href={data.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-primary hover:text-white break-all"
                            >
                              {data.link}
                              <ExternalLink className="h-4 w-4" aria-hidden />
                            </Link>
                          ) : (
                            <span className="text-gray-500">Private / coming soon</span>
                          )}
                        </div>
                      </div>
                      <span className="rounded-full bg-primary/15 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-primary border border-primary/30">
                        {statusText}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`relative bg-black/40 h-full w-full ${isRTL ? 'lg:order-1' : 'lg:order-2'}`}>
                {heroImage ? (
                  <Image
                    src={heroImage}
                    alt={data.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    priority
                    unoptimized={heroImage.startsWith('http')}
                    placeholder="blur"
                    blurDataURL={blurDataURL}
                    onError={(e) => {
                      e.target.style.display = 'none'
                      const parent = e.target.parentElement
                      if (parent) {
                        parent.innerHTML = '<div class="absolute inset-0 bg-zinc-900 flex items-center justify-center"><span class="text-zinc-600">Image unavailable</span></div>'
                      }
                    }}
                  />
                ) : (
                  <video
                    key={`${heroVideo}-card`}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-cover"
                    poster={heroImage || undefined}
                  >
                    <source src={heroVideo} type="video/mp4" />
                    <source src="/hero-video.webm" type="video/webm" />
                  </video>
                )}
                <div className="absolute inset-0 bg-linear-to-br from-black/40 via-black/10 to-transparent" />
              </div>
            </div>
          </div>

      
        </div>
      </section>


      <SiteFooter />
    </main>
  )
}

