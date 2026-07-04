"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { SearchBar } from "@/components/SearchBar"
import { SearchResults } from "@/components/SearchResults"
import { ThemeToggle } from "@/components/ThemeToggle"

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="shrink-0">
            <motion.div
              whileHover={{ scale: 1.05, rotate: -3 }}
              className="relative h-8 w-8 overflow-hidden rounded-lg transition-shadow duration-300 hover:shadow-md"
            >
              <Image
                src="/AliSearch.png"
                alt="AliSearch"
                fill
                className="object-contain"
                priority
              />
            </motion.div>
          </Link>
          <div className="flex-1 max-w-2xl">
            <SearchBar query={query} />
          </div>
          <div className="shrink-0">
            <ThemeToggle />
          </div>
        </div>
      </motion.header>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <SearchResults query={query} />
      </motion.div>
    </>
  )
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="flex items-center gap-3 text-muted-foreground">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent"
            />
            <span className="text-sm">Loading...</span>
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  )
}
