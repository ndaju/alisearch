"use client"

import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { SearchBar } from "@/components/SearchBar"
import { ThemeToggle } from "@/components/ThemeToggle"

export function HomeContent() {
  const router = useRouter()
  const [searchHovered, setSearchHovered] = useState(false)

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent dark:from-primary/10"
      />

      <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <ThemeToggle />
        </motion.div>
      </div>

      <div className="relative flex w-full max-w-xl flex-col items-center gap-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="relative flex flex-col items-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="relative mb-4 h-28 w-28 transition-all duration-500 hover:scale-105 sm:h-32 sm:w-32"
          >
            <Image
              src="/AliSearch.png"
              alt="AliSearch"
              fill
              className="object-contain"
              priority
            />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-3xl font-bold tracking-tight sm:text-4xl"
          >
            AliSearch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="mt-1 text-sm text-muted-foreground/60"
          >
            Privacy-first. No tracking. Fast.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full"
        >
          <SearchBar large autofocus />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.55 }}
        >
          <motion.button
            onClick={() => {
              const input = document.querySelector<HTMLInputElement>('input[type="text"]')
              if (input?.value.trim()) {
                router.push(`/search?q=${encodeURIComponent(input.value.trim())}`)
              }
            }}
            onHoverStart={() => setSearchHovered(true)}
            onHoverEnd={() => setSearchHovered(false)}
            whileTap={{ scale: 0.96 }}
            className="relative overflow-hidden rounded-xl bg-primary px-7 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30"
          >
            <motion.span
              animate={searchHovered ? { x: 3 } : { x: 0 }}
              className="relative z-10 inline-flex items-center gap-2"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              Search
            </motion.span>
            <motion.div
              initial={false}
              animate={searchHovered ? { x: "100%" } : { x: "-100%" }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            />
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.7 }}
          className="flex items-center gap-4 text-sm text-muted-foreground"
        >
          {[
            { text: "Private.", color: "text-green-500" },
            { text: "Fast.", color: "text-blue-500" },
            { text: "No tracking.", color: "text-purple-500" },
          ].map((tag, i) => (
            <motion.span
              key={tag.text}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.15, duration: 0.4 }}
              className="flex items-center gap-1.5"
            >
              <motion.svg
                className={`h-4 w-4 ${tag.color}`}
                viewBox="0 0 24 24"
                fill="currentColor"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.9 + i * 0.15, type: "spring", stiffness: 400, damping: 15 }}
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </motion.svg>
              {tag.text}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
