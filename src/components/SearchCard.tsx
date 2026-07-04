"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Globe } from "lucide-react"

interface SearchCardProps {
  rank: number
  title: string
  url: string
  description: string
}

export function SearchCard({ rank, title, url, description }: SearchCardProps) {
  const [faviconFailed, setFaviconFailed] = useState(false)
  let displayUrl = ""
  let urlPath = ""
  let hostname = ""
  try {
    const parsed = new URL(url)
    hostname = parsed.hostname.replace("www.", "")
    displayUrl = hostname
    urlPath = parsed.pathname.replace(/\/$/, "") || ""
  } catch {
    displayUrl = url
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(rank * 0.04, 0.4), ease: [0.25, 0.1, 0.25, 1] }}
      className="group rounded-2xl border border-transparent p-4 transition-all duration-200 hover:border-border/40 hover:bg-muted/20 hover:shadow-sm -mx-2"
    >
      <div className="flex items-center gap-2.5">
        {hostname && !faviconFailed ? (
          <img
            src={`https://icons.duckduckgo.com/ip3/${hostname}.ico`}
            alt=""
            className="h-5 w-5 shrink-0 rounded-full"
            onError={() => setFaviconFailed(true)}
          />
        ) : (
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted">
            <Globe className="h-3 w-3 text-muted-foreground/50" />
          </div>
        )}
        <div className="truncate text-sm">
          <span className="font-medium text-foreground/60">{displayUrl}</span>
          <span className="text-muted-foreground/30 mx-1.5">&rsaquo;</span>
          <span className="text-muted-foreground/50">{urlPath || "/"}</span>
        </div>
      </div>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-1 block"
      >
        <h3 className="text-[17px] leading-6 text-primary transition-colors duration-200 hover:text-primary/80 group-hover:underline">
          {title}
        </h3>
      </a>

      <p className="mt-0.5 text-sm leading-6 text-foreground/65 line-clamp-2">
        {description}
      </p>
    </motion.div>
  )
}
