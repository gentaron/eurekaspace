"use client"
import * as React from "react"
import { ChevronDown } from "lucide-react"

export function Accordion({ children, className = "", type }: { children: React.ReactNode; className?: string; type?: "single" | "multiple"; collapsible?: boolean }) {
  return <div className={className}>{children}</div>
}

export function AccordionItem({ value, children, className = "" }: { value: string; children: React.ReactNode; className?: string }) {
  const [open, setOpen] = React.useState(false)
  const childArray = React.Children.toArray(children)
  return (
    <div className={`border-b border-white/10 ${className}`}>
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full py-3 text-left text-sm font-medium text-foreground hover:text-white/80 transition-colors">
        {childArray[0]}
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="pb-3 text-sm text-muted-foreground">{childArray[1]}</div>}
    </div>
  )
}

export function AccordionTrigger({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <>{children}</>
}

export function AccordionContent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <>{children}</>
}
