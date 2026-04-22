'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Users, Sparkles, Swords, Ghost } from 'lucide-react';

/* ------------------------------------------------------------------ */
/* Types & character data                                               */
/* ------------------------------------------------------------------ */

type Category = 'all' | 'auralis' | 'warriors' | 'others';

interface Character {
  name: string;
  filename: string;
  description: string;
  category: 'auralis' | 'warriors' | 'others';
}

const characters: Character[] = [
  /* AURALIS members */
  { name: 'Mina Eureka Ernst', filename: 'MinaEurekaErnst.png', description: 'AURALIS 第二世代の音楽プロデューサー。リミナル・フォージ主宰。', category: 'auralis' },
  { name: 'Layla Virel Nova', filename: 'LaylaVirelNova.png', description: 'ピンク・ヴォルテージ。冷凍保存から蘇った伝説の戦士。', category: 'auralis' },
  { name: 'Kate Claudia', filename: 'KateClaudia.png', description: 'AURALIS初代ケイトの継承者。感情の炎を受け継ぐ。', category: 'auralis' },
  { name: 'Lillie Steiner', filename: 'LillieSteiner.png', description: 'AURALIS初代リリー。境界線を歌う表現者。', category: 'auralis' },
  { name: 'Lillie Ardent', filename: 'LillieArdent.png', description: 'Lillie Ardentの名を継ぐ存在。感情の炎そのもの。', category: 'auralis' },
  { name: 'Kate Patton', filename: 'KatePatton.png', description: 'AURALISの創設者。「設計者」と呼ばれた。', category: 'auralis' },
  { name: 'Ninny Offenbach', filename: 'NinnyOffenbach.png', description: 'AURALISメンバー。ユニークな才能を持つ。', category: 'auralis' },

  /* Warriors / Fighters */
  { name: 'Alpha Kane', filename: 'AlphaKane.png', description: 'ZAMLT時代に覚醒した反乱の英雄。', category: 'warriors' },
  { name: 'Celia Dminix', filename: 'CeliaDminix.png', description: 'アルファ・ケインを打倒し黄金期をもたらした。', category: 'warriors' },
  { name: 'Casteria Grenvelt', filename: 'CasteriaGrenvelt.png', description: '戦士として名を馳せた実力者。', category: 'warriors' },
  { name: 'Castina Tempest', filename: 'CastinaTempest.png', description: 'テンペストの名を冠する戦士。', category: 'warriors' },
  { name: 'Timur Shah', filename: 'TimurShah.png', description: 'E16星系の初代移民リーダー。10次元ホラズム理論の提唱者。', category: 'warriors' },
  { name: 'El Forhaus', filename: 'ElForhaus.png', description: 'マーストリヒト革命の指導者。新時代のルーキー。', category: 'warriors' },
  { name: 'Aria Sol', filename: 'AriaSol.png', description: '多元文化協定の継承者。', category: 'warriors' },
  { name: 'Leon', filename: 'Leon.png', description: '実力派の剣士。', category: 'warriors' },
  { name: 'Gareth', filename: 'Gareth.png', description: '歴戦の戦士。', category: 'warriors' },
  { name: 'Gil', filename: 'Gil.png', description: 'ギガポリスの戦士。', category: 'warriors' },
  { name: 'Iris', filename: 'Iris.png', description: 'AURALISに関連する戦士。', category: 'warriors' },
  { name: 'Yonik', filename: 'Yonik.png', description: '戦士。', category: 'warriors' },
  { name: 'Jen', filename: 'Jen.png', description: '語り部の戦士。', category: 'warriors' },
  { name: 'Reid Kakizaki', filename: 'ReidKakizaki.png', description: '実力を持つ戦士。', category: 'warriors' },
  { name: 'Karla Velm', filename: 'KarlaVelm.png', description: '実力者。', category: 'warriors' },
  { name: 'Aike Lopez', filename: 'AikeLopez.png', description: '実力者。', category: 'warriors' },
  { name: 'Wadrina', filename: 'Wadrina.png', description: '実力者。', category: 'warriors' },
  { name: 'Azazel Hectopus', filename: 'AzazelHectopus.png', description: '謎めいた存在。', category: 'warriors' },
  { name: 'Erios Wald', filename: 'EriosWald.png', description: '実力者。', category: 'warriors' },
  { name: 'Lastman', filename: 'Lastman.png', description: '最後の戦士。', category: 'warriors' },
  { name: 'Temirtaron', filename: 'Temirtaron.png', description: '戦士。', category: 'warriors' },
  { name: 'Marina Bobbin', filename: 'MarinaBobbin.png', description: '戦士。', category: 'warriors' },
  { name: 'Sebastian Valerius', filename: 'SebastianValerius.png', description: '実力者。', category: 'warriors' },
  { name: 'Sheron Jeras', filename: 'SheronJeras.png', description: '実力者。', category: 'warriors' },
  { name: 'Ninigis Karas', filename: 'NinigisKaras.png', description: '戦士。', category: 'warriors' },
  { name: 'Levilia Serpentina', filename: 'LeviliaSerpentina.png', description: '蛇の如き戦士。', category: 'warriors' },
  { name: 'Aina Von Riesfeld', filename: 'AinaVonRiesfeld.png', description: '戦士。', category: 'warriors' },
  { name: 'Willie', filename: 'Willie.png', description: '戦士。', category: 'warriors' },
  { name: 'Yeshibato', filename: 'Yeshibato.png', description: '戦士。', category: 'warriors' },
  { name: 'Garo', filename: 'Garo.png', description: '実力者。', category: 'warriors' },
  { name: 'Goldilocks', filename: 'Goldilocks.png', description: '実力者。', category: 'warriors' },
  { name: 'Bobristy', filename: 'Bobristy.png', description: '実力者。', category: 'warriors' },

  /* Others / Unique */
  { name: 'Sitra Celes', filename: 'SitraCeles.png', description: 'ヴァルカン帝国の皇帝。健康な体躯を持つ。', category: 'others' },
  { name: 'Diana', filename: 'Diana.png', description: 'Eros-7に関連する女性。', category: 'others' },
  { name: 'Elena', filename: 'Elena.png', description: 'Eros-7の初期リーダー。搾取技術の開発者。', category: 'others' },
  { name: 'Sylvia Crow', filename: 'SylviaCrow.png', description: 'エスパー能力を持つ女性リーダー。', category: 'others' },
  { name: 'Lilith Vane', filename: 'LilithVane.png', description: 'Eros-7の女性リーダー。搾取生物の制御者。', category: 'others' },
  { name: 'Miyushari', filename: 'Miyushari.png', description: 'ミユシャリ。', category: 'others' },
  { name: 'Tina Gue', filename: 'TinaGue.png', description: '地下街のフェミニスト戦士。', category: 'others' },
  { name: 'Ayaka Rin', filename: 'AyakaRin.png', description: '実力者。', category: 'others' },
  { name: 'Zena', filename: 'Zena.png', description: '実力者。', category: 'others' },
  { name: 'Vivietta', filename: 'Vivietta.png', description: '実力者。', category: 'others' },
  { name: 'Myu', filename: 'Myu.png', description: 'エロティックトラップダンジョンを征するレベル607の英雄。', category: 'others' },
  { name: 'Slime Woman', filename: 'SlimeWoman.png', description: 'スライムの女性。', category: 'others' },
  { name: 'White Noise', filename: 'WhiteNoise.png', description: 'ホワイトノイズ。', category: 'others' },
  { name: 'Frederic Gabby', filename: 'FredericGabby.png', description: '実力者。', category: 'others' },
  { name: 'Mikael Gabrieli', filename: 'MikaelGabrieli.png', description: '実力者。', category: 'others' },
  { name: 'Fariel', filename: 'Fariel.png', description: '実力者。', category: 'others' },
  { name: 'Fiona', filename: 'Fiona.png', description: '実力者。', category: 'others' },
  { name: 'Master Venom', filename: 'MasterVenom.png', description: '毒の達人。', category: 'others' },
  { name: 'Izumi', filename: 'Izumi.png', description: '実力者。', category: 'others' },
  { name: 'Piatrino', filename: 'Piatrino.png', description: '実力者。', category: 'others' },
  { name: 'Gentaro', filename: 'Gentaro.png', description: '弦太郎。', category: 'others' },
  { name: 'AJ', filename: 'AJ.png', description: '実力者。', category: 'others' },
  { name: 'Jun', filename: 'Jun.png', description: '実力者。', category: 'others' },
  { name: 'Katarina', filename: 'Katarina.png', description: '実力者。', category: 'others' },
];

