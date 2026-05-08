"use client"
import { motion } from "framer-motion"
import { ReactNode } from "react"

export function RevealSection({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: delay / 1000 }}
      className={className}
    >
      {children}
    </motion.section>
  )
}

export function SectionHeader({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      {children}
    </div>
  )
}
