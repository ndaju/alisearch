"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ImageIcon, Link, Upload, X } from "lucide-react"
import { motion } from "framer-motion"

export function ImageSearchPopover() {
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState("")
  const [preview, setPreview] = useState<string | null>(null)
  const router = useRouter()
  const ref = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      setPreview(dataUrl)
      setUrl("")
    }
    reader.readAsDataURL(file)
  }

  const handleSearch = () => {
    const q = url.trim() || preview || ""
    if (!q) return
    setOpen(false)
    setUrl("")
    setPreview(null)
    router.push(`/search?q=${encodeURIComponent(q)}&category=images`)
  }

  return (
    <div ref={ref} className="relative">
      <motion.button
        type="button"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(!open)}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
        aria-label="Search by image"
      >
        <ImageIcon className="h-4 w-4" />
      </motion.button>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.15 }}
          className="absolute right-0 top-full z-50 mt-2 w-80 rounded-2xl border bg-popover p-4 shadow-xl"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-foreground">Search by image</span>
            <button
              onClick={() => { setOpen(false); setPreview(null); setUrl("") }}
              className="flex h-6 w-6 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {preview ? (
            <div className="relative mb-3 overflow-hidden rounded-xl border">
              <img src={preview} alt="Preview" className="max-h-40 w-full object-contain bg-muted" />
              <button
                onClick={() => setPreview(null)}
                className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-lg bg-background/80 text-foreground hover:bg-background"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div className="mb-3 flex items-center gap-2 rounded-xl border bg-muted/30 px-3 py-2">
              <Link className="h-4 w-4 shrink-0 text-muted-foreground/50" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Paste image URL"
                className="flex-1 border-0 bg-transparent text-sm text-foreground placeholder-muted-foreground/50 focus:outline-none"
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={handleSearch}
              disabled={!url.trim() && !preview}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              <ImageIcon className="h-3.5 w-3.5" />
              Search
            </button>
            <span className="text-xs text-muted-foreground/40">or</span>
            <button
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Upload className="h-3.5 w-3.5" />
              Upload
            </button>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
        </motion.div>
      )}
    </div>
  )
}
