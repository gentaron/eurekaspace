'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export const artistImage = '/images/from-PixAI-1981530503026545976-2.png';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, oklch(0.72 0.22 300) 0%, transparent 70%)',
            top: '10%',
            left: '10%',
          }}
          animate={{
            x: [0, 80, -40, 0],
            y: [0, -60, 30, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, oklch(0.75 0.18 180) 0%, transparent 70%)',
            bottom: '10%',
            right: '10%',
          }}
          animate={{
            x: [0, -60, 40, 0],
            y: [0, 40, -80, 0],
            scale: [1, 0.8, 1.1, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[300px] h-[300px] rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, oklch(0.80 0.15 320) 0%, transparent 70%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(oklch(0.72 0.22 300) 1px, transparent 1px),
                            linear-gradient(90deg, oklch(0.72 0.22 300) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-20 px-6 max-w-7xl mx-auto">
        {/* Artist image */}
        <motion.div
          className="relative group"
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          {/* Glow ring behind image */}
          <div className="absolute -inset-4 rounded-2xl opacity-50 blur-xl animate-pulse-glow"
            style={{ background: 'linear-gradient(135deg, oklch(0.72 0.22 300), oklch(0.75 0.18 180))' }}
          />
          <div className="relative w-52 sm:w-60 lg:w-72 rounded-2xl overflow-hidden border border-[oklch(0.30_0.04_300/0.3)]" style={{ aspectRatio: '768/1280' }}>
            <Image
              src="/images/from-PixAI-1981530503026545976-2.png"
              alt="Mina Eureka"
              width={768}
              height={1280}
              className="object-contain transition-transform duration-700 group-hover:scale-105"
              priority
            />
          </div>
          {/* Floating badge */}
          <motion.div
            className="absolute -bottom-3 -right-3 glass rounded-full px-4 py-2 text-sm font-medium text-[oklch(0.75_0.18_180)]"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            ✦ Artist
          </motion.div>
        </motion.div>

        {/* Text content */}
        <div className="text-center lg:text-left flex-1">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="inline-block text-sm sm:text-base font-mono tracking-[0.3em] uppercase text-[oklch(0.72_0.22_300)] mb-4">
              Welcome to the universe of
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight mb-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <span className="bg-gradient-to-r from-[oklch(0.72_0.22_300)] via-[oklch(0.80_0.15_320)] to-[oklch(0.75_0.18_180)] bg-clip-text text-transparent">
              Mina
            </span>
            <br />
            <span className="text-foreground">Eureka</span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-[oklch(0.65_0.02_280)] max-w-xl leading-relaxed mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            E16連星系・Symphony of Stars発。E528現在、AURALIS第二世代の音楽プロデューサーとして
            リミナル・フォージを主宰し、時相放送で地球AD2026のインターネット上に出現する
            <span className="text-[oklch(0.80_0.15_320)]"> celestial × avant-garde</span> アーティスト。
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-3 justify-center lg:justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            {['celestial', 'avant-garde', 'AURALIS', 'Liminal Forge', 'E528'].map((tag) => (
              <span
                key={tag}
                className="glass rounded-full px-4 py-1.5 text-sm text-[oklch(0.80_0.15_320)] hover:text-[oklch(0.72_0.22_300)] transition-colors cursor-default"
              >
                {tag}
              </span>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            className="flex gap-8 mt-10 justify-center lg:justify-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            {[
              { value: '2000+', label: 'Genesis Vault' },
              { value: '5', label: 'AURALIS Members' },
              { value: 'E528', label: 'Current Year' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[oklch(0.72_0.22_300)] to-[oklch(0.75_0.18_180)] bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-xs text-[oklch(0.55_0.02_280)] uppercase tracking-wider mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ opacity: [0.3, 0.8, 0.3], y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-xs text-[oklch(0.55_0.02_280)] uppercase tracking-[0.2em]">Scroll</span>
        <svg width="16" height="24" viewBox="0 0 16 24" fill="none" className="text-[oklch(0.55_0.02_280)]">
          <rect x="1" y="1" width="14" height="22" rx="7" stroke="currentColor" strokeWidth="1.5"/>
          <motion.circle
            cx="8" cy="8" r="2" fill="currentColor"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </svg>
      </motion.div>
    </section>
  );
}
