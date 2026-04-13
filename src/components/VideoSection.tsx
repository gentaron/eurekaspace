'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, Maximize, ChevronLeft, ChevronRight,
  Flame, Lock, Wallet, CheckCircle, Loader2, ExternalLink,
  Sparkles, ShieldCheck,
} from 'lucide-react';
import { useMediaStore } from '@/lib/mediaStore';
import { usePrivy, useWallets } from '@privy-io/react-auth';

/* ------------------------------------------------------------------ */
/* Types & data                                                          */
/* ------------------------------------------------------------------ */

interface VideoItem {
  id: number;
  title: string;
  src: string;
  aspect: string;
}

const videos: VideoItem[] = [
  { id: 1, title: 'Mina Eureka — Official', src: '/video/grok-video-d6391748-c6e5-4dc4-a1ea-b444f6ab7e14.mp4', aspect: '9/16' },
  { id: 2, title: 'Imagine I',              src: '/video/imagine-94342c7b.mp4',          aspect: '9/16' },
  { id: 3, title: 'Imagine II',             src: '/video/imagine-385a857d.mp4',          aspect: '9/16' },
  { id: 4, title: 'Imagine III',            src: '/video/imagine-3ecabe2e.mp4',          aspect: '9/16' },
  { id: 5, title: 'Imagine IV',             src: '/video/imagine-b94ea831.mp4',          aspect: '9/16' },
];

/* ─── USDC contract (Base network) ─────────────────────────────────── */
const USDC_CONTRACT = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'; // USDC on Base
const PRICE_USDC    = 4;                                                // 4 USDC
const PRICE_WEI     = BigInt(4_000_000);                               // 4 USDC = 4e6 (6 decimals)
const RECIPIENT     = '0x94Ac0Cbf9188E31979Ad1434d86Cdc75ddBEc10c';   // USDC recipient on Base

/* ------------------------------------------------------------------ */
/* Individual video card (only shown after unlock)                       */
/* ------------------------------------------------------------------ */

function VideoCard({
  video, isActive, onActivate,
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
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setActiveSource(null);
    } else {
      onActivate();
      setActiveSource('video');
      setShowOverlay(false);
      videoRef.current.play().catch(() => setShowOverlay(true));
    }
  }, [isPlaying, onActivate, setActiveSource]);

  const toggleFullscreen = () => videoRef.current?.requestFullscreen?.();

  useEffect(() => {
    if ((activeSource === 'audio' || !isActive) && videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
    }
  }, [activeSource, isActive]);

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

        {showOverlay && !isPlaying && (
          <motion.div
            className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer"
            onClick={togglePlay}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
          >
            <motion.div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, oklch(0.70 0.25 350), oklch(0.65 0.22 320))',
                boxShadow: '0 0 30px oklch(0.70 0.25 350 / 0.4)',
              }}
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
            >
              <Play className="w-6 h-6 text-white ml-0.5" />
            </motion.div>
          </motion.div>
        )}

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button onClick={togglePlay} className="p-1.5 text-white/90 hover:text-white transition-colors">
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button onClick={toggleFullscreen} className="p-1.5 text-white/90 hover:text-white transition-colors">
            <Maximize className="w-4 h-4" />
          </button>
        </div>

        <div className="absolute top-2 left-2 glass rounded-lg px-2.5 py-1 text-[10px] text-[oklch(0.80_0.20_350)] font-medium">
          {video.title}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Paywall gate                                                           */
/* ------------------------------------------------------------------ */

type PaywallState = 'idle' | 'connecting' | 'paying' | 'verifying' | 'unlocked' | 'error';

