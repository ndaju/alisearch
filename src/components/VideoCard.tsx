"use client"

import { motion } from "framer-motion"
import { Play } from "lucide-react"

interface VideoCardProps {
  rank: number
  title: string
  url: string
  description?: string
  length?: string
  thumbnail?: string
  source?: string
  publishedDate?: string
}

export function VideoCard({
  rank,
  title,
  url,
  description,
  length,
  thumbnail,
  source,
  publishedDate,
}: VideoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: rank * 0.05, ease: "easeOut" }}
      className="group flex gap-4 rounded-2xl border border-transparent bg-card p-4 transition-all duration-300 hover:border-border hover:shadow-lg hover:shadow-primary/5"
    >
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="relative aspect-video h-24 shrink-0 overflow-hidden rounded-xl bg-muted sm:h-28"
      >
        {thumbnail ? (
          <img
            src={thumbnail}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Play className="h-8 w-8 text-muted-foreground/40" />
          </div>
        )}
        {length && (
          <span className="absolute bottom-1.5 right-1.5 rounded-md bg-black/70 px-1.5 py-0.5 text-[11px] font-medium text-white">
            {length}
          </span>
        )}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/90 text-white shadow-lg backdrop-blur-sm">
            <Play className="h-5 w-5 fill-white pl-0.5" />
          </div>
        </div>
      </a>
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="line-clamp-2 text-sm font-semibold text-foreground transition-colors group-hover:text-primary"
        >
          {title}
        </a>
        {source && (
          <p className="mt-0.5 text-xs text-muted-foreground">{source}</p>
        )}
        {description && (
          <p className="mt-1 line-clamp-1 text-xs text-muted-foreground/70">
            {description}
          </p>
        )}
        {publishedDate && (
          <p className="mt-1 text-xs text-muted-foreground/50">{publishedDate}</p>
        )}
      </div>
    </motion.div>
  )
}
