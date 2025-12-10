import { Geist, Geist_Mono, Playfair_Display, Bebas_Neue } from 'next/font/google'
// import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { CursorFollower } from '@/components/cursor-follower'
import { LocaleProvider } from '@/components/locale-provider'
import { LoadingProvider } from '@/contexts/LoadingContext'
import { GlobalLoaderWrapper } from '@/components/GlobalLoaderWrapper'

const geist = Geist({ subsets: ["latin"], variable: '--font-sans' });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: '--font-mono' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-serif' });
const bebasNeue = Bebas_Neue({ subsets: ["latin"], weight: "400", variable: '--font-display' });

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://elite.com'),
  title: {
    default: 'Elite | Premium Digital Marketing Agency',
    template: '%s | Elite',
  },
  description: 'Elite is a professional digital marketing agency offering integrated marketing solutions including social media management, paid advertising, and brand growth strategies.',
  keywords: ['digital marketing', 'social media management', 'brand growth', 'paid advertising', 'marketing agency', 'digital strategy'],
  authors: [{ name: 'Elite' }],
  creator: 'Elite',
  publisher: 'Elite',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/icon.svg',
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'ar_SA',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://elite.com',
    siteName: 'Elite',
    title: 'Elite | Premium Digital Marketing Agency',
    description: 'Elite is a professional digital marketing agency offering integrated marketing solutions including social media management, paid advertising, and brand growth strategies.',
    images: [
      {
        url: '/icon.svg',
        width: 1200,
        height: 630,
        alt: 'Elite Digital Marketing Agency',
      },
    ],
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://elite.com',
    languages: {
      'en': process.env.NEXT_PUBLIC_SITE_URL || 'https://elite.com',
      'ar': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://elite.com'}?lang=ar`,
    },
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Elite | Premium Digital Marketing Agency',
    description: 'Elite is a professional digital marketing agency offering integrated marketing solutions.',
    creator: '@elite',
    images: ['/icon.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${geist.variable} ${geistMono.variable} ${playfair.variable} ${bebasNeue.variable} font-sans antialiased bg-black text-white selection:bg-primary selection:text-black`}>
        <LocaleProvider>
          <LoadingProvider>
            <GlobalLoaderWrapper />
            {children}
            <CursorFollower />
            {/* <Analytics /> */}
          </LoadingProvider>
        </LocaleProvider>
      </body>
    </html>
  )
}



 