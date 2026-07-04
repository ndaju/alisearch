"use client"

import { motion } from "framer-motion"
import { ExternalLink, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

interface InfoData {
  title: string
  description: string
  extract: string
  thumbnail: string | null
  url: string
  infobox: { label: string; value: string }[]
}

export function InfoCard({ info }: { info: InfoData }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm"
    >
      <div className="p-4">
        <h2 className="text-lg font-bold text-foreground">{info.title}</h2>
        {info.description && (
          <p className="mt-0.5 text-sm text-muted-foreground/70">{info.description}</p>
        )}

        <p className={`mt-3 text-sm leading-6 text-foreground/80 ${expanded ? "" : "line-clamp-3"}`}>
          {info.extract}
        </p>

        {info.extract.length > 250 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-1 flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
          >
            {expanded ? (
              <>Daha az <ChevronUp className="h-3 w-3" /></>
            ) : (
              <>Devamını oku <ChevronDown className="h-3 w-3" /></>
            )}
          </button>
        )}

        {info.infobox.length > 0 && (
          <div className="mt-4 space-y-2.5 border-t border-border/50 pt-4">
            {info.infobox.map((row, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <span className="shrink-0 text-xs font-semibold text-muted-foreground/50 min-w-20">
                  {row.label}
                </span>
                <span className="text-foreground/80">{row.value}</span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 pt-3">
          <a
            href={info.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
          >
            Wikipedia&rsquo;da oku
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </motion.div>
  )
}
