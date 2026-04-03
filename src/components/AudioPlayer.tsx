'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Repeat, Shuffle, ListMusic, ChevronDown
} from 'lucide-react';
import { useMediaStore } from '@/lib/mediaStore';

interface Track {
  id: number;
  title: string;
  artist: string;
  file: string;
  duration?: string;
}

const tracks: Track[] = [
  { id: 1, title: 'Big Mac Order', artist: 'feat. Mina Eureka', file: '/music/Big Mac Order - feat. Mina Eureka.mp3' },
  { id: 2, title: "Everything's Fine", artist: 'Eureka Ver.', file: "/music/Everything's Fine - Eureka Ver.mp3" },
  { id: 3, title: 'Overslept, wavefunction collapsed', artist: 'Mina Eureka', file: '/music/Overslept, wavefunction collapsed.mp3' },
  { id: 4, title: '405 (OpenClaw Troubles)', artist: 'Mina Eureka', file: '/music/405 (OpenClaw Troubles).mp3' },
  { id: 5, title: 'Still UPDATING', artist: 'Cov. Mina Eureka', file: '/music/Still UPDATING - Cov. Mina Eureka.mp3' },
  { id: 6, title: 'Gravitational waves', artist: 'covering Mina Eureka', file: '/music/Gravitational waves - covering Mina Eureka.mp3' },
  { id: 7, title: 'BONES', artist: 'feat. Mina Eureka', file: '/music/BONES - feat. Mina Eureka.mp3' },
  { id: 8, title: 'Just Sen MEE', artist: 'Mina Eureka', file: '/music/Just Sen MEE.mp3' },
];

