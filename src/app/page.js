

import { SiteHeader } from "@/components/site-header"
import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { PhilosophySection } from "@/components/philosophy-section"
import { CaseStudiesSection } from "@/components/case-studies-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { ContactSection } from "@/components/contact-section"
import { SiteFooter } from "@/components/site-footer"
import { NavigationStepper } from "@/components/navigation-stepper"
import VisualSection from "@/components/visual-section"

export default function Home() {
  return (
    
    <main className="bg-black text-white selection:bg-primary selection:text-black h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar fixed inset-0" style={{ willChange: 'scroll-position' }}>
      <SiteHeader />
      <NavigationStepper />
      <div className="snap-section">
        <HeroSection />
      </div>
      <div className="snap-section">
        <PhilosophySection />
      </div>
      {/* <div className="snap-section">
        <ServicesSection />
      </div> */}
      <div className="no-snap-section">
        <VisualSection />
      </div>
      <div className="snap-section">
        <CaseStudiesSection />
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