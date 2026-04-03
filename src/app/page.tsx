'use client';

import HeroSection from '@/components/HeroSection';
import AudioPlayer from '@/components/AudioPlayer';
import VideoSection from '@/components/VideoSection';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Music, Headphones, Sparkles, Zap, Radio, Waveform } from 'lucide-react';

function FloatingNavbar() {
  return (
    <motion.nav
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 glass rounded-full px-6 py-3 flex items-center gap-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.5 }}
    >
      <a href="#tracks" className="text-sm text-[oklch(0.65_0.02_280)] hover:text-[oklch(0.72_0.22_300)] transition-colors flex items-center gap-1.5">
        <Music className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Tracks</span>
      </a>
      <div className="w-px h-4 bg-[oklch(0.25_0.03_280)]" />
      <a href="#video" className="text-sm text-[oklch(0.65_0.02_280)] hover:text-[oklch(0.75_0.18_180)] transition-colors flex items-center gap-1.5">
        <Headphones className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Video</span>
      </a>
    </motion.nav>
  );
}

function MarqueeBanner() {
  const items = [
    { icon: Sparkles, text: 'Mina Eureka' },
    { icon: Zap, text: 'Experimental Sound' },
    { icon: Radio, text: 'Sonic Universe' },
    { icon: Music, text: 'Creative Freedom' },
    { icon: Sparkles, text: 'Mina Eureka' },
    { icon: Zap, text: 'Experimental Sound' },
    { icon: Radio, text: 'Sonic Universe' },
    { icon: Music, text: 'Creative Freedom' },
  ];

  return (
    <div className="relative overflow-hidden py-6 border-y border-[oklch(0.20_0.03_280)]">
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{ x: [0, -1200] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        {[...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-sm text-[oklch(0.40_0.02_280)]">
            <item.icon className="w-4 h-4 text-[oklch(0.72_0.22_300/0.3)]" />
            <span>{item.text}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen noise-bg relative">
      <FloatingNavbar />
      <HeroSection />
      <MarqueeBanner />
      <AudioPlayer />
      <MarqueeBanner />
      <VideoSection />
      <Footer />
    </div>
  );
}