const filterTabs: { key: Category; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'all', label: 'All', icon: Users },
  { key: 'auralis', label: 'AURALIS', icon: Sparkles },
  { key: 'warriors', label: 'Warriors', icon: Swords },
  { key: 'others', label: 'Others', icon: Ghost },
];

/* ------------------------------------------------------------------ */
/* Character Card                                                       */
/* ------------------------------------------------------------------ */

function CharacterCard({ character, index }: { character: Character; index: number }) {
  const isAuralis = character.category === 'auralis';

  return (
    <motion.div
      className="group relative glass rounded-2xl overflow-hidden cursor-default"
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.04, 0.4) }}
      whileHover={{ scale: 1.03, y: -4 }}
    >
      {/* Portrait image */}
      <div className="relative w-full aspect-square overflow-hidden bg-[oklch(0.10_0.02_280)]">
        <Image
          src={`/characters/${character.filename}`}
          alt={character.name}
          width={512}
          height={512}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />

        {/* Gradient overlay at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.07_0.02_280/0.95)] via-[oklch(0.07_0.02_280/0.3)] to-transparent" />

        {/* AURALIS badge */}
        {isAuralis && (
          <div className="absolute top-2.5 right-2.5">
            <span
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase"
              style={{
                background: 'linear-gradient(135deg, oklch(0.72 0.22 300 / 0.8), oklch(0.65 0.20 280 / 0.8))',
                border: '1px solid oklch(0.72 0.22 300 / 0.4)',
                color: 'oklch(0.98 0 0)',
              }}
            >
              <Sparkles className="w-2.5 h-2.5" />
              AURALIS
            </span>
          </div>
        )}

        {/* Category color dot */}
        {!isAuralis && (
          <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full" style={{
            background: character.category === 'warriors'
              ? 'oklch(0.70 0.20 30)'
              : 'oklch(0.75 0.18 180)',
            boxShadow: character.category === 'warriors'
              ? '0 0 8px oklch(0.70 0.20 30 / 0.5)'
              : '0 0 8px oklch(0.75 0.18 180 / 0.5)',
          }} />
        )}
      </div>

      {/* Info area */}
      <div className="p-3 sm:p-4">
        <h3
          className="font-bold text-sm sm:text-base truncate transition-colors duration-300"
          style={{ color: isAuralis ? 'oklch(0.80 0.15 320)' : 'oklch(0.90 0.01 280)' }}
        >
          {character.name}
        </h3>
        <p className="text-xs text-[oklch(0.55_0.02_280)] leading-relaxed mt-1 line-clamp-2">
          {character.description}
        </p>
      </div>

      {/* Hover glow border */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          boxShadow: isAuralis
            ? '0 0 20px oklch(0.72 0.22 300 / 0.2), inset 0 0 20px oklch(0.72 0.22 300 / 0.05)'
            : character.category === 'warriors'
              ? '0 0 20px oklch(0.70 0.20 30 / 0.15), inset 0 0 20px oklch(0.70 0.20 30 / 0.03)'
              : '0 0 20px oklch(0.75 0.18 180 / 0.15), inset 0 0 20px oklch(0.75 0.18 180 / 0.03)',
        }}
      />
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Main section                                                         */
/* ------------------------------------------------------------------ */

