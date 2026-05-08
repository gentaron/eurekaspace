'use client';

import { motion } from 'framer-motion';
import { Globe, Clock, Star, Building2, Orbit, Layers } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

/* ------------------------------------------------------------------ */
/* Lore data                                                            */
/* ------------------------------------------------------------------ */

interface LoreSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  era?: string;
  content: string[];
}

const loreSections: LoreSection[] = [
  {
    id: 'origin',
    title: 'E16星系の起源',
    icon: Star,
    era: 'Pre-E000',
    content: [
      'E16星系は、地球から約4,200光年離れた位置にある二連星系である。主星「エウレカ・アルファ」と伴星「エウレカ・ベータ」が互いに周回するこの星系は、地球の天文学者たちが「星の交響曲（Symphony of Stars）」と呼んだ美しい光のパターンを放っていた。',
      '地球のAD2100年代、第1次恒星間移民計画によって人類はE16星系への移住を開始。約30万人の移民団は、次元超航行技術「ディメンション・ホライズン」を用いて数年の航海の末、主星の第3惑星「Symphony of Stars（星の交響曲）」に到達した。この惑星は地球に酷似した環境を持ち、移民たちに新しい故郷を与えた。',
      '初期入植地は「ギガポリス」と命名され、急速な都市化が進んだ。E100年までに人口は100万人を突破し、E200年には惑星規模の文明が確立。E16星系独自の文化や技術が花開いていくことになる。',
    ],
  },
  {
    id: 'auralis',
    title: 'AURALISの歴史',
    icon: Star,
    era: 'E270 — E528',
    content: [
      'AURALISはE270年、Kate Patton（ケイト・パットン）とLillie Ardent（リリー・アーデント）によって設立された音楽アイドルプロジェクト。「設計者」と呼ばれたKateの構想と、Lillieの「感情の炎」と称される圧倒的な表現力が、AURALISを一躍有名にした。',
      '黄金期と呼ばれるE335年〜E370年、AURALISはE16星系で最大の文化的ムーヴメントとなった。E325年には冷凍保存から蘇った伝説の戦士Layla Virel Nova（レイラ・ヴィレル・ノヴァ）が加入。「ピンク・ヴォルテージ」として名を馳せ、AURALISの人気は頂点に達した。',
      'しかしE400年、内部の対立と時代の変化によりAURALISは一度解散。約100年の時を経て、E528年にMina Eureka Ernst（ミナ・エウレカ・エルンスト）を中心とした第二世代として復活を果たす。Kate Claudia、Ninny Offenbach、Lillie Steinerら新メンバーを擁し、リミナル・フォージを主宰して新たな音楽を創造している。',
    ],
  },
  {
    id: 'gigapolis',
    title: 'ギガポリス',
    icon: Building2,
    era: 'E000 — 現在',
    content: [
      'ギガポリスはSymphony of Stars最大の都市であり、E16星系の政治・経済・文化の中心地である。初期入植時代に建設されたこの都市は、長い歴史の中で幾度も変貌を遂げてきた。',
      'かつてギガポリスは企業共和国として統治されていたが、ZAMLT（ザムルト）時代の反乱を経て大きく変化する。Alpha Kane（アルファ・ケイン）率いる反乱軍の覚醒、そしてCelia Dminix（セリア・ドミニクス）による黄金期の到来が、ギガポリスの歴史を大きく塗り替えた。',
      'マーストリヒト革命の指導者El Forhausの活躍により、ギガポリスは新時代へと移行。現在では浮遊都市として発展を続け、多元文化が交差する壮大なメトロポリスとなっている。地上部から上空にまで広がる都市構造は、E16星系の技術力を象徴している。',
    ],
  },
  {
    id: 'eros7',
    title: 'Eros-7',
    icon: Orbit,
    era: 'E150 — 現在',
    content: [
      'Eros-7（エロス・セブン）は、E16星系の外縁に位置する第7惑星。独特の社会体制と独自の生態系を持つこの世界は、Symphony of Starsとは異なる発展の道を歩んできた。',
      'ElenaやLilith Vaneなどの指導者のもと、Eros-7は特殊な搾取技術と生物制御技術を発展させた。Sylvia Crowが率いるエスパー能力を持つ集団や、地下街を拠点とするTina Gueのようなフェミニスト戦士たちも、この星の複雑な社会構造の一部である。',
      'Sitra Celes（シトラ・ケレス）率いるヴァルカン帝国との関係や、Timur Shahの提唱した10次元ホラズム理論に基づく技術革新など、Eros-7を巡る歴史はE16星系全体の運命に深く関わっている。',
    ],
  },
  {
    id: 'dimension',
    title: '次元技術',
    icon: Layers,
    era: 'E050 — 現在',
    content: [
      'E16星系の文明を支える根幹技術が「次元技術」である。その中心にあるのがディメンション・ホライズン（Dimension Horizon）——高次元空間を通過する超光速航行技術であり、地球からの恒星間移民を可能にした技術そのものである。',
      'プライマリー・フィールド（Primary Field）は、Symphony of Starsを取り巻く特殊な次元領域。この領域はエネルギー供給や通信、防衛システムの基盤として機能し、E16星系社会に不可欠なインフラとなっている。',
      'パーセフォネ（Persephone）と呼ばれる技術は、最も進んだ次元応用技術の一つ。感情や記憶を次元的に保存・転送する能力を持ち、AURALISのメンバーたちに見られる「感情の炎」の継承や、Layla Virel Novaの冷凍保存からの蘇生にもこの技術が関与しているとされている。',
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Era badge                                                            */
/* ------------------------------------------------------------------ */

function EraBadge({ era }: { era: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider whitespace-nowrap"
      style={{
        background: 'oklch(0.75 0.18 180 / 0.1)',
        border: '1px solid oklch(0.75 0.18 180 / 0.25)',
        color: 'oklch(0.75 0.18 180)',
      }}
    >
      <Clock className="w-2.5 h-2.5" />
      {era}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Main section                                                         */
/* ------------------------------------------------------------------ */

export default function WorldSection() {
  return (
    <section className="relative py-20 px-6" id="world">
      {/* Background accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] opacity-[0.05] blur-[160px]"
          style={{ background: 'linear-gradient(135deg, oklch(0.75 0.18 180), oklch(0.72 0.22 300))' }}
        />
        <div
          className="absolute bottom-20 right-0 w-[500px] h-[400px] opacity-[0.04] blur-[130px]"
          style={{ background: 'radial-gradient(circle, oklch(0.65 0.20 250), transparent 70%)' }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Section header */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-[oklch(0.75_0.18_180)]" />
            <span className="text-xs font-mono tracking-[0.3em] uppercase text-[oklch(0.75_0.18_180)]">
              Worldbuilding
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-foreground via-[oklch(0.80_0.15_320)] to-[oklch(0.75_0.18_180)] bg-clip-text text-transparent">
            世界観
          </h2>
          <p className="text-sm text-[oklch(0.50_0.02_280)] mt-2">
            E16連星系の宇宙観と歴史
          </p>
        </motion.div>

        {/* Timeline marker line */}
        <motion.div
          className="relative mb-8 flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide"
          style={{ scrollbarWidth: 'none' }}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="h-px flex-1 min-w-[40px] bg-gradient-to-r from-transparent to-[oklch(0.25_0.03_280)]" />
          {[
            { year: 'Pre-E000', label: '起源' },
            { year: 'E270', label: 'AURALIS設立' },
            { year: 'E335', label: '黄金期' },
            { year: 'E400', label: '解散' },
            { year: 'E528', label: '第二世代' },
          ].map((marker, i) => (
            <div key={marker.year} className="flex items-center gap-2 flex-shrink-0">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  background: i === 4
                    ? 'oklch(0.72 0.22 300)'
                    : 'oklch(0.35 0.04 280)',
                  boxShadow: i === 4
                    ? '0 0 8px oklch(0.72 0.22 300 / 0.5)'
                    : 'none',
                }}
              />
              <span className="text-[10px] font-mono text-[oklch(0.50_0.02_280)] whitespace-nowrap">
                {marker.year}
              </span>
              <span className="text-[10px] text-[oklch(0.40_0.02_280)] whitespace-nowrap hidden sm:inline">
                {marker.label}
              </span>
              {i < 4 && <div className="h-px w-6 sm:w-10 bg-[oklch(0.25_0.03_280)]" />}
            </div>
          ))}
          <div className="h-px flex-1 min-w-[40px] bg-gradient-to-l from-transparent to-[oklch(0.25_0.03_280)]" />
        </motion.div>

        {/* Accordion content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-1">
            {loreSections.map((section, i) => (
              <AccordionItem
                key={section.id}
                value={section.id}
                className="glass rounded-xl px-5 sm:px-6 data-[state=open]:glow-purple transition-all duration-300 overflow-hidden border-[oklch(0.20_0.03_280)]"
              >
                <AccordionTrigger className="py-4 hover:no-underline group">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300"
                      style={{
                        background: 'oklch(0.72 0.22 300 / 0.1)',
                        border: '1px solid oklch(0.72 0.22 300 / 0.15)',
                      }}
                    >
                      <section.icon className="w-4 h-4 text-[oklch(0.72_0.22_300)]" />
                    </div>
                    <div className="text-left">
                      <span className="text-sm sm:text-base font-semibold text-foreground group-hover:text-[oklch(0.85_0.12_300)] transition-colors duration-300">
                        {section.title}
                      </span>
                    </div>
                    {section.era && (
                      <div className="ml-2">
                        <EraBadge era={section.era} />
                      </div>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-5">
                  <div className="space-y-4 pl-11">
                    {section.content.map((paragraph, j) => (
                      <motion.p
                        key={j}
                        className="text-sm leading-relaxed text-[oklch(0.65_0.02_280)]"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: j * 0.1 }}
                      >
                        {paragraph}
                      </motion.p>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* Footer note */}
        <motion.p
          className="text-center text-[oklch(0.40_0.02_280)] mt-10 text-xs font-mono tracking-wider"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          ✦ E16連星系 universe — E528年現在 ✦
        </motion.p>
      </div>
    </section>
  );
}
