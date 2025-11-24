"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Send } from 'lucide-react'

export function ContactSection() {
  return (
    <section className="w-full h-screen flex items-center bg-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      <div className="absolute top-20 left-20 w-96 h-96 bg-black/20 rounded-full blur-[120px] animate-float"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-white/10 rounded-full blur-[100px] animate-float-slow"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, type: "spring", bounce: 0.3 }}
            viewport={{ once: false }}
          >
            <h2 className="text-5xl md:text-7xl font-serif font-bold text-black mb-6 leading-tight">
              {["Let's Create", "Something", "Extraordinary."].map((line, lineIndex) => (
                <motion.span
                  key={lineIndex}
                  className="block"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: lineIndex * 0.2 }}
                  viewport={{ once: false }}
                >
                  {line}
                </motion.span>
              ))}
            </h2>
            
            <motion.p 
              className="text-black/70 text-xl max-w-md leading-relaxed mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: false }}
            >
              Ready to elevate your brand? We are currently accepting new projects for Q4 2025.
            </motion.p>
            
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              viewport={{ once: false }}
            >
              <motion.p 
                className="text-black font-medium"
                whileHover={{ x: 10, color: "#1a1a1a" }}
              >
                hello@eliteagency.com
              </motion.p>
              <motion.p 
                className="text-black font-medium"
                whileHover={{ x: 10, color: "#1a1a1a" }}
              >
                +1 (555) 000-0000
              </motion.p>
            </motion.div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 100, rotateY: -15 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.3, type: "spring" }}
            viewport={{ once: false }}
            className="space-y-6 bg-white/10 backdrop-blur-md p-8 md:p-12 rounded-2xl border border-black/5 shadow-2xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: false }}
              >
                <label className="text-sm font-medium text-black uppercase tracking-wider">Name</label>
                <Input className="bg-transparent border-black/20 focus:border-black text-black placeholder:text-black/40 rounded-none border-0 border-b h-12 px-0 transition-all duration-300 focus:scale-105" placeholder="John Doe" />
              </motion.div>
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                viewport={{ once: false }}
              >
                <label className="text-sm font-medium text-black uppercase tracking-wider">Email</label>
                <Input className="bg-transparent border-black/20 focus:border-black text-black placeholder:text-black/40 rounded-none border-0 border-b h-12 px-0 transition-all duration-300 focus:scale-105" placeholder="john@example.com" />
              </motion.div>
            </div>
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              viewport={{ once: false }}
            >
              <label className="text-sm font-medium text-black uppercase tracking-wider">Message</label>
              <Textarea className="bg-transparent border-black/20 focus:border-black text-black placeholder:text-black/40 rounded-none border-0 border-b min-h-[100px] px-0 resize-none transition-all duration-300 focus:scale-105" placeholder="Tell us about your project..." />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              viewport={{ once: false }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="w-full bg-black text-white hover:bg-black/80 h-14 text-lg rounded-none mt-4 group relative overflow-hidden">
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  ></motion.span>
                  <span className="flex items-center justify-center gap-2">
                    Send Message
                    <Send className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Button>
              </motion.div>
            </motion.div>
          </motion.form>
        </div>
      </div>
    </section>
  )
}
