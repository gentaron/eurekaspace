/* ─── Seeded RNG (Mulberry32) ─── */
function mulberry32(seed: number): () => number {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0
  }
  return hash
}

export interface AssetPrice {
  date: string
  close: number
  changePercent: number
}

export interface Asset {
  symbol: string
  name: string
  nameEn: string
  type: "stock" | "index" | "crypto"
  prices: AssetPrice[]
  currentPrice: number
  change24h: number
  changePercent24h: number
}

const ASSET_DEFS = [
  { symbol: "FARUJA", name: "ファールージャ社", nameEn: "Faruja Corp", type: "stock" as const, base: 12450 },
  { symbol: "UECO", name: "UECO", nameEn: "UECO", type: "index" as const, base: 3500 },
  { symbol: "AURAL", name: "AURALIS指数", nameEn: "AURALIS Index", type: "index" as const, base: 2800 },
  { symbol: "GRANDEL", name: "グランベル", nameEn: "Grandel", type: "index" as const, base: 15000 },
  { symbol: "ELYSEON", name: "エレシオン", nameEn: "Elyseon", type: "index" as const, base: 9500 },
  { symbol: "TYERIA", name: "ティエリア", nameEn: "Tyeria", type: "index" as const, base: 11200 },
  { symbol: "FALLUJA", name: "ファルージャ", nameEn: "Fallujah", type: "index" as const, base: 7800 },
  { symbol: "DIOCLE", name: "ディオクレニス", nameEn: "Dioclenis", type: "index" as const, base: 8400 },
  { symbol: "ACARL", name: "アルゼン・カーリーン", nameEn: "Arzen Carleen", type: "crypto" as const, base: 1500000 },
  { symbol: "MGABR", name: "ミカエル・ガブリエリ", nameEn: "Mikael Gabrieli", type: "crypto" as const, base: 850000 },
  { symbol: "IZUMI", name: "イズミ", nameEn: "Izumi", type: "crypto" as const, base: 95000 },
  { symbol: "LAYLA", name: "レイラ", nameEn: "Layla Virel Nova", type: "crypto" as const, base: 120000 },
]

const NARRATIVE_EVENTS: Record<string, Record<number, number>> = {
  FARUJA: { 60: 0.08, 45: 0.12, 30: -0.05, 15: 0.06, 5: 0.10 },
  GRANDEL: { 60: 0.03, 30: 0.05, 10: -0.02 },
  TYERIA: { 50: 0.04, 25: 0.07, 12: -0.03 },
  IZUMI: { 55: -0.15, 40: -0.08, 20: 0.12 },
  LAYLA: { 45: 0.10, 30: 0.06, 15: 0.08, 5: -0.03 },
}

function generatePrices(def: typeof ASSET_DEFS[0]): AssetPrice[] {
  const rng = mulberry32(hashString(def.symbol))
  const prices: AssetPrice[] = []
  let price = def.base * (0.95 + rng() * 0.1)
  const drift = def.type === "crypto" ? 0.0003 : 0.0001
  const vol = def.type === "crypto" ? 0.035 : 0.015
  let volCurrent = vol

  for (let i = 0; i < 90; i++) {
    const dayOffset = 89 - i
    const date = new Date(2026, 5, 1) // June 1, 2026
    date.setDate(date.getDate() - dayOffset)
    const dateStr = date.toISOString().split("T")[0]

    const shock = (rng() - 0.5) * 2
    const ret = drift + volCurrent * shock

    // Narrative events
    const events = NARRATIVE_EVENTS[def.symbol]
    if (events && events[dayOffset] !== undefined) {
      price *= 1 + events[dayOffset]
    } else {
      price *= 1 + ret
    }

    // Mean reversion for indices
    if (def.type === "index") {
      price += (def.base - price) * 0.002
    }

    // GARCH-like volatility
    volCurrent = vol * 0.85 + Math.abs(ret) * 0.15 * 3

    const prevClose = i > 0 ? prices[i - 1].close : price * (1 - ret * 0.5)
    const changePercent = ((price - prevClose) / prevClose) * 100

    prices.push({
      date: dateStr,
      close: Math.round(price),
      changePercent: Math.round(changePercent * 100) / 100,
    })
  }
  return prices
}

export function getAllAssets(): Asset[] {
  return ASSET_DEFS.map((def) => {
    const prices = generatePrices(def)
    const currentPrice = prices[prices.length - 1].close
    const prevPrice = prices[prices.length - 2].close
    return {
      ...def,
      prices,
      currentPrice,
      change24h: currentPrice - prevPrice,
      changePercent24h: ((currentPrice - prevPrice) / prevPrice) * 100,
    }
  })
}
