import { SiteHeader } from "@/components/site-header"
import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { CaseStudiesSection } from "@/components/case-studies-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { ContactSection } from "@/components/contact-section"
import { SiteFooter } from "@/components/site-footer"
import { NavigationStepper } from "@/components/navigation-stepper"
import VisualSection from "@/components/visual-section"

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://elite.com'

export const metadata = {
  title: 'Home',
  description: 'Elite is a professional digital marketing agency offering integrated marketing solutions including social media management, paid advertising, and brand growth strategies.',
  openGraph: {
    title: 'Elite | Premium Digital Marketing Agency',
    description: 'Elite is a professional digital marketing agency offering integrated marketing solutions.',
    url: baseUrl,
    locale: 'en_US',
    alternateLocale: 'ar_SA',
  },
  alternates: {
    canonical: baseUrl,
    languages: {
      'en': baseUrl,
      'ar': `${baseUrl}?lang=ar`,
    },
  },
}

export default function Home() {
  return (
    <main className="bg-black text-white selection:bg-primary selection:text-black min-h-screen h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar fixed inset-0" style={{ willChange: 'scroll-position' }}>
      <SiteHeader />
      <NavigationStepper />
      <div className="snap-section">
        <HeroSection />
      </div>
      {/* <div className="snap-section">
        <ServicesSection />
      </div> */}
      {/* Visual section with snap-start to engage scroll, but allows internal free scrolling */}
      <VisualSection />
      <div className="snap-section">
        <CaseStudiesSection />
      </div>
      <div className="snap-section">
        <ServicesSection />
      </div>
      <div className="snap-section">
        <TestimonialsSection />
      </div>
      <div className="snap-section">
        <ContactSection />
      </div>
      {/* Footer doesn't necessarily need to be a full snap section, but it's better for the flow if it is or is part of the last section. 
          For now, let's make it a snap section to ensure it's reachable. */}
      <div className="snap-section">
        <SiteFooter />
      </div>
    </main>
  )
}