"use client"

import { motion } from "framer-motion"
import { useRef } from "react"
import InfiniteMenu from "./InfiniteMenu"

const cases = [
  {
    title: "Lumina Fashion",
    category: "E-Commerce",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
    year: "2024",
    description: "A modern e-commerce platform revolutionizing the fashion retail experience",
    link: "https://google.com/"
  },
  {
    title: "Apex Architecture",
    category: "Branding",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
    year: "2024",
    description: "Brand identity design for a leading architecture firm",
    link: "https://google.com/"
  },
  {
    title: "Velvet Interiors",
    category: "Web Design",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop",
    year: "2023",
    description: "Luxury interior design showcase website with immersive 3D experiences",
    link: "https://google.com/"
  },
]

// Transform cases to InfiniteMenu format
const menuItems = cases.map(caseItem => ({
  image: caseItem.image,
  link: caseItem.link || "#",
  title: caseItem.title,
  description: caseItem.description || `${caseItem.category} / ${caseItem.year}`
}))

export function CaseStudiesSection() {
  const containerRef = useRef(null)

  return (
    <section ref={containerRef} className="w-full h-screen bg-zinc-950 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none z-0"></div>
      
      <div className="absolute top-0 left-0 w-full px-4 md:px-6 pt-8 md:pt-12 z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false }}
          className="w-full"
        >
          <h2 className="text-4xl md:text-6xl font-serif text-white relative inline-block">
            Selected Works
            <motion.div
              className="absolute bottom-0 left-0 h-[2px] bg-primary"
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              transition={{ duration: 1, delay: 0.3 }}
              viewport={{ once: false }}
            ></motion.div>
          </h2>
        </motion.div>
      </div>

      <div className="absolute inset-0 w-full h-full z-10">
        <InfiniteMenu items={menuItems} />
      </div>
    </section>
  )
}
