import Link from 'next/link'
import { ArrowLeft, Home, Sparkles } from 'lucide-react'

export const metadata = {
  title: 'Page Not Found | Elite',
  description: 'The page you were looking for could not be found.',
}

export default function NotFound() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 gradient-mesh opacity-60" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden
      >
        <div className="h-[28rem] w-[28rem] rounded-full bg-primary/25 blur-3xl opacity-50 animate-pulse-glow" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-8 px-6 py-20 text-center sm:py-28">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-gold sm:text-sm">
          404 • Not Found
        </p>

        <h1 className="gold-gradient-text text-4xl font-serif leading-tight drop-shadow-lg sm:text-5xl md:text-6xl">
          The page you seek lives in the shadows.
        </h1>

        <p className="max-w-2xl text-sm text-gray-300 sm:text-base md:text-lg">
          We couldn&apos;t find the destination you were looking for. The link may
          be outdated or the page may have been moved. Let&apos;s get you back on
          track.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:px-6 sm:py-3.5 sm:text-base"
          >
            <Home className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
            Go home
          </Link>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-primary/60 px-5 py-3 text-sm font-semibold text-primary transition hover:-translate-y-0.5 hover:bg-primary hover:text-black hover:shadow-lg hover:shadow-primary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:px-6 sm:py-3.5 sm:text-base"
          >
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
            Talk to us
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-gray-300 transition hover:-translate-y-0.5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:px-6 sm:py-3.5 sm:text-base"
            prefetch
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
            Return to safety
          </Link>
        </div>

        <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-gray-300 backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_rgba(212,175,55,0.8)]" aria-hidden />
          Elite digital experience
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black opacity-60" aria-hidden />
    </main>
  )
}

