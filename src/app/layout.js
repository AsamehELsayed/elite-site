import { Geist, Geist_Mono, Playfair_Display } from 'next/font/google'
// import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { CursorFollower } from '@/components/cursor-follower'

const geist = Geist({ subsets: ["latin"], variable: '--font-sans' });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: '--font-mono' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-serif' });

export const metadata = {
  title: 'Elite | Premium Digital Marketing Agency',
  description: 'Elite is a professional digital marketing agency offering integrated marketing solutions including social media management, paid advertising, and brand growth strategies.',
  icons: {
    icon: '/icon.svg',
  },
  generator: 'v0.app'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${geist.variable} ${geistMono.variable} ${playfair.variable} font-sans antialiased bg-[oklch(0.30_0_0)] text-white selection:bg-primary selection:text-black`}>
        <CursorFollower />
        {children}
        {/* <Analytics /> */}
      </body>
    </html>
  )
}



 