export default function CharactersSection() {
  const [activeFilter, setActiveFilter] = useState<Category>('all');

  const filtered = activeFilter === 'all'
    ? characters
    : characters.filter((c) => c.category === activeFilter);

  return (
    <section className="relative py-20 px-6" id="characters">
      {/* Background accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 right-0 w-[600px] h-[500px] opacity-[0.06] blur-[150px]"
          style={{ background: 'radial-gradient(circle, oklch(0.72 0.22 300), transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-[500px] h-[400px] opacity-[0.04] blur-[130px]"
          style={{ background: 'radial-gradient(circle, oklch(0.75 0.18 180), transparent 70%)' }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-[oklch(0.72_0.22_300)]" />
            <span className="text-xs font-mono tracking-[0.3em] uppercase text-[oklch(0.72_0.22_300)]">
              Characters
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-foreground via-[oklch(0.75_0.22_340)] to-[oklch(0.72_0.22_300)] bg-clip-text text-transparent">
            キャラクター
          </h2>
          <p className="text-sm text-[oklch(0.50_0.02_280)] mt-2">
            {characters.length} characters across the E16 star system
          </p>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          className="flex flex-wrap gap-2 mb-8"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.key;
            const count = tab.key === 'all'
              ? characters.length
              : characters.filter((c) => c.category === tab.key).length;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className="relative inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
                style={{
                  background: isActive
                    ? 'oklch(0.72 0.22 300 / 0.15)'
                    : 'oklch(0.12 0.02 280 / 0.5)',
                  border: isActive
                    ? '1px solid oklch(0.72 0.22 300 / 0.4)'
                    : '1px solid oklch(0.25 0.03 280 / 0.3)',
                  color: isActive
                    ? 'oklch(0.85 0.12 300)'
                    : 'oklch(0.55 0.02 280)',
                }}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span className="text-[10px] opacity-60 ml-0.5">{count}</span>
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    layoutId="filter-glow"
                    style={{ boxShadow: '0 0 15px oklch(0.72 0.22 300 / 0.2)' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </motion.div>

        {/* Character grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            {filtered.map((character, i) => (
              <CharacterCard key={character.filename} character={character} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Showing count */}
        <motion.p
          className="text-center text-[oklch(0.45_0.02_280)] mt-8 text-xs font-mono tracking-wider uppercase"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          Showing {filtered.length} of {characters.length} characters
        </motion.p>
      </div>
    </section>
  );
}
