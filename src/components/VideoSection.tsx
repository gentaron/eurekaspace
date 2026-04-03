'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Maximize, Volume2 } from 'lucide-react';

export default function VideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
      setShowOverlay(false);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <section className="relative py-20 px-6" id="video">
      {/* Background accent */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute bottom-0 right-0 w-[600px] h-[400px] opacity-10 blur-[120px]"
          style={{ background: 'linear-gradient(180deg, transparent, oklch(0.75 0.18 180))' }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-sm font-mono tracking-[0.3em] uppercase text-[oklch(0.75_0.18_180)]">
            Visual Experience
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-3 bg-gradient-to-r from-foreground via-[oklch(0.75_0.18_180)] to-[oklch(0.80_0.15_320)] bg-clip-text text-transparent">
            Video
          </h2>
        </motion.div>

        {/* Video container */}
        <motion.div
          className="relative rounded-2xl overflow-hidden glass glow-cyan group"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative aspect-video bg-black">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              src="/video/grok-video-d6391748-c6e5-4dc4-a1ea-b444f6ab7e14.mp4"
              onClick={togglePlay}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => { setIsPlaying(false); setShowOverlay(true); }}
              playsInline
              preload="metadata"
              poster="/images/from-PixAI-1981530503026545976-2.png"
            />

            {/* Overlay with play button */}
            {showOverlay && !isPlaying && (
              <motion.div
                className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer"
                onClick={togglePlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, oklch(0.75 0.18 180), oklch(0.72 0.22 300))',
                    boxShadow: '0 0 40px oklch(0.75 0.18 180 / 0.4), 0 0 80px oklch(0.75 0.18 180 / 0.2)',
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-8 h-8 text-white ml-1" />
                </motion.div>
              </motion.div>
            )}

            {/* Controls bar */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <button onClick={togglePlay} className="p-2 text-white/90 hover:text-white transition-colors">
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <div className="flex items-center gap-2 text-white/70">
                <Volume2 className="w-4 h-4" />
              </div>
              <button onClick={toggleFullscreen} className="p-2 text-white/90 hover:text-white transition-colors">
                <Maximize className="w-4 h-4" />
              </button>
            </motion.div>

            {/* Corner decoration */}
            <div className="absolute top-3 left-3 glass rounded-lg px-3 py-1 text-xs text-[oklch(0.75_0.18_180)]">
              Mina Eureka Official
            </div>
          </div>
        </motion.div>

        {/* Video description */}
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-[oklch(0.65_0.02_280)] max-w-lg mx-auto">
            A visual journey through the sonic landscape of Mina Eureka.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
