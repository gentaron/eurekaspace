'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Volume1,
  Repeat, Shuffle, Music2, Clock, Hash
} from 'lucide-react';
import { useMediaStore } from '@/lib/mediaStore';

interface Track {
  id: number;
  title: string;
  artist: string;
  file: string;
  album?: string;
}

const tracks: Track[] = [
  // — Original Tracks —
  { id: 1, title: 'Big Mac Order', artist: 'feat. Mina Eureka', file: '/music/Big Mac Order - feat. Mina Eureka.mp3', album: 'Singles' },
  { id: 2, title: "Everything's Fine", artist: 'Eureka Ver.', file: "/music/Everything's Fine - Eureka Ver.mp3", album: 'Singles' },
  { id: 3, title: 'Overslept, wavefunction collapsed', artist: 'Mina Eureka', file: '/music/Overslept, wavefunction collapsed.mp3', album: 'Quantum Sessions' },
  { id: 4, title: '405 (OpenClaw Troubles)', artist: 'Mina Eureka', file: '/music/405 (OpenClaw Troubles).mp3', album: 'Singles' },
  { id: 5, title: 'Still UPDATING', artist: 'Cov. Mina Eureka', file: '/music/Still UPDATING - Cov. Mina Eureka.mp3', album: 'Covers' },
  { id: 6, title: 'Gravitational waves', artist: 'covering Mina Eureka', file: '/music/Gravitational waves - covering Mina Eureka.mp3', album: 'Covers' },
  { id: 7, title: 'BONES', artist: 'feat. Mina Eureka', file: '/music/BONES - feat. Mina Eureka.mp3', album: 'Singles' },
  { id: 8, title: 'Just Sen MEE', artist: 'Mina Eureka', file: '/music/Just Sen MEE.mp3', album: 'Singles' },
  // — New Tracks —
  { id: 9, title: 'Starlight', artist: 'Mina Eureka', file: '/music/Starlight.mp3', album: 'Gigapolis Heart' },
  { id: 10, title: 'ミナ・エウレカ・エルンスト', artist: 'Mina Eureka', file: '/music/ミナ・エウレカ・エルンスト.mp3', album: 'Gigapolis Heart' },
  { id: 11, title: 'In the Light You Left Behind', artist: 'Mina Eureka', file: '/music/In the Light You Left Behind.mp3', album: 'Paradox Glow' },
  { id: 12, title: 'Wonderful String Theory', artist: 'Mina Eureka', file: '/music/Wonderful String Theory.mp3', album: 'Quantum Sessions' },
  { id: 13, title: 'Heterotic Dimensional Incident', artist: 'Mina Eureka', file: '/music/Heterotic Dimensional Incident.mp3', album: 'Quantum Sessions' },
  { id: 14, title: 'Darkest Graph', artist: 'Mina Eureka', file: '/music/Darkest Graph.mp3', album: 'Paradox Glow' },
  { id: 15, title: 'BITCOIN STANDARD', artist: 'Mina Eureka', file: '/music/BITCOIN STANDARD.mp3', album: 'XEMS' },
  { id: 16, title: 'Gigapolis Heart', artist: 'Mina Eureka', file: '/music/Gigapolis Heart.mp3', album: 'Gigapolis Heart' },
  { id: 17, title: 'Perth Sunrise', artist: 'Mina Eureka', file: '/music/Perth Sunrise.mp3', album: 'Gigapolis Heart' },
  { id: 18, title: 'Paradox Glow', artist: 'Mina Eureka', file: '/music/Paradox Glow.mp3', album: 'Paradox Glow' },
  { id: 19, title: 'Wired Horizon', artist: 'Mina Eureka', file: '/music/Wired Horizon.mp3', album: 'XEMS' },
  { id: 20, title: 'XEMS', artist: 'Mina Eureka', file: '/music/XEMS.mp3', album: 'XEMS' },
  { id: 21, title: 'Trenchcourt', artist: 'Mina Eureka', file: '/music/Trenchcourt.mp3', album: 'XEMS' },
  { id: 22, title: 'Paradox Glow (Remastered)', artist: 'Mina Eureka', file: '/music/Paradox Glow (Remastered).mp3', album: 'Paradox Glow' },
  { id: 23, title: 'Equator of Memory', artist: 'Mina Eureka', file: '/music/Equator of Memory.mp3', album: 'Gigapolis Heart' },
  { id: 24, title: 'Encrypted Heart', artist: 'Mina Eureka', file: '/music/Encrypted Heart.mp3', album: 'Paradox Glow' },
  { id: 25, title: 'Ephemeral War of Hearts', artist: 'Mina Eureka', file: '/music/Ephemeral War of Hearts.mp3', album: 'Paradox Glow' },
];

