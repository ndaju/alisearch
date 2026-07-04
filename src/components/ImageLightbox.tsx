"use client"

import { useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight, ExternalLink, Download } from "lucide-react"

interface LightboxImage {
  url: string
  title: string
  imgSrc: string
  thumbnailSrc?: string
  source?: string
  resolution?: string
}

interface ImageLightboxProps {
  images: LightboxImage[]
  currentIndex: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export function ImageLightbox({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: ImageLightboxProps) {
  const image = images[currentIndex]

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") onPrev()
      if (e.key === "ArrowRight") onNext()
    },
    [onClose, onPrev, onNext]
  )

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [handleKeyDown])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/70 backdrop-blur-sm transition-all hover:bg-white/20 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); onPrev() }}
              className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white/70 backdrop-blur-sm transition-all hover:bg-white/20 hover:text-white"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onNext() }}
              className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white/70 backdrop-blur-sm transition-all hover:bg-white/20 hover:text-white"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="flex max-h-[90vh] max-w-[90vw] flex-col items-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative flex items-center justify-center overflow-hidden rounded-2xl">
            <img
              src={image.imgSrc || image.thumbnailSrc}
              alt={image.title}
              className="max-h-[75vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
            />
          </div>

          <div className="mt-4 flex w-full items-center justify-between rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm">
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-medium text-white">
                {image.title}
              </h3>
              <div className="mt-0.5 flex items-center gap-3 text-xs text-white/50">
                {image.source && <span>{image.source}</span>}
                {image.resolution && (
                  <>
                    <span className="text-white/20">&middot;</span>
                    <span>{image.resolution}</span>
                  </>
                )}
                <span className="text-white/20">&middot;</span>
                <span>
                  {currentIndex + 1} / {images.length}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-4">
              <a
                href={image.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 items-center gap-1.5 rounded-xl bg-white/10 px-3 text-xs font-medium text-white/70 transition-all hover:bg-white/20 hover:text-white"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Source
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
