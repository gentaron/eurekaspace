'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Maximize, Volume2, ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import { useMediaStore } from '@/lib/mediaStore';

interface VideoItem {
  id: number;
  title: string;
  src: string;
  aspect: string; // CSS aspect-ratio
}

const videos: VideoItem[] = [
  {
    id: 1,
    title: 'Mina Eureka — Official',
    src: '/video/grok-video-d6391748-c6e5-4dc4-a1ea-b444f6ab7e14.mp4',
    aspect: '9/16',
  },
  {
    id: 2,
    title: 'Imagine I',
    src: '/video/imagine-94342c7b.mp4',
    aspect: '9/16',
  },
  {
    id: 3,
    title: 'Imagine II',
    src: '/video/imagine-385a857d.mp4',
    aspect: '9/16',
  },
  {
    id: 4,
    title: 'Imagine III',
    src: '/video/imagine-3ecabe2e.mp4',
    aspect: '9/16',
  },
  {
    id: 5,
    title: 'Imagine IV',
    src: '/video/imagine-b94ea831.mp4',
    aspect: '9/16',
  },
];

function VideoCard({
  video,
  isActive,
  onActivate,
}: {
  video: VideoItem;
  isActive: boolean;
  onActivate: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);

  const { activeSource, setActiveSource } = useMediaStore();

  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setActiveSource(null);
      } else {
        onActivate();
        setActiveSource('video');
        setShowOverlay(false);
        videoRef.current.play().catch(() => {
          setShowOverlay(true);
        });
      }
    }
  }, [isPlaying, onActivate, setActiveSource]);

  const toggleFullscreen = () => {
    if (videoRef.current?.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  // Pause when audio takes over or another video becomes active
  useEffect(() => {
    if ((activeSource === 'audio' || !isActive) && videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
    }
  }, [activeSource, isActive]);

  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, []);

  return (
    <div
      className="relative rounded-2xl overflow-hidden glass group flex-shrink-0"
      style={{ width: 'min(280px, 70vw)' }}
    >
      <div className="relative bg-black" style={{ aspectRatio: video.aspect }}>
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src={video.src}
          onClick={togglePlay}
          onPlay={() => { setIsPlaying(true); setActiveSource('video'); }}
          onPause={() => { setIsPlaying(false); setShowOverlay(true); }}
          onEnded={() => { setIsPlaying(false); setShowOverlay(true); setActiveSource(null); }}
          playsInline
          preload="metadata"
        />

        {/* Overlay */}
        {showOverlay && !isPlaying && (
          <motion.div
            className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer"
            onClick={togglePlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, oklch(0.70 0.25 350), oklch(0.65 0.22 320))',
                boxShadow: '0 0 30px oklch(0.70 0.25 350 / 0.4)',
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="w-6 h-6 text-white ml-0.5" />
            </motion.div>
          </motion.div>
        )}

        {/* Bottom controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button onClick={togglePlay} className="p-1.5 text-white/90 hover:text-white transition-colors">
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button onClick={toggleFullscreen} className="p-1.5 text-white/90 hover:text-white transition-colors">
            <Maximize className="w-4 h-4" />
          </button>
        </div>

        {/* Title badge */}
        <div className="absolute top-2 left-2 glass rounded-lg px-2.5 py-1 text-[10px] text-[oklch(0.80_0.20_350)] font-medium">
          {video.title}
        </div>
      </div>
    </div>
  );
}

export default function VideoSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeVideoId, setActiveVideoId] = useState<number | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', updateScrollButtons);
      updateScrollButtons();
      return () => el.removeEventListener('scroll', updateScrollButtons);
    }
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = 300;
      scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative py-20 px-6" id="video">
      {/* Background accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute bottom-0 right-0 w-[600px] h-[400px] opacity-10 blur-[120px]"
          style={{ background: 'linear-gradient(180deg, transparent, oklch(0.70 0.25 350))' }}
        />
        <div
          className="absolute top-0 left-0 w-[400px] h-[300px] opacity-8 blur-[100px]"
          style={{ background: 'radial-gradient(circle, oklch(0.65 0.22 320), transparent)' }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-4 h-4 text-[oklch(0.70_0.25_350)]" />
            <span className="text-xs font-mono tracking-[0.3em] uppercase text-[oklch(0.70_0.25_350)]">
              Sexy Block
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-foreground via-[oklch(0.75_0.22_340)] to-[oklch(0.70_0.25_350)] bg-clip-text text-transparent">
            セクシー・ブロック
          </h2>
          <p className="text-sm text-[oklch(0.50_0.02_280)] mt-2">{videos.length} videos</p>
        </motion.div>

        {/* Video carousel */}
        <div className="relative">
          {/* Scroll buttons */}
          <AnimatePresence>
            {canScrollLeft && (
              <motion.button
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-20 w-10 h-10 rounded-full glass flex items-center justify-center text-foreground hover:scale-110 transition-transform"
                onClick={() => scroll('left')}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {canScrollRight && (
              <motion.button
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-20 w-10 h-10 rounded-full glass flex items-center justify-center text-foreground hover:scale-110 transition-transform"
                onClick={() => scroll('right')}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Edge fade */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[oklch(0.07_0.02_280)] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[oklch(0.07_0.02_280)] to-transparent z-10 pointer-events-none" />

          {/* Scrollable row */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 px-1 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {videos.map((video, i) => (
              <motion.div
                key={video.id}
                className="snap-start"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
              >
                <VideoCard
                  video={video}
                  isActive={activeVideoId === video.id}
                  onActivate={() => setActiveVideoId(video.id)}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Section description */}
        <motion.p
          className="text-center text-[oklch(0.55_0.02_280)] mt-6 text-sm max-w-lg mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          A visual journey through the cinematic universe of Mina Eureka.
        </motion.p>
      </div>
    </section>
  );
}