// Generate a deterministic gradient for each track based on its id
function getTrackGradient(id: number): string {
  const hues = [300, 180, 250, 320, 270, 200, 340, 220, 160, 290];
  const h1 = hues[id % hues.length];
  const h2 = hues[(id + 3) % hues.length];
  return `linear-gradient(135deg, oklch(0.55 0.20 ${h1}), oklch(0.45 0.18 ${h2}))`;
}

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
  const [hoveredTrack, setHoveredTrack] = useState<number | null>(null);
  const [trackDurations, setTrackDurations] = useState<Record<number, number>>({});
  const [seekHover, setSeekHover] = useState(false);

  const { activeSource, setActiveSource } = useMediaStore();

  const playTrack = useCallback((track: Track) => {
    setCurrentTrack(track);
    setActiveSource('audio');
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().catch(() => {});
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
        audioRef.current.play().catch(() => {});
      }
    }
  };

  const nextTrack = useCallback(() => {
    let nextIndex: number;
    if (shuffle) {
      do {
        nextIndex = Math.floor(Math.random() * tracks.length);
      } while (nextIndex === tracks.indexOf(currentTrack) && tracks.length > 1);
    } else {
      nextIndex = (tracks.indexOf(currentTrack) + 1) % tracks.length;
    }
    playTrack(tracks[nextIndex]);
  }, [shuffle, currentTrack, playTrack]);

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
      setTrackDurations(prev => ({ ...prev, [currentTrack.id]: audioRef.current!.duration }));
    }
  };

  const handleEnded = () => {
    if (repeat) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    } else {
      nextTrack();
    }
  };

  useEffect(() => {
    if (activeSource === 'video' && audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
    }
  }, [activeSource]);

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const time = percent * duration;
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

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setActiveSource(null);
    };
  }, [setActiveSource]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <section className="relative py-20 px-4 sm:px-6" id="tracks">
      {/* Background accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-8 blur-[120px]"
          style={{ background: 'linear-gradient(180deg, oklch(0.72 0.22 300), transparent)' }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Section header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-mono tracking-[0.3em] uppercase text-[oklch(0.72_0.22_300)]">
            Discography
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-2 bg-gradient-to-r from-foreground via-[oklch(0.80_0.15_320)] to-[oklch(0.75_0.18_180)] bg-clip-text text-transparent">
            Tracks
          </h2>
          <p className="text-sm text-[oklch(0.55_0.02_280)] mt-2">{tracks.length} songs</p>
        </motion.div>

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

        {/* Spotify-style track table */}
        <motion.div
          className="glass rounded-xl overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Table header */}
          <div className="grid grid-cols-[40px_1fr_1fr_60px] sm:grid-cols-[48px_1fr_1fr_80px] items-center px-4 sm:px-6 py-3 border-b border-[oklch(0.25_0.03_280)] text-xs text-[oklch(0.45_0.02_280)] font-medium uppercase tracking-wider">
            <div className="text-center">
              <Hash className="w-3 h-3 mx-auto" />
            </div>
            <div>Title</div>
            <div className="hidden sm:block">Album</div>
            <div className="text-right">
              <Clock className="w-3 h-3 ml-auto" />
            </div>
          </div>

          {/* Track rows */}
          <div className="max-h-[520px] overflow-y-auto spotify-scrollbar">
            {tracks.map((track, index) => {
              const isActive = currentTrack.id === track.id;
              const isHovered = hoveredTrack === track.id;
              return (
                <motion.button
                  key={track.id}
                  className={`w-full grid grid-cols-[40px_1fr_1fr_60px] sm:grid-cols-[48px_1fr_1fr_80px] items-center px-4 sm:px-6 py-2.5 text-left transition-all duration-150 group ${
                    isActive
                      ? 'bg-[oklch(0.72_0.22_300/0.08)]'
                      : 'hover:bg-[oklch(0.20_0.03_280/0.5)]'
                  }`}
                  onClick={() => {
                    if (isActive && isPlaying) {
                      togglePlay();
                    } else if (isActive) {
                      togglePlay();
                    } else {
                      playTrack(track);
                    }
                  }}
                  onMouseEnter={() => setHoveredTrack(track.id)}
                  onMouseLeave={() => setHoveredTrack(null)}
                  whileTap={{ scale: 0.995 }}
                >
                  {/* Number / Play indicator */}
                  <div className="flex items-center justify-center w-8">
                    {isActive && isPlaying ? (
                      isHovered ? (
                        <Pause className="w-3.5 h-3.5 text-[oklch(0.72_0.22_300)]" />
                      ) : (
                        <div className="flex items-end justify-center gap-[2px] h-4">
                          {[0, 1, 2].map((bar) => (
                            <motion.div
                              key={bar}
                              className="w-[2.5px] rounded-full bg-[oklch(0.72_0.22_300)]"
                              animate={{ height: ['3px', '12px', '3px'] }}
                              transition={{ duration: 0.5, repeat: Infinity, delay: bar * 0.12 }}
                            />
                          ))}
                        </div>
                      )
                    ) : isHovered ? (
                      <Play className="w-3.5 h-3.5 text-foreground" />
                    ) : (
                      <span className={`text-sm tabular-nums ${isActive ? 'text-[oklch(0.72_0.22_300)]' : 'text-[oklch(0.45_0.02_280)]'}`}>
                        {index + 1}
                      </span>
                    )}
                  </div>

                  {/* Title + Artist */}
                  <div className="flex items-center gap-3 min-w-0 pr-3">
                    {/* Mini album art */}
                    <div
                      className="w-10 h-10 rounded flex-shrink-0 flex items-center justify-center"
                      style={{ background: getTrackGradient(track.id) }}
                    >
                      <Music2 className="w-4 h-4 text-white/70" />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-sm font-medium truncate ${isActive ? 'text-[oklch(0.72_0.22_300)]' : 'text-foreground'}`}>
                        {track.title}
                      </p>
                      <p className="text-xs text-[oklch(0.50_0.02_280)] truncate">
                        {track.artist}
                      </p>
                    </div>
                  </div>

                  {/* Album */}
                  <div className="hidden sm:block">
                    <p className="text-xs text-[oklch(0.45_0.02_280)] truncate hover:text-foreground transition-colors">
                      {track.album}
                    </p>
                  </div>

                  {/* Duration */}
                  <div className="text-right">
                    <span className="text-xs tabular-nums text-[oklch(0.45_0.02_280)]">
                      {trackDurations[track.id] ? formatTime(trackDurations[track.id]) : '—'}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Sticky bottom player bar */}
        <motion.div
          className="sticky bottom-4 mt-6 glass rounded-2xl px-4 sm:px-6 py-4 glow-purple"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center gap-4">
            {/* Now playing info */}
            <div className="flex items-center gap-3 min-w-0 w-1/4 sm:w-1/3">
              <motion.div
                className="w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden"
                style={{ background: getTrackGradient(currentTrack.id) }}
                animate={{ scale: isPlaying ? [1, 1.03, 1] : 1 }}
                transition={{ duration: 2, repeat: isPlaying ? Infinity : 0 }}
              >
                <Music2 className="w-5 h-5 text-white/70" />
              </motion.div>
              <div className="min-w-0 hidden sm:block">
                <p className="text-sm font-medium truncate text-foreground">{currentTrack.title}</p>
                <p className="text-xs text-[oklch(0.50_0.02_280)] truncate">{currentTrack.artist}</p>
              </div>
            </div>

            {/* Center controls + progress */}
            <div className="flex-1 flex flex-col items-center gap-1.5 max-w-xl">
              {/* Playback controls */}
              <div className="flex items-center gap-3 sm:gap-5">
                <button
                  onClick={() => setShuffle(!shuffle)}
                  className={`p-1 transition-all hidden sm:block ${shuffle ? 'text-[oklch(0.72_0.22_300)]' : 'text-[oklch(0.45_0.02_280)] hover:text-foreground'}`}
                >
                  <Shuffle className="w-3.5 h-3.5" />
                </button>
                <button onClick={prevTrack} className="p-1 text-[oklch(0.60_0.02_280)] hover:text-foreground transition-colors">
                  <SkipBack className="w-4 h-4" />
                </button>
                <button
                  onClick={togglePlay}
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-foreground text-background hover:scale-105 active:scale-95 transition-transform"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4 ml-0.5" />
                  )}
                </button>
                <button onClick={nextTrack} className="p-1 text-[oklch(0.60_0.02_280)] hover:text-foreground transition-colors">
                  <SkipForward className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setRepeat(!repeat)}
                  className={`p-1 transition-all hidden sm:block ${repeat ? 'text-[oklch(0.75_0.18_180)]' : 'text-[oklch(0.45_0.02_280)] hover:text-foreground'}`}
                >
                  <Repeat className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Progress bar */}
              <div className="w-full flex items-center gap-2">
                <span className="text-[10px] tabular-nums text-[oklch(0.45_0.02_280)] w-8 text-right">{formatTime(currentTime)}</span>
                <div
                  className="flex-1 h-1 rounded-full bg-[oklch(0.22_0.02_280)] cursor-pointer group/bar relative"
                  onClick={seek}
                  onMouseEnter={() => setSeekHover(true)}
                  onMouseLeave={() => setSeekHover(false)}
                >
                  <div
                    className="h-full rounded-full transition-colors"
                    style={{
                      width: `${progress}%`,
                      background: seekHover
                        ? 'oklch(0.72 0.22 300)'
                        : 'oklch(0.90 0.01 280)',
                    }}
                  />
                  {/* Seek dot */}
                  <AnimatePresence>
                    {seekHover && (
                      <motion.div
                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-foreground"
                        style={{ left: `calc(${progress}% - 6px)` }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      />
                    )}
                  </AnimatePresence>
                </div>
                <span className="text-[10px] tabular-nums text-[oklch(0.45_0.02_280)] w-8">{formatTime(duration)}</span>
              </div>
            </div>

            {/* Volume */}
            <div className="hidden sm:flex items-center gap-2 w-1/4 justify-end">
              <button onClick={toggleMute} className="text-[oklch(0.45_0.02_280)] hover:text-foreground transition-colors">
                <VolumeIcon className="w-4 h-4" />
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={changeVolume}
                className="w-20 h-1 bg-[oklch(0.22_0.02_280)] rounded-full appearance-none cursor-pointer volume-slider"
                style={{
                  background: `linear-gradient(to right, oklch(0.90 0.01 280) ${(isMuted ? 0 : volume) * 100}%, oklch(0.22 0.02 280) ${(isMuted ? 0 : volume) * 100}%)`,
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
