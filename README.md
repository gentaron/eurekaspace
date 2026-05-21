<div align="center">

# Eureka Space

**EDU ユニバース百科事典 — E16 連星系の知識を探求する**

[English](#english) · [日本語](#日本語)

</div>

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)]()

🌐 **Live**: [eurekaspace.netlify.app](https://eurekaspace.netlify.app)

---

## 日本語

### 概要

Eureka Space は EDU（Eternal Dominion Universe）の百科事典サイト。E16 連星系を舞台とする SF ユニバースのキャラクター、組織、地理、技術、用語、歴史を網羅的に探索できる。AD3500 から E528 に至る 500 年以上の宇宙史を統合タイムラインで辿り、転置インデックスによる全文検索で知識にアクセスできる。60+ キャラクターのポートレートギャラリー、音楽プレイヤー、AI 生成動画セクションも備える。

### Features

| Feature | 説明 |
|---------|------|
| **Wiki 百科事典** | 7 カテゴリ（キャラクター・組織・地理・技術・用語・歴史）の全文検索可能な百科事典 |
| **統合タイムライン** | AD3500 → E528 の宇宙史をアコーディオン形式で表示、場所バッジから Wiki へリンク |
| **キャラクターギャラリー** | 60+ キャラクターのポートレート、Tier 別分類 |
| **音楽プレイヤー** | 25+ の BGM トラック |
| **動画セクション** | AI 生成の動画コンテンツ |
| **多言語対応** | 日本語 / 英語 bilingual（JA デフォルト、EN 切替） |

### Quick Start

```bash
git clone https://github.com/gentaron/eurekaspace.git && cd eurekaspace
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run start        # production server
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) · React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 · class-variance-authority |
| Animation | Framer Motion |
| Icons | Lucide React |
| Database | SQLite via Prisma |
| Deploy | Caddy reverse proxy (port 81) |

### Project Structure

```
eurekaspace/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── page.tsx      # Home page
│   │   ├── timeline/     # Timeline page
│   │   └── wiki/         # Wiki browser & detail pages
│   ├── domains/
│   │   ├── wiki/         # Wiki data, search engine, content repository
│   │   └── civilizations/ # Civilization data with tier rankings
│   ├── platform/         # Shared UI components (accordion, lang-toggle, etc.)
│   ├── lib/              # Utilities, data accessors, language config
│   └── types/            # TypeScript type definitions
├── public/               # Character PNGs, music MP3s, video MP4s
└── Caddyfile             # Caddy reverse proxy config
```

---

## English

### Overview

Eureka Space is the encyclopedia site for the **Eternal Dominion Universe (EDU)**. Explore characters, organizations, geography, technology, terms, and history of the E16 binary star system civilization. Navigate 500+ years of universe history (AD3500–E528) through an integrated timeline with location badges linking to wiki entries. Features inverted-index full-text search, a 60+ character portrait gallery with tier-based classification, an audio player, and AI-generated video content.

### Key Pages

- `/` — Home page with universe overview
- `/timeline` — Interactive timeline from AD3500 to E528
- `/wiki` — Searchable encyclopedia browser
- `/wiki/[id]` — Individual wiki entry detail

---

## Related Repositories

| Repo | Description |
|------|-------------|
| [gentaron/edu](https://github.com/gentaron/edu) | Main EDU application |
| [gentaron/edutext](https://github.com/gentaron/edutext) | Story text files (JP/EN) |
| [gentaron/image](https://github.com/gentaron/image) | Character artwork |
| [gentaron/laylaland](https://github.com/gentaron/laylaland) | Layla character site |
| [gentaron/irisworlds](https://github.com/gentaron/irisworlds) | Iris character site |

## License

[MIT](LICENSE)
