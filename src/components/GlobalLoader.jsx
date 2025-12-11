"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

export function GlobalLoader({ isLoading }) {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        if (isLoading) {
            // Simulate loading progress
            const interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 90) return prev
                    return prev + Math.random() * 10
                })
            }, 200)

            return () => clearInterval(interval)
        } else {
            // Complete the progress when loading is done
            setProgress(100)
        }
    }, [isLoading])

    return (
        <AnimatePresence mode="wait">
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black"
                >
                    {/* Animated Logo/Brand */}
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="mb-8"
                    >
                        <motion.h1
                            className="text-6xl md:text-8xl font-display font-bold gold-gradient-text"
                            animate={{
                                opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            ELITE
                        </motion.h1>
                    </motion.div>

                    {/* Progress Bar Container */}
                    <div className="w-64 md:w-96 h-1 bg-zinc-800 rounded-full overflow-hidden relative">
                        <motion.div
                            className="h-full bg-gradient-to-r from-primary via-yellow-400 to-primary bg-[length:200%_100%]"
                            initial={{ width: 0 }}
                            animate={{ 
                                width: `${progress}%`,
                                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                            }}
                            transition={{ 
                                width: { duration: 0.3 },
                                backgroundPosition: {
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "linear"
                                }
                            }}
                        />
                    </div>

                    {/* Loading Text */}
                    <motion.p
                        className="mt-6 text-zinc-400 text-sm md:text-base font-light tracking-wider"
                        animate={{
                            opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        {Math.round(progress)}% تحميل
                    </motion.p>

                    {/* Animated Dots */}
                    <div className="flex gap-2 mt-4">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className="w-2 h-2 bg-primary rounded-full"
                                animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [0.3, 1, 0.3],
                                }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                }}
                            />
                        ))}
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {/* Top Left Corner */}
                        <motion.div
                            className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.3, 0.5, 0.3],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                        {/* Bottom Right Corner */}
                        <motion.div
                            className="absolute bottom-0 right-0 w-64 h-64 bg-yellow-400/5 rounded-full blur-3xl"
                            animate={{
                                scale: [1.2, 1, 1.2],
                                opacity: [0.5, 0.3, 0.5],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}



