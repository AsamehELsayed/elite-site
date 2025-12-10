import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"

const reels = [
  {
    title: "2025 Agency Showreel",
    description: "A fast-cut mix of our product launches, platform builds, and campaign moments.",
    duration: "01:05",
    src: "/hero-video.mp4",
    poster: "/uploads/1765009955897-dmh0bwwe9bt.jpeg",
    tags: ["Brand film", "Product", "3D"],
  },
  {
    title: "Social Reels Mix",
    description: "Vertical-first edits built for paid and organic, tuned for scroll-stopping impact.",
    duration: "00:42",
    src: "/hero-video.mp4",
    poster: "/uploads/1765009947227-p9ji5ccadm.jpeg",
    tags: ["Vertical", "Social", "Paid"],
  },
]

export const metadata = {
  title: "Showreel",
  description: "Watch Elite showreels and see how we ship campaigns, launches, and product stories.",
  openGraph: {
    title: "Showreel | Elite",
    description: "Watch Elite showreels and see how we ship campaigns, launches, and product stories.",
    url: '/showreel',
  },
  alternates: {
    canonical: '/showreel',
    languages: {
      'en': '/showreel',
      'ar': '/showreel?lang=ar',
    },
  },
}

export default function ShowreelPage() {
  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 pt-24">
        <section className="relative isolate overflow-hidden mx-4 md:mx-10 rounded-3xl border border-white/10 bg-zinc-900/50">
          <div className="absolute inset-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-60"
            >
              <source src="/hero-video.mp4" type="video/mp4" />
              <source src="/hero-video.webm" type="video/webm" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/65 to-black" />
          </div>

          <div className="relative max-w-5xl mx-auto px-6 sm:px-10 lg:px-16 py-16 md:py-20 text-center space-y-6">
            <p className="text-sm uppercase tracking-[0.35em] text-primary/80">Showreel</p>
            <h1 className="text-4xl md:text-6xl font-serif leading-tight">
              Work in motion for brands that move fast
            </h1>
            <p className="text-zinc-200 max-w-3xl mx-auto text-base md:text-lg leading-relaxed">
              Quick cuts of product drops, launches, and campaigns we have shipped across platforms.
              Every frame is built to convert attention into action.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Button asChild variant="secondary" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back home
                </Link>
              </Button>
              <Button asChild className="bg-primary text-black hover:bg-primary/90">
                <Link href="/contact">
                  Book a project call
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 sm:px-10 py-14 md:py-20 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-primary/70 mb-2">Reels</p>
              <h2 className="text-3xl md:text-4xl font-serif">Showcase</h2>
            </div>
            <p className="text-zinc-400 text-sm md:text-base max-w-xl">
              Choose a reel below to preview our pacing, transitions, and storytelling style across launches and campaigns.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {reels.map((reel) => (
              <article
                key={reel.title}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 shadow-xl shadow-primary/5"
              >
                <div className="relative aspect-video">
                  <video
                    controls
                    playsInline
                    poster={reel.poster}
                    className="w-full h-full object-cover bg-black"
                  >
                    <source src={reel.src} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs uppercase tracking-tight text-white/80">
                    <span className="bg-black/70 px-3 py-1 rounded-full border border-white/10">{reel.duration}</span>
                    <span className="bg-primary text-black px-3 py-1 rounded-full font-semibold">Play</span>
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-semibold">{reel.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{reel.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {reel.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs text-primary bg-primary/10 border border-primary/25 px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}






