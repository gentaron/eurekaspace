"use client"
import { useEffect, useState } from "react"
import { getAllAssets } from "@/lib/market-data"

const ACCENT = "#14b8a6"

export function MarketTicker() {
  const [assets, setAssets] = useState<ReturnType<typeof getAllAssets>>([])

  useEffect(() => {
    setAssets(getAllAssets())
  }, [])

  if (assets.length === 0) return null

  return (
    <div className="w-full overflow-hidden" style={{ background: "rgba(0,0,0,0.7)", borderTop: `1px solid ${ACCENT}33`, borderBottom: `1px solid ${ACCENT}33` }}>
      <div className="flex items-center h-8">
        <div className="shrink-0 px-3 text-[11px] font-bold tracking-wider" style={{ color: ACCENT }}>
          E16 MARKET
        </div>
        <div className="relative flex-1 overflow-hidden">
          <div className="flex items-center gap-6 animate-ticker-scroll" style={{ width: "max-content" }}>
            {[...assets, ...assets].map((a, i) => (
              <div key={`${a.symbol}-${i}`} className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-semibold" style={{ color: ACCENT }}>{a.symbol}</span>
                <span className="text-[11px] text-gray-300">{a.currentPrice.toLocaleString()}n</span>
                <span className={`text-[11px] font-medium ${a.changePercent24h >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {a.changePercent24h >= 0 ? "+" : ""}{a.changePercent24h.toFixed(1)}%
                </span>
                <svg width="40" height="16" viewBox="0 0 40 16">
                  <polyline
                    fill="none"
                    stroke={a.changePercent24h >= 0 ? "#34d399" : "#f87171"}
                    strokeWidth="1.2"
                    points={a.prices.slice(-20).map((p, j) => `${j * 2},${16 - ((p.close - Math.min(...a.prices.slice(-20).map(x => x.close))) / (Math.max(...a.prices.slice(-20).map(x => x.close)) - Math.min(...a.prices.slice(-20).map(x => x.close)) + 1)) * 14)}`).join(" ")}
                  />
                </svg>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker-scroll {
          animation: ticker-scroll 60s linear infinite;
        }
        .animate-ticker-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}
