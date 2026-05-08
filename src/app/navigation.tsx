"use client"

import Link from "next/link"
import { useLang } from "@/lib/use-lang"
import { LangToggle } from "@/platform/lang-toggle"
import { Rocket } from "lucide-react"
import { type Lang, tl } from "@/lib/lang"

export function Navigation() {
  const { lang, setLang } = useLang()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-edu-bg/80 backdrop-blur-md border-b border-edu-border/50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-edu-text hover:text-primary transition-colors"
        >
          <Rocket className="w-5 h-5 text-primary" />
          <span className="text-sm font-bold tracking-wider">EUREKA SPACE</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/timeline"
            className="text-xs text-edu-muted hover:text-edu-text transition-colors"
          >
            {tl("年表", "Timeline", lang)}
          </Link>
          <Link
            href="/wiki"
            className="text-xs text-edu-muted hover:text-edu-text transition-colors"
          >
            Wiki
          </Link>
          <LangToggle lang={lang} setLang={setLang} />
        </div>
      </div>
    </nav>
  )
}
