"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ImageIcon, ExternalLink, Download, Maximize2 } from "lucide-react"

interface ImageCardProps {
  rank: number
  title: string
  url: string
  imgSrc: string
  resolution?: string
  source?: string
  thumbnailSrc?: string
  onOpen?: () => void
}

export function ImageCard({
  rank,
  title,
  url,
  imgSrc,
  resolution,
  source,
  thumbnailSrc,
  onOpen,
}: ImageCardProps) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const src = thumbnailSrc || imgSrc

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: rank * 0.03, ease: "easeOut" }}
      className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-300 hover:border-border hover:shadow-lg hover:shadow-primary/5"
    >
      <button
        onClick={onOpen}
        className="relative aspect-[4/3] w-full overflow-hidden bg-muted block cursor-pointer text-left w-full"
      >
        {src && !error ? (
          <>
            <img
              src={src}
              alt={title}
              loading="lazy"
              onLoad={() => setLoaded(true)}
              onError={() => setError(true)}
              className={`h-full w-full object-cover transition-all duration-500 group-hover:scale-105 ${
                loaded ? "opacity-100" : "opacity-0"
              }`}
            />
            {!loaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-6 w-6 animate-pulse rounded-full bg-muted-foreground/10" />
              </div>
            )}
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-black shadow-lg transition-transform hover:scale-110">
            <Maximize2 className="h-4 w-4" />
          </span>
        </div>

        {resolution && (
          <span className="absolute bottom-2 right-2 rounded-md bg-black/60 px-2 py-0.5 text-xs text-white backdrop-blur-sm">
            {resolution}
          </span>
        )}
      </button>

      <div className="p-3">
        <h3 className="line-clamp-1 text-sm font-medium text-foreground transition-colors group-hover:text-primary">
          {title}
        </h3>
        <div className="mt-1 flex items-center justify-between">
          {source && (
            <span className="truncate text-xs text-muted-foreground">{source}</span>
          )}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="shrink-0 rounded-lg p-1 text-muted-foreground/50 opacity-0 transition-all hover:text-foreground group-hover:opacity-100"
            title="Open source page"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </motion.div>
  )
}
