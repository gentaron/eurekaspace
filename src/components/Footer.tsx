'use client';

import { motion } from 'framer-motion';
import { Music, Video, Heart } from 'lucide-react';

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
              <span>25 Tracks</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-[oklch(0.75_0.18_180)]" />
              <span>1 Video</span>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-xs text-[oklch(0.45_0.02_280)] flex items-center gap-1.5">
            Made with <Heart className="w-3 h-3 text-[oklch(0.72_0.22_300)] fill-[oklch(0.72_0.22_300)]" /> by Mina Eureka
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