function PaywallGate({ onUnlocked }: { onUnlocked: () => void }) {
  const { login, authenticated, ready } = usePrivy();
  const { wallets } = useWallets();
  const [state, setState] = useState<PaywallState>('idle');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState<string>('');

  /* Auto-advance when Privy finishes authenticating */
  useEffect(() => {
    if (authenticated && state === 'connecting') {
      setState('idle');
    }
  }, [authenticated, state]);

  const handleConnect = async () => {
    if (!authenticated) {
      setState('connecting');
      login();
    }
  };

  const handlePay = async () => {
    try {
      setState('paying');
      setErrMsg('');

      const wallet = wallets[0];
      if (!wallet) throw new Error('ウォレットが見つかりません');

      const provider = await wallet.getEthereumProvider();

      /* ERC-20 transfer calldata: transfer(address,uint256) */
      const iface_transfer =
        '0xa9059cbb' +  // transfer selector
        RECIPIENT.slice(2).padStart(64, '0') +
        PRICE_WEI.toString(16).padStart(64, '0');

      /* Switch to Base (chainId 8453) */
      try {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x2105' }],
        });
      } catch {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x2105',
            chainName: 'Base',
            nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
            rpcUrls: ['https://mainnet.base.org'],
            blockExplorerUrls: ['https://basescan.org'],
          }],
        });
      }

      const accounts: string[] = await provider.request({ method: 'eth_requestAccounts' });
      const from = accounts[0];

      const hash: string = await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from,
          to: USDC_CONTRACT,
          data: iface_transfer,
          gas: '0x186A0', // 100 000 gas
        }],
      });

      setTxHash(hash);
      setState('verifying');

      /* Poll for receipt */
      let receipt = null;
      for (let i = 0; i < 30; i++) {
        await new Promise((r) => setTimeout(r, 3000));
        receipt = await provider.request({
          method: 'eth_getTransactionReceipt',
          params: [hash],
        });
        if (receipt) break;
      }

      if (!receipt) throw new Error('トランザクションの確認がタイムアウトしました');
      setState('unlocked');
      onUnlocked();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'エラーが発生しました';
      setErrMsg(message);
      setState('error');
    }
  };

  if (!ready) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-[oklch(0.72_0.22_300)]" />
      </div>
    );
  }

  return (
    <motion.div
      className="relative mx-auto max-w-md"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Card */}
      <div
        className="glass rounded-3xl p-8 text-center relative overflow-hidden"
        style={{ boxShadow: '0 0 60px oklch(0.70 0.25 350 / 0.15), 0 0 120px oklch(0.65 0.22 320 / 0.08)' }}
      >
        {/* Background glow */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ background: 'radial-gradient(circle at 50% 30%, oklch(0.70 0.25 350), transparent 70%)' }}
        />

        {/* Lock icon */}
        <motion.div
          className="relative mx-auto w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
          style={{ background: 'linear-gradient(135deg, oklch(0.70 0.25 350 / 0.2), oklch(0.65 0.22 320 / 0.2))' }}
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Lock className="w-9 h-9 text-[oklch(0.70_0.25_350)]" />
          <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-[oklch(0.80_0.15_320)]" />
        </motion.div>

        <h3 className="text-2xl font-bold mb-2">
          <span className="bg-gradient-to-r from-[oklch(0.80_0.15_320)] to-[oklch(0.70_0.25_350)] bg-clip-text text-transparent">
            セクシー・ブロック
          </span>
          {' '}解放
        </h3>
        <p className="text-sm text-[oklch(0.55_0.02_280)] mb-6 leading-relaxed">
          このビデオコレクションは ETH ウォレットでロックされています。<br />
          <strong className="text-[oklch(0.70_0.15_280)]">4 USDC（Base チェーン）</strong>で全5本を解放。
        </p>

        {/* Price badge */}
        <div
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-8 text-sm font-bold"
          style={{ background: 'linear-gradient(135deg, oklch(0.70 0.25 350 / 0.15), oklch(0.65 0.22 320 / 0.15))', border: '1px solid oklch(0.70 0.25 350 / 0.3)' }}
        >
          <ShieldCheck className="w-4 h-4 text-[oklch(0.70_0.25_350)]" />
          <span className="text-[oklch(0.80_0.20_350)]">{PRICE_USDC} USDC</span>
          <span className="text-[oklch(0.50_0.02_280)]">on Base</span>
        </div>

        {/* Action buttons */}
        <AnimatePresence mode="wait">
          {!authenticated ? (
            <motion.button
              key="connect"
              id="paywall-connect-wallet"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-white transition-all"
              style={{ background: 'linear-gradient(135deg, oklch(0.72 0.22 300), oklch(0.70 0.25 350))' }}
              onClick={handleConnect}
              whileHover={{ scale: 1.02, boxShadow: '0 0 30px oklch(0.72 0.22 300 / 0.4)' }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
              {state === 'connecting' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Wallet className="w-4 h-4" />
              )}
              {state === 'connecting' ? '接続中...' : 'ウォレットを接続'}
            </motion.button>
          ) : (
            <motion.button
              key="pay"
              id="paywall-pay-usdc"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: state === 'error' ? 'oklch(0.50 0.20 20)' : 'linear-gradient(135deg, oklch(0.70 0.25 350), oklch(0.65 0.22 320))' }}
              onClick={handlePay}
              disabled={state === 'paying' || state === 'verifying' || state === 'unlocked'}
              whileHover={state === 'idle' || state === 'error' ? { scale: 1.02, boxShadow: '0 0 30px oklch(0.70 0.25 350 / 0.4)' } : {}}
              whileTap={state === 'idle' || state === 'error' ? { scale: 0.98 } : {}}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
              {state === 'paying' ? <><Loader2 className="w-4 h-4 animate-spin" /> 送金中...</>
                : state === 'verifying' ? <><Loader2 className="w-4 h-4 animate-spin" /> 確認中...</>
                : state === 'unlocked' ? <><CheckCircle className="w-4 h-4" /> 解放済み！</>
                : state === 'error' ? '再試行する'
                : <><Lock className="w-4 h-4" /> {PRICE_USDC} USDC で解放する</>}
            </motion.button>
          )}
        </AnimatePresence>

        {/* Wallet info + tx link */}
        {authenticated && wallets[0] && state !== 'unlocked' && (
          <p className="text-xs text-[oklch(0.45_0.02_280)] mt-3">
            接続済: {wallets[0].address.slice(0, 6)}...{wallets[0].address.slice(-4)}
          </p>
        )}

        {txHash && (
          <a
            href={`https://basescan.org/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-[oklch(0.70_0.25_350)] hover:text-[oklch(0.80_0.20_350)] mt-2 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            Basescan で確認
          </a>
        )}

        {/* Error message */}
        {state === 'error' && errMsg && (
          <motion.p
            className="text-xs text-[oklch(0.65_0.20_20)] mt-3 px-2"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          >
            {errMsg}
          </motion.p>
        )}

        {/* Features list */}
        <div className="mt-8 pt-6 border-t border-[oklch(0.20_0.03_280)] text-left space-y-2">
          {[
            '全5本の映像コンテンツを即時解放',
            '全端末でフルスクリーン対応',
            '支払いはオンチェーンで永続記録',
          ].map((item) => (
            <div key={item} className="flex items-center gap-2 text-xs text-[oklch(0.50_0.02_280)]">
              <CheckCircle className="w-3.5 h-3.5 text-[oklch(0.70_0.25_350)] shrink-0" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Main section                                                          */
/* ------------------------------------------------------------------ */

export default function VideoSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeVideoId, setActiveVideoId] = useState<number | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [unlocked, setUnlocked] = useState(false);

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
      scrollRef.current.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
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
          <p className="text-sm text-[oklch(0.50_0.02_280)] mt-2">
            {unlocked ? `${videos.length} videos unlocked ✓` : '4 USDC でアンロック'}
          </p>
        </motion.div>

        {/* Gate or content */}
        <AnimatePresence mode="wait">
          {!unlocked ? (
            <motion.div key="gate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
              <PaywallGate onUnlocked={() => setUnlocked(true)} />
            </motion.div>
          ) : (
            <motion.div
              key="videos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Unlocked badge */}
              <div className="flex justify-center mb-8">
                <div
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium"
                  style={{ background: 'oklch(0.70 0.25 350 / 0.12)', border: '1px solid oklch(0.70 0.25 350 / 0.3)' }}
                >
                  <CheckCircle className="w-4 h-4 text-[oklch(0.70_0.25_350)]" />
                  <span className="text-[oklch(0.70_0.25_350)]">アンロック済み — 全動画視聴可能</span>
                </div>
              </div>

              {/* Video carousel */}
              <div className="relative">
                <AnimatePresence>
                  {canScrollLeft && (
                    <motion.button
                      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-20 w-10 h-10 rounded-full glass flex items-center justify-center hover:scale-110 transition-transform"
                      onClick={() => scroll('left')}
                      initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </motion.button>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {canScrollRight && (
                    <motion.button
                      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-20 w-10 h-10 rounded-full glass flex items-center justify-center hover:scale-110 transition-transform"
                      onClick={() => scroll('right')}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </motion.button>
                  )}
                </AnimatePresence>

                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[oklch(0.07_0.02_280)] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[oklch(0.07_0.02_280)] to-transparent z-10 pointer-events-none" />

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
                      animate={{ opacity: 1, y: 0 }}
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
            </motion.div>
          )}
        </AnimatePresence>

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
