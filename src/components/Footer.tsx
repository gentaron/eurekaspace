'use client';

import { motion } from 'framer-motion';
import { Music, Video, Heart, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative py-12 px-6 border-t border-[oklch(0.25_0.03_280)]">
      <div className="max-w-4xl mx-auto">
        {/* Divider glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, oklch(0.72 0.22 300), transparent)' }}
        />

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-between gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Logo/Brand */}
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, oklch(0.72 0.22 300), oklch(0.75 0.18 180))' }}
            >
              <Music className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">
              <span className="bg-gradient-to-r from-[oklch(0.72_0.22_300)] to-[oklch(0.75_0.18_180)] bg-clip-text text-transparent">
                Mina
              </span>{' '}
              Eureka
            </span>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-6 text-sm text-[oklch(0.55_0.02_280)]">
            <div className="flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5 text-[oklch(0.72_0.22_300)]" />
              <span>Genesis Vault 2000+</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-[oklch(0.75_0.18_180)]" />
              <span>Liminal Forge · E528</span>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-xs text-[oklch(0.45_0.02_280)] flex items-center gap-1.5">
            Made with <Heart className="w-3 h-3 text-[oklch(0.72_0.22_300)] fill-[oklch(0.72_0.22_300)]" /> by Mina Eureka
          </div>
        </motion.div>

        {/* Universe Links */}
        <div className="mt-10 pt-6 border-t border-[oklch(0.25_0.03_280)]">
          <p className="text-center text-[10px] tracking-[0.2em] uppercase text-[oklch(0.55_0.02_280)] mb-4">Universe Sites</p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-xs text-[oklch(0.55_0.02_280)]">
            <a href="https://auralis-eternal-light.lovable.app/" target="_blank" rel="noopener noreferrer" className="hover:text-[oklch(0.72_0.22_300)] transition-colors inline-flex items-center gap-1">AURALIS <ExternalLink className="w-2.5 h-2.5 opacity-50" /></a>
            <a href="https://edu-eternal-dominion-universe.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:text-[oklch(0.72_0.22_300)] transition-colors inline-flex items-center gap-1">EDU <ExternalLink className="w-2.5 h-2.5 opacity-50" /></a>
            <a href="https://e16super.netlify.app/" target="_blank" rel="noopener noreferrer" className="hover:text-[oklch(0.72_0.22_300)] transition-colors inline-flex items-center gap-1">E16 Portal <ExternalLink className="w-2.5 h-2.5 opacity-50" /></a>
            <a href="https://laylaland.netlify.app/" target="_blank" rel="noopener noreferrer" className="hover:text-[oklch(0.72_0.22_300)] transition-colors inline-flex items-center gap-1">Layla Land <ExternalLink className="w-2.5 h-2.5 opacity-50" /></a>
            <a href="https://irisworlds.netlify.app/" target="_blank" rel="noopener noreferrer" className="hover:text-[oklch(0.72_0.22_300)] transition-colors inline-flex items-center gap-1">Iris Worlds <ExternalLink className="w-2.5 h-2.5 opacity-50" /></a>
            <a href="https://game-of-mina.netlify.app/" target="_blank" rel="noopener noreferrer" className="hover:text-[oklch(0.72_0.22_300)] transition-colors inline-flex items-center gap-1">Game of Mina <ExternalLink className="w-2.5 h-2.5 opacity-50" /></a>
            <a href="https://orbital-eternity.netlify.app/" target="_blank" rel="noopener noreferrer" className="hover:text-[oklch(0.72_0.22_300)] transition-colors inline-flex items-center gap-1">Orbital Eternity <ExternalLink className="w-2.5 h-2.5 opacity-50" /></a>
          </div>
          <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-xs text-[oklch(0.55_0.02_280)]">
            <a href="https://katepatton.lovable.app" target="_blank" rel="noopener noreferrer" className="hover:text-[oklch(0.75_0.18_180)] transition-colors inline-flex items-center gap-1">Kate Patton <ExternalLink className="w-2.5 h-2.5 opacity-50" /></a>
            <a href="https://lillieardentsuper.lovable.app" target="_blank" rel="noopener noreferrer" className="hover:text-[oklch(0.75_0.18_180)] transition-colors inline-flex items-center gap-1">Lillie Ardent <ExternalLink className="w-2.5 h-2.5 opacity-50" /></a>
            <a href="https://ninnyoffenbach.lovable.app" target="_blank" rel="noopener noreferrer" className="hover:text-[oklch(0.75_0.18_180)] transition-colors inline-flex items-center gap-1">Ninny Offenbach <ExternalLink className="w-2.5 h-2.5 opacity-50" /></a>
            <a href="https://kate1st.netlify.app/" target="_blank" rel="noopener noreferrer" className="hover:text-[oklch(0.75_0.18_180)] transition-colors inline-flex items-center gap-1">Kate Claudia <ExternalLink className="w-2.5 h-2.5 opacity-50" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
