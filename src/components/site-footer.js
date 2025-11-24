import Link from "next/link"
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer className="w-full bg-black border-t border-white/10 pt-20 pb-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <Link href="/" className="text-3xl font-serif font-bold tracking-tighter text-white mb-6 block">
              ELITE<span className="text-primary">.</span>
            </Link>
            <p className="text-zinc-500 leading-relaxed mb-6">
              A premium digital marketing agency dedicated to elevating brands through strategy, creativity, and innovation.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-white hover:bg-primary hover:text-black transition-colors">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-white hover:bg-primary hover:text-black transition-colors">
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-white hover:bg-primary hover:text-black transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-white hover:bg-primary hover:text-black transition-colors">
                <Facebook className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider">Services</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-zinc-500 hover:text-primary transition-colors">Strategic Consulting</Link></li>
              <li><Link href="#" className="text-zinc-500 hover:text-primary transition-colors">Social Media Management</Link></li>
              <li><Link href="#" className="text-zinc-500 hover:text-primary transition-colors">Paid Advertising</Link></li>
              <li><Link href="#" className="text-zinc-500 hover:text-primary transition-colors">Public Relations</Link></li>
              <li><Link href="#" className="text-zinc-500 hover:text-primary transition-colors">Content Creation</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider">Company</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-zinc-500 hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="#" className="text-zinc-500 hover:text-primary transition-colors">Our Team</Link></li>
              <li><Link href="#" className="text-zinc-500 hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="#" className="text-zinc-500 hover:text-primary transition-colors">Case Studies</Link></li>
              <li><Link href="#" className="text-zinc-500 hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider">Newsletter</h4>
            <p className="text-zinc-500 mb-4">Subscribe to our newsletter for the latest insights and trends.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Your email" 
                className="bg-zinc-900 border border-white/10 px-4 py-2 text-white w-full focus:border-primary outline-none"
              />
              <button className="bg-primary text-black px-4 py-2 font-bold hover:bg-primary/90">
                GO
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-600 text-sm">© 2025 Elite Agency. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="#" className="text-zinc-600 text-sm hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-zinc-600 text-sm hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