function formatTime(seconds: number): string {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTrack, setCurrentTrack] = useState<Track>(tracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [showTrackList, setShowTrackList] = useState(false);
  const [visualizerData, setVisualizerData] = useState<number[]>(Array(32).fill(0));
  const [hoveredTrack, setHoveredTrack] = useState<number | null>(null);

  const { activeSource, setActiveSource } = useMediaStore();

  const playTrack = useCallback((track: Track) => {
    setCurrentTrack(track);
    setActiveSource('audio');
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().catch(() => {
          /* play() rejected — onPlay won't fire, isPlaying stays false */
        });
      }
    }, 100);
  }, [setActiveSource]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setActiveSource(null);
      } else {
        setActiveSource('audio');
        audioRef.current.play().catch(() => {
          /* play() rejected */
        });
      }
    }
  };

  const nextTrack = () => {
    let nextIndex: number;
    if (shuffle) {
      do {
        nextIndex = Math.floor(Math.random() * tracks.length);
      } while (nextIndex === tracks.indexOf(currentTrack) && tracks.length > 1);
    } else {
      nextIndex = (tracks.indexOf(currentTrack) + 1) % tracks.length;
    }
    playTrack(tracks[nextIndex]);
  };

  const prevTrack = () => {
    if (currentTime > 3) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
      return;
    }
    let prevIndex: number;
    if (shuffle) {
      do {
        prevIndex = Math.floor(Math.random() * tracks.length);
      } while (prevIndex === tracks.indexOf(currentTrack) && tracks.length > 1);
    } else {
      prevIndex = (tracks.indexOf(currentTrack) - 1 + tracks.length) % tracks.length;
    }
    playTrack(tracks[prevIndex]);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    if (repeat) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {
          /* play() rejected */
        });
      }
    } else {
      nextTrack();
    }
  };

  // Auto-pause audio when video takes over
  useEffect(() => {
    if (activeSource === 'video' && audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
    }
  }, [activeSource]);

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
    setIsMuted(vol === 0);
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (audioRef.current) {
      audioRef.current.muted = newMuted;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setActiveSource(null);
    };
  }, [setActiveSource]);

  // Simulated visualizer
  useEffect(() => {
    let animationId: number;
    const generateVisualizerData = () => {
      setVisualizerData((prev) => {
        if (!isPlaying) {
          return prev.map((v) => Math.max(0, v * 0.92));
        }
        return prev.map((_, i) => {
          const base = Math.sin(Date.now() / (200 + i * 15)) * 0.3 + 0.5;
          const noise = Math.random() * 0.5;
          return Math.min(1, Math.max(0, base + noise));
        });
      });
      animationId = requestAnimationFrame(generateVisualizerData);
    };
    generateVisualizerData();
    return () => cancelAnimationFrame(animationId);
  }, [isPlaying]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <section className="relative py-20 px-6" id="tracks">
      {/* Background accent */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-10 blur-[120px]"
          style={{ background: 'linear-gradient(180deg, oklch(0.72 0.22 300), transparent)' }}
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
          <span className="text-sm font-mono tracking-[0.3em] uppercase text-[oklch(0.72_0.22_300)]">
            Discography
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-3 bg-gradient-to-r from-foreground via-[oklch(0.80_0.15_320)] to-[oklch(0.75_0.18_180)] bg-clip-text text-transparent">
            Tracks
          </h2>
        </motion.div>

        {/* Visualizer */}
        <motion.div
          className="flex items-end justify-center gap-[2px] h-16 mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {visualizerData.map((value, i) => (
            <motion.div
              key={i}
              className="w-[3px] sm:w-[4px] rounded-full"
              style={{
                height: `${Math.max(4, value * 64)}px`,
                background: `linear-gradient(to top, oklch(0.72 0.22 300), oklch(0.75 0.18 180))`,
                opacity: 0.4 + value * 0.6,
              }}
              transition={{ duration: 0.1 }}
            />
          ))}
        </motion.div>

        {/* Main player card */}
        <motion.div
          className="glass rounded-2xl p-6 sm:p-8 glow-purple"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <audio
            ref={audioRef}
            src={currentTrack.file}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleEnded}
            onPause={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
            preload="metadata"
          />

          {/* Now playing info */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4 min-w-0">
              <motion.div
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden flex-shrink-0 border border-[oklch(0.30_0.04_300/0.3)]"
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ duration: 8, repeat: isPlaying ? Infinity : 0, ease: 'linear' }}
              >
                <div className="w-full h-full bg-gradient-to-br from-[oklch(0.72_0.22_300)] via-[oklch(0.80_0.15_320)] to-[oklch(0.75_0.18_180)] flex items-center justify-center">
                  <ListMusic className="w-6 h-6 text-white/80" />
                </div>
              </motion.div>
              <div className="min-w-0">
                <h3 className="font-bold text-lg truncate">{currentTrack.title}</h3>
                <p className="text-sm text-[oklch(0.65_0.02_280)] truncate">{currentTrack.artist}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShuffle(!shuffle)}
                className={`p-2 rounded-lg transition-all ${shuffle ? 'text-[oklch(0.72_0.22_300)] bg-[oklch(0.72_0.22_300/0.1)]' : 'text-[oklch(0.55_0.02_280)] hover:text-foreground'}`}
                title="Shuffle"
              >
                <Shuffle className="w-4 h-4" />
              </button>
              <button
                onClick={() => setRepeat(!repeat)}
                className={`p-2 rounded-lg transition-all ${repeat ? 'text-[oklch(0.75_0.18_180)] bg-[oklch(0.75_0.18_180/0.1)]' : 'text-[oklch(0.55_0.02_280)] hover:text-foreground'}`}
                title="Repeat"
              >
                <Repeat className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={seek}
              className="w-full h-1 bg-[oklch(0.25_0.03_280)] rounded-full appearance-none cursor-pointer audio-progress"
              style={{
                background: `linear-gradient(to right, oklch(0.72 0.22 300) ${progress}%, oklch(0.25 0.03 280) ${progress}%)`,
              }}
            />
            <div className="flex justify-between mt-2 text-xs text-[oklch(0.55_0.02_280)]">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 mb-6">
            <button onClick={prevTrack} className="p-2 text-[oklch(0.65_0.02_280)] hover:text-foreground transition-colors">
              <SkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={togglePlay}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, oklch(0.72 0.22 300), oklch(0.75 0.18 180))',
                boxShadow: isPlaying
                  ? '0 0 30px oklch(0.72 0.22 300 / 0.4), 0 0 60px oklch(0.72 0.22 300 / 0.2)'
                  : '0 0 15px oklch(0.72 0.22 300 / 0.2)',
              }}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white ml-1" />
              )}
            </button>
            <button onClick={nextTrack} className="p-2 text-[oklch(0.65_0.02_280)] hover:text-foreground transition-colors">
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-3">
            <button onClick={toggleMute} className="text-[oklch(0.55_0.02_280)] hover:text-foreground transition-colors">
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={changeVolume}
              className="flex-1 h-1 bg-[oklch(0.25_0.03_280)] rounded-full appearance-none cursor-pointer audio-progress"
              style={{
                background: `linear-gradient(to right, oklch(0.75 0.18 180) ${(isMuted ? 0 : volume) * 100}%, oklch(0.25 0.03 280) ${(isMuted ? 0 : volume) * 100}%)`,
              }}
            />
          </div>

          {/* Toggle tracklist */}
          <button
            onClick={() => setShowTrackList(!showTrackList)}
            className="w-full mt-6 flex items-center justify-center gap-2 text-sm text-[oklch(0.55_0.02_280)] hover:text-[oklch(0.72_0.22_300)] transition-colors"
          >
            <span>{showTrackList ? 'Hide' : 'Show'} Tracklist</span>
            <motion.div animate={{ rotate: showTrackList ? 180 : 0 }}>
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </button>
        </motion.div>

        {/* Track list */}
        <AnimatePresence>
          {showTrackList && (
            <motion.div
              className="glass rounded-2xl mt-4 overflow-hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="divide-y divide-[oklch(0.25_0.03_280)]">
                {tracks.map((track, index) => {
                  const isActive = currentTrack.id === track.id;
                  return (
                    <motion.button
                      key={track.id}
                      className={`w-full flex items-center gap-4 px-6 py-4 text-left transition-all duration-200 ${
                        isActive
                          ? 'bg-[oklch(0.72_0.22_300/0.1)]'
                          : 'hover:bg-[oklch(0.18_0.03_280)]'
                      }`}
                      onClick={() => playTrack(track)}
                      onMouseEnter={() => setHoveredTrack(track.id)}
                      onMouseLeave={() => setHoveredTrack(null)}
                      whileTap={{ scale: 0.99 }}
                    >
                      {/* Track number / playing indicator */}
                      <div className="w-8 text-center flex-shrink-0">
                        {isActive && isPlaying ? (
                          <div className="flex items-end justify-center gap-[2px] h-4">
                            {[0, 1, 2].map((bar) => (
                              <motion.div
                                key={bar}
                                className="w-[3px] rounded-full bg-[oklch(0.72_0.22_300)]"
                                animate={{
                                  height: ['4px', '12px', '4px'],
                                }}
                                transition={{
                                  duration: 0.6,
                                  repeat: Infinity,
                                  delay: bar * 0.15,
                                }}
                              />
                            ))}
                          </div>
                        ) : (
                          <span className={`text-sm ${isActive ? 'text-[oklch(0.72_0.22_300)]' : 'text-[oklch(0.55_0.02_280)]'}`}>
                            {hoveredTrack === track.id && !isActive ? (
                              <Play className="w-3.5 h-3.5 mx-auto" />
                            ) : (
                              String(index + 1).padStart(2, '0')
                            )}
                          </span>
                        )}
                      </div>

                      {/* Track info */}
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium truncate ${isActive ? 'text-[oklch(0.72_0.22_300)]' : ''}`}>
                          {track.title}
                        </p>
                        <p className="text-xs text-[oklch(0.55_0.02_280)] truncate">
                          {track.artist}
                        </p>
                      </div>

                      {/* Active indicator */}
                      {isActive && (
                        <div className="w-2 h-2 rounded-full bg-[oklch(0.72_0.22_300)] animate-pulse" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
