'use client';

import { motion } from 'framer-motion';
import { useMemo, useState, useEffect } from 'react';

// Default fallback data
const defaultGallery1 = [
  { src: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=500&auto=format&fit=crop", skew: "-skew-x-12" },
  { src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop", skew: "skew-x-12" },
  { src: "https://images.unsplash.com/photo-1635776063043-ab23b4c226f6?w=500&auto=format&fit=crop", skew: "-skew-x-12" },
  { src: "https://images.unsplash.com/photo-1618004652321-13a63e576b80?w=500&auto=format&fit=crop", skew: "skew-x-12" },
];

const defaultGallery2 = [
  { src: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=500&auto=format&fit=crop" },
  { src: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=500&auto=format&fit=crop" },
  { src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop" },
  { src: "https://images.unsplash.com/photo-1635776063043-ab23b4c226f6?w=500&auto=format&fit=crop" },
];

export default function VisualSection() {
  const [visual, setVisual] = useState(null)
  
  // Fetch visual data from API
  useEffect(() => {
    const fetchVisual = async () => {
      try {
        const response = await fetch('/api/visuals')
        if (response.ok) {
          const data = await response.json()
          if (data && !data.error) {
            setVisual(data)
          }
        }
      } catch (error) {
        console.error('Failed to fetch visual:', error)
      }
    }
    
    fetchVisual()
  }, [])

  // Use API data or fallback to defaults
  const galleryImages1 = useMemo(() => {
    return visual?.gallery1Images && visual.gallery1Images.length > 0 
      ? visual.gallery1Images 
      : defaultGallery1
  }, [visual])

  const galleryImages2 = useMemo(() => {
    return visual?.gallery2Images && visual.gallery2Images.length > 0 
      ? visual.gallery2Images 
      : defaultGallery2
  }, [visual])

  return (
    <section id="visuals" className="relative w-full bg-black snap-start">
   <div className="absolute inset-0 w-full left-0 right-0 top-0 flex items-start justify-center pointer-events-none z-2">
        <div className="relative w-full">
          <div className="relative h-64 md:h-80 lg:h-[24rem] w-full">
            <div className="absolute inset-0 overflow-hidden opacity-80 w-full">
              <video
                autoPlay
                loop
                muted
                playsInline
                aria-hidden="true"
                className="w-full h-full object-cover scale-y-[-1] blur-sm"
              >
                <source src="/hero-video.mp4" type="video/mp4" />
                <source src="/hero-video.webm" type="video/webm" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/50 to-black  " />
            </div>
          </div>
        </div>
      </div>
        {/* Wrapper for sticky sections - needs height to create scroll */}
        <div className="relative" style={{ minHeight: '400vh' }}>
          <section className="text-white h-screen w-full bg-black grid place-content-center sticky top-0">
            <div className="absolute bottom-0 left-0 right-0 top-0"></div>
            
            <motion.h1 
              className="2xl:text-7xl text-5xl md:text-6xl px-8 font-serif font-semibold text-center tracking-tight leading-[120%] relative z-0 "
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              {visual?.section1Title || "Discover What Makes Us"}{' '}
              <br />
              <motion.span 
                className="gold-gradient-text inline-block"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                animate={{
                  textShadow: [
                    '0 0 20px rgba(212, 175, 55, 0.4)',
                    '0 0 40px rgba(212, 175, 55, 0.7)',
                    '0 0 20px rgba(212, 175, 55, 0.4)',
                  ],
                }}
                transition={{
                  opacity: { duration: 0.8, delay: 0.2 },
                  scale: { duration: 0.8, delay: 0.2 },
                  textShadow: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
              >
                {visual?.section1Highlight || "Truly Elite 👇"}
              </motion.span>
            </motion.h1>
          </section>

          {/* Second Sticky Section - Gold Accent with rounded corners */}
          <section className="bg-linear-to-br from-primary/5 via-primary/10 to-primary/5 text-white grid place-content-center h-screen sticky top-0 rounded-tr-3xl rounded-tl-3xl overflow-hidden border-t border-primary/20">
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,rgba(212,175,55,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(212,175,55,0.06)_1px,transparent_1px)] bg-size-[54px_54px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
            
            <motion.h1 
              className="2xl:text-7xl text-4xl md:text-5xl px-8 font-serif font-semibold text-center tracking-tight leading-[120%] relative z-10"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
            >
              {visual?.section2Title || "We don't just create designs, We craft"}{' '}
              <motion.span 
                className="gold-gradient-text inline-block"
                animate={{
                  filter: [
                    'drop-shadow(0 0 10px rgba(212, 175, 55, 0.5))',
                    'drop-shadow(0 0 30px rgba(212, 175, 55, 0.8))',
                    'drop-shadow(0 0 10px rgba(212, 175, 55, 0.5))',
                  ],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {visual?.section2Highlight || "Digital Experiences 💼"}
              </motion.span>
            </motion.h1>
          </section>

          {/* Third Sticky Section */}
          <section className="text-white h-screen w-full bg-black grid place-content-center sticky top-0">
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,rgba(212,175,55,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(212,175,55,0.08)_1px,transparent_1px)] bg-size-[54px_54px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
            
            <motion.h1 
              className="2xl:text-7xl text-5xl md:text-6xl px-8 font-serif font-semibold text-center tracking-tight leading-[120%] relative z-10"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
            >
              {visual?.section3Title || "Every Project Tells A"}{' '}
              <motion.span 
                className="gold-gradient-text inline-block"
                animate={{
                  textShadow: [
                    '0 0 15px rgba(212, 175, 55, 0.4)',
                    '0 0 35px rgba(212, 175, 55, 0.7)',
                    '0 0 15px rgba(212, 175, 55, 0.4)',
                  ],
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {visual?.section3Highlight || "Success Story 😎"}
              </motion.span>
            </motion.h1>
          </section>
        </div>

        {/* Gallery Section - Left sticky text, Right scrolling images */}
        <section className="text-white w-full bg-black">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="sticky top-0 h-screen flex items-center justify-center">
              <motion.h1 
                className="2xl:text-6xl text-4xl md:text-5xl px-8 font-serif font-semibold text-center tracking-tight leading-[120%]"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                {visual?.section4Title || "Witness The Power Of"}
                <br />
                <motion.span 
                  className="gold-gradient-text inline-block"
                  animate={{
                    textShadow: [
                      '0 0 20px rgba(212, 175, 55, 0.4)',
                      '0 0 40px rgba(212, 175, 55, 0.7)',
                      '0 0 20px rgba(212, 175, 55, 0.4)',
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {visual?.section4Highlight || "Elite Design ☝️"}
                </motion.span>
              </motion.h1>
            </div>
            <div className="grid gap-2 py-4">
              {galleryImages1.map((img, index) => (
                <motion.figure 
                  key={index}
                  className={`grid place-content-center ${img.skew}`}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <img
                    src={img.src}
                    alt={`Gallery ${index + 1}`}
                    loading="lazy"
                    decoding="async"
                    className="transition-all duration-300 w-80 h-96 align-bottom object-cover rounded-lg border border-primary/20 hover:border-primary/50 shadow-xl shadow-primary/5"
                  />
                </motion.figure>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Section - Left scrolling images, Right sticky text */}
        <section className="text-white w-full bg-black">
          <div className="grid grid-cols-1 md:grid-cols-2 px-4 md:px-8">
            <div className="grid gap-2 order-2 md:order-1">
              {galleryImages2.map((img, index) => (
                <figure 
                  key={index}
                  className="sticky top-0 h-screen grid place-content-center"
                >
                  <motion.img
                    src={img.src}
                    alt={`Portfolio ${index + 1}`}
                    loading="lazy"
                    decoding="async"
                    className="transition-all duration-300 w-96 h-96 align-bottom object-cover rounded-2xl border border-primary/30 hover:border-primary/60 shadow-2xl shadow-primary/10"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true, margin: "-50px" }}
                    whileHover={{ scale: 1.05 }}
                  />
                </figure>
              ))}
            </div>
            <div className="sticky top-0 h-screen grid place-content-center order-1 md:order-2">
              <motion.h1 
                className="text-3xl md:text-4xl px-8 font-serif font-semibold text-right tracking-tight leading-[120%]"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                {visual?.section5Title || "We Turn Your Vision Into"}{' '}
                <motion.span 
                  className="gold-gradient-text inline-block"
                  animate={{
                    filter: [
                      'drop-shadow(0 0 15px rgba(212, 175, 55, 0.5))',
                      'drop-shadow(0 0 30px rgba(212, 175, 55, 0.8))',
                      'drop-shadow(0 0 15px rgba(212, 175, 55, 0.5))',
                    ],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {visual?.section5Highlight || "Stunning Reality 😎"}
                </motion.span>
              </motion.h1>
            </div>
          </div>
        </section>

      
      </section>
  );
}
