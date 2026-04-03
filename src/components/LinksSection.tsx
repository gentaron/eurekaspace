'use client';

import { motion } from 'framer-motion';
import { BookOpen, Star, ExternalLink, ArrowRight } from 'lucide-react';

const links = [
  {
    title: 'Eureka Blog',
    description: 'Personal blog by Mina Eureka — thoughts, behind-the-scenes, and creative updates.',
    url: 'https://v0-mina-auto-scribe-rnua5mddd-gentaros-projects-78e38d6f.vercel.app/',
    icon: BookOpen,
    gradient: 'from-[oklch(0.72_0.22_300)] to-[oklch(0.80_0.15_320)]',
    glowColor: 'oklch(0.72 0.22 300)',
    tag: 'Blog',
  },
  {
    title: 'Auralis Eternal Light',
    description: 'Official idol website — discover the world of Eureka\'s idol persona and performances.',
    url: 'https://auralis-eternal-light.lovable.app',
    icon: Star,
    gradient: 'from-[oklch(0.75_0.18_180)] to-[oklch(0.80_0.15_320)]',
    glowColor: 'oklch(0.75 0.18 180)',
    tag: 'Idol Site',
  },
];

export default function LinksSection() {
  return (
    <section className="relative py-20 px-6" id="links">
      {/* Background accent */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] opacity-[0.06] blur-[150px]"
          style={{ background: 'linear-gradient(135deg, oklch(0.72 0.22 300), oklch(0.75 0.18 180))' }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-sm font-mono tracking-[0.3em] uppercase text-[oklch(0.80_0.15_320)]">
            Explore More
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-3 bg-gradient-to-r from-foreground via-[oklch(0.80_0.15_320)] to-[oklch(0.72_0.22_300)] bg-clip-text text-transparent">
            Links
          </h2>
        </motion.div>

        {/* Link cards */}
        <div className="grid gap-6 sm:grid-cols-2">
          {links.map((link, i) => (
            <motion.a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative glass rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:scale-[1.02] cursor-pointer block"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 0 30px ${link.glowColor} / 0.15), 0 0 60px ${link.glowColor} / 0.05)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Tag */}
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 bg-gradient-to-r ${link.gradient} text-white/90`}>
                {link.tag}
              </div>

              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${link.gradient} opacity-80 group-hover:opacity-100 transition-opacity`}>
                <link.icon className="w-6 h-6 text-white" />
              </div>

              {/* Text */}
              <h3 className="text-xl font-bold mb-2 group-hover:text-foreground transition-colors">
                {link.title}
              </h3>
              <p className="text-sm text-[oklch(0.55_0.02_280)] leading-relaxed mb-4">
                {link.description}
              </p>

              {/* Visit link */}
              <div className="flex items-center gap-1.5 text-sm font-medium opacity-60 group-hover:opacity-100 transition-all group-hover:gap-2.5">
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Visit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>

              {/* Hover border glow */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `linear-gradient(135deg, ${link.glowColor} / 0.05), transparent)`,
                }}
              />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
