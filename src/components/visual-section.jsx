'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useMemo } from 'react';
import ScrollFloat from './scroll-float';

export default function VisualSection() {
  const ref = useRef(null);
  const wrapperRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"]
  });

  // Sequential opacity transforms - each section fades out as the next appears
  // Section 1: Visible from start (0-30%), fades out as section 2 appears
  const opacity1 = useTransform(scrollYProgress, [0, 0.25, 0.35, 1], [1, 1, 0, 0]);
  
  // Section 2: Fades in as section 1 fades out (25-35%), visible until section 3 appears (60-70%), then fades out
  const opacity2 = useTransform(scrollYProgress, [0, 0.25, 0.35, 0.6, 0.7, 1], [0, 0, 1, 1, 0, 0]);
  const scale2 = useTransform(scrollYProgress, [0, 0.3, 0.65, 1], [0.95, 1, 1, 0.95]);
  
  // Section 3: Fades in as section 2 fades out (60-70%), stays visible
  const opacity3 = useTransform(scrollYProgress, [0, 0.6, 0.7, 1], [0, 0, 1, 1]);

  // Memoize image arrays to prevent recreation on each render
  const galleryImages1 = useMemo(() => [
    { src: "https://images.unsplash.com/photo-1718838541476-d04e71caa347?w=500&auto=format&fit=crop", skew: "-skew-x-12" },
    { src: "https://images.unsplash.com/photo-1715432362539-6ab2ab480db2?w=500&auto=format&fit=crop", skew: "skew-x-12" },
    { src: "https://images.unsplash.com/photo-1718601980986-0ce75101d52d?w=500&auto=format&fit=crop", skew: "-skew-x-12" },
    { src: "https://images.unsplash.com/photo-1685904042960-66242a0ac352?w=500&auto=format&fit=crop", skew: "skew-x-12" },
  ], []);

  const galleryImages2 = useMemo(() => [
    { src: "https://images.unsplash.com/photo-1718183120769-ece47f31045b?w=500&auto=format&fit=crop" },
    { src: "https://images.unsplash.com/photo-1715432362539-6ab2ab480db2?w=500&auto=format&fit=crop" },
    { src: "https://images.unsplash.com/photo-1685904042960-66242a0ac352?w=500&auto=format&fit=crop" },
    { src: "https://images.unsplash.com/photo-1718838541476-d04e71caa347?w=500&auto=format&fit=crop" },
  ], []);

  return (
 
      <section ref={ref} id="visuals" className="relative w-full bg-black">

        {/* Enhanced gradient overlay */}
        <div className="absolute inset-0 gradient-mesh opacity-50 z-0 pointer-events-none min-h-full will-change-auto"></div>
        
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none z-0 min-h-full will-change-auto" 
          style={{
            backgroundImage: `linear-gradient(rgba(212, 175, 55, 0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(212, 175, 55, 0.1) 1px, transparent 1px)`,
            backgroundSize: '54px 54px'
          }}
        />


        <div ref={wrapperRef} className="wrapper relative z-10" style={{ minHeight: '300vh' }}>
          {/* First Sticky Section */}
          <motion.section 
            className="text-white h-screen w-full bg-black grid place-content-center sticky top-0 will-change-transform"
            style={{ opacity: opacity1 }}
          >
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,rgba(212,175,55,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(212,175,55,0.05)_1px,transparent_1px)] bg-size-[54px_54px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

            <ScrollFloat
              animationDuration={1}
              ease='back.inOut(2)'
              scrollStart='center bottom+=50%'
              scrollEnd='bottom bottom-=40%'
              stagger={0.03}>
            <motion.h1 
              className="2xl:text-7xl text-6xl px-8 font-serif font-semibold text-center tracking-tight leading-[120%] will-change-transform"
              initial={{ opacity: 0, y: 60, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <motion.span
                className="block"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true }}
              >
              </motion.span>
              <br />
              <motion.span 
                className="gold-gradient-text inline-block"
                initial={{ opacity: 0, x: 50, scale: 0.8 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true }}
                animate={{
                  textShadow: [
                    '0 0 20px rgba(212, 175, 55, 0.3)',
                    '0 0 40px rgba(212, 175, 55, 0.6)',
                    '0 0 20px rgba(212, 175, 55, 0.3)',
                  ],
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  opacity: { duration: 0.8, delay: 0.4 },
                  x: { duration: 0.8, delay: 0.4 },
                  textShadow: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.6
                  },
                  scale: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.6
                  }
                }}
              >
                Creative Excellence
              </motion.span>
            </motion.h1>
            </ScrollFloat>
          </motion.section>

          {/* Second Sticky Section - Gold Accent */}
          <motion.section 
            className="bg-primary/10 text-white grid place-content-center h-screen sticky top-0 rounded-tr-2xl rounded-tl-2xl overflow-hidden backdrop-blur-sm border-t border-b border-primary/20 will-change-transform"
            style={{ opacity: opacity2, scale: scale2 }}
          >
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,rgba(212,175,55,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(212,175,55,0.05)_1px,transparent_1px)] bg-size-[54px_54px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
            <motion.h1 
              className="2xl:text-7xl text-4xl px-8 font-serif font-semibold text-center tracking-tight leading-[120%] will-change-transform"
              initial={{ opacity: 0, y: 60, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <motion.span
                className="block"
                initial={{ opacity: 0, rotateX: -90 }}
                whileInView={{ opacity: 1, rotateX: 0 }}
                viewport={{ once: true }}
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  opacity: { duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] },
                  rotateX: { duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] },
                  y: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.8
                  }
                }}
              >
                We Transform Brands Through
              </motion.span>
              <br />
              <motion.span 
                className="gold-gradient-text inline-block"
                initial={{ opacity: 0, rotateX: 90, scale: 0.8 }}
                whileInView={{ opacity: 1, rotateX: 0, scale: 1 }}
                viewport={{ once: true }}
                animate={{
                  filter: [
                    'drop-shadow(0 0 10px rgba(212, 175, 55, 0.5))',
                    'drop-shadow(0 0 25px rgba(212, 175, 55, 0.8))',
                    'drop-shadow(0 0 10px rgba(212, 175, 55, 0.5))',
                  ],
                  scale: [1, 1.03, 1],
                }}
                transition={{
                  opacity: { duration: 0.8, delay: 0.5 },
                  rotateX: { duration: 0.8, delay: 0.5 },
                  scale: { duration: 0.8, delay: 0.5 },
                  filter: {
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.7
                  },
                  scale: {
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.7
                  }
                }}
              >
                Digital Innovation
              </motion.span>
            </motion.h1>
          </motion.section>

          {/* Third Sticky Section */}
          <motion.section 
            className="text-white h-screen w-full bg-black grid place-content-center sticky top-0 will-change-transform"
            style={{ opacity: opacity3 }}
          >
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,rgba(212,175,55,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(212,175,55,0.05)_1px,transparent_1px)] bg-size-[54px_54px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
            <motion.h1 
              className="2xl:text-7xl text-5xl px-8 font-serif font-semibold text-center tracking-tight leading-[120%] will-change-transform"
              initial={{ opacity: 0, y: 60, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <motion.span
                className="block"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true }}
              >
                Every Pixel Tells
              </motion.span>
              <motion.span
                className="block"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true }}
              >
                Your{' '}
                <motion.span 
                  className="gold-gradient-text inline-block"
                  initial={{ opacity: 0, scale: 0.5, rotateY: -90 }}
                  whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                  viewport={{ once: true }}
                  animate={{
                    textShadow: [
                      '0 0 15px rgba(212, 175, 55, 0.4)',
                      '0 0 30px rgba(212, 175, 55, 0.7)',
                      '0 0 15px rgba(212, 175, 55, 0.4)',
                    ],
                    scale: [1, 1.02, 1],
                  }}
                  transition={{
                    opacity: { duration: 0.8, delay: 0.7 },
                    scale: { duration: 0.8, delay: 0.7 },
                    rotateY: { duration: 0.8, delay: 0.7 },
                    textShadow: {
                      duration: 2.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.9
                    },
                    scale: {
                      duration: 3.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.9
                    }
                  }}
                >
                  Brand Story
                </motion.span>
              </motion.span>
            </motion.h1>
          </motion.section>
        </div>

        {/* Image Gallery Section - Left Text, Right Images */}
        <section className="text-white w-full bg-black relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <motion.div 
              className="sticky top-0 h-screen flex items-center justify-center bg-black/50 backdrop-blur-sm will-change-transform"
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <motion.h1 
                className="2xl:text-7xl text-5xl px-8 font-serif font-semibold text-center tracking-tight leading-[120%] will-change-transform"
                initial={{ opacity: 0, filter: "blur(5px)" }}
                whileInView={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 1, delay: 0.3 }}
                viewport={{ once: true, margin: "-100px" }}
              >
              <motion.span
                className="block"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                animate={{
                  x: [0, -3, 0],
                }}
                transition={{
                  opacity: { duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] },
                  x: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.8
                  }
                }}
              >
                Crafting Experiences That
              </motion.span>
                <br />
                <motion.span 
                  className="gold-gradient-text inline-block"
                  initial={{ opacity: 0, x: 50, scale: 0.9 }}
                  whileInView={{ opacity: 1, x: 0, scale: 1 }}
                  viewport={{ once: true }}
                  animate={{
                    textShadow: [
                      '0 0 20px rgba(212, 175, 55, 0.4)',
                      '0 0 35px rgba(212, 175, 55, 0.7)',
                      '0 0 20px rgba(212, 175, 55, 0.4)',
                    ],
                    scale: [1, 1.02, 1],
                    x: [0, 3, 0],
                  }}
                  transition={{
                    opacity: { duration: 0.8, delay: 0.5 },
                    x: { 
                      duration: 0.8, 
                      delay: 0.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.8
                    },
                    textShadow: {
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.7
                    },
                    scale: {
                      duration: 3.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.7
                    }
                  }}
                >
                  Elevate Your Brand
                </motion.span>
              </motion.h1>
            </motion.div>
            <div className="grid gap-2 py-4">
              {galleryImages1.map((img, index) => (
                <motion.figure 
                  key={index}
                  className={`grid place-content-center ${img.skew} will-change-transform`}
                  initial={{ opacity: 0, y: 50, rotateX: 20 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={{ scale: 1.05 }}
                >
                  <img
                    src={img.src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="transition-all duration-300 w-80 h-96 align-bottom object-cover rounded-md border border-primary/20 hover:border-primary/50"
                  />
                </motion.figure>
              ))}
            </div>
          </div>
        </section>

        {/* Image Gallery Section - Left Images, Right Text */}
        <section className="text-white w-full bg-black relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 px-8">
            <div className="grid gap-2 py-4">
              {galleryImages2.map((img, index) => (
                <motion.figure 
                  key={index}
                  className="sticky top-0 h-screen grid place-content-center will-change-transform"
                  initial={{ opacity: 0, x: -100, rotateY: -20 }}
                  whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                  transition={{ duration: 1, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={{ scale: 1.05 }}
                >
                  <img
                    src={img.src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="transition-all duration-300 w-96 h-96 align-bottom object-cover rounded-md border border-primary/20 hover:border-primary/50 shadow-lg shadow-primary/10"
                  />
                </motion.figure>
              ))}
            </div>
            <motion.div 
              className="sticky top-0 h-screen grid place-content-center bg-black/50 backdrop-blur-sm will-change-transform"
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <motion.h1 
                className="text-4xl px-8 font-serif font-medium text-right tracking-tight leading-[120%] will-change-transform"
                initial={{ opacity: 0, filter: "blur(5px)" }}
                whileInView={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 1, delay: 0.5 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <motion.span
                  className="block"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  animate={{
                    x: [0, 3, 0],
                  }}
                  transition={{
                    opacity: { duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] },
                    x: {
                      duration: 3.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.9
                    }
                  }}
                >
                  From Concept to Reality,
                </motion.span>
                <br />
                <motion.span
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  viewport={{ once: true }}
                >
                  We Build{' '}
                  <motion.span 
                    className="gold-gradient-text inline-block"
                    initial={{ opacity: 0, scale: 0.8, rotateZ: -5 }}
                    whileInView={{ opacity: 1, scale: 1, rotateZ: 0 }}
                    viewport={{ once: true }}
                    animate={{
                      filter: [
                        'drop-shadow(0 0 12px rgba(212, 175, 55, 0.5))',
                        'drop-shadow(0 0 28px rgba(212, 175, 55, 0.8))',
                        'drop-shadow(0 0 12px rgba(212, 175, 55, 0.5))',
                      ],
                      scale: [1, 1.03, 1],
                      rotateZ: [0, 1, -1, 0],
                    }}
                    transition={{
                      opacity: { duration: 0.8, delay: 0.8 },
                      scale: { duration: 0.8, delay: 0.8 },
                      rotateZ: { duration: 0.8, delay: 0.8 },
                      filter: {
                        duration: 2.6,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                      },
                      scale: {
                        duration: 3.3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                      },
                      rotateZ: {
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                      }
                    }}
                  >
                    Digital Excellence
                  </motion.span>
                </motion.span>
              </motion.h1>
            </motion.div>
          </div>
        </section>

        {/* Footer Section */}
        <footer className="group bg-black relative z-10">
          <motion.h1 
            className="text-[16vw] group-hover:translate-y-4 translate-y-20 leading-[100%] uppercase font-serif font-semibold text-center bg-linear-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent transition-all ease-linear will-change-transform"
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              filter: [
                'drop-shadow(0 0 20px rgba(212, 175, 55, 0.3))',
                'drop-shadow(0 0 40px rgba(212, 175, 55, 0.6))',
                'drop-shadow(0 0 20px rgba(212, 175, 55, 0.3))',
              ],
              scale: [1, 1.01, 1],
            }}
            transition={{
              opacity: { duration: 1.5, ease: [0.22, 1, 0.36, 1] },
              y: { duration: 1.5, ease: [0.22, 1, 0.36, 1] },
              backgroundPosition: {
                duration: 5,
                repeat: Infinity,
                ease: "linear"
              },
              filter: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5
              },
              scale: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5
              }
            }}
            style={{
              backgroundSize: '200% 200%',
            }}
          >
            ELITE
          </motion.h1>
          <motion.section 
            className="bg-black h-40 relative z-10 grid place-content-center text-2xl rounded-tr-full rounded-tl-full border-t border-primary/20 will-change-opacity"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <motion.span 
              className="gold-gradient-text inline-block"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              animate={{
                textShadow: [
                  '0 0 10px rgba(212, 175, 55, 0.4)',
                  '0 0 20px rgba(212, 175, 55, 0.7)',
                  '0 0 10px rgba(212, 175, 55, 0.4)',
                ],
                scale: [1, 1.05, 1],
              }}
              transition={{
                opacity: { duration: 1, delay: 0.5 },
                scale: { duration: 1, delay: 0.5 },
                textShadow: {
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.7
                },
                scale: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.7
                }
              }}
            >
              Premium Digital Marketing Agency
            </motion.span>
          </motion.section>
        </footer>
      </section>
  );
}
