"use client"

import { motion } from "framer-motion"
import { Quote } from 'lucide-react'

const testimonials = [
  {
    quote: "Elite transformed our digital presence completely. Their strategic approach and attention to detail are unmatched in the industry.",
    author: "Sarah Jenkins",
    role: "CMO, Luxury Estates",
  },
  {
    quote: "The ROI we've seen since working with Elite has been phenomenal. They truly understand the nuances of the premium market.",
    author: "Michael Sterling",
    role: "Founder, Sterling & Co.",
  },
  {
    quote: "Professional, innovative, and results-driven. Elite is the partner you need if you want to dominate your niche.",
    author: "Elena Rodriguez",
    role: "Director, Artura Gallery",
  },
]

export function TestimonialsSection() {
  return (
    <section className="w-full h-screen flex items-center justify-center bg-black">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif font-bold text-white mb-4"
          >
            Client Success
          </motion.h2>
          <p className="text-zinc-500 text-lg">What our partners say about us</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <motion.div
              key={index}
              className="relative p-8 border border-white/10 bg-zinc-900/30 hover:border-primary/50 transition-colors duration-500"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Quote className="w-10 h-10 text-primary/20 mb-6" />
              <p className="text-zinc-300 text-lg leading-relaxed mb-8 italic">
                "{item.quote}"
              </p>
              <div>
                <h4 className="text-white font-bold font-serif">{item.author}</h4>
                <p className="text-primary text-sm uppercase tracking-wider">{item.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
