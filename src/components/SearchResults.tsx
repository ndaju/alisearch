"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { SearchCard } from "@/components/SearchCard"
import { ImageCard } from "@/components/ImageCard"
import { VideoCard } from "@/components/VideoCard"
import { SearchSkeleton } from "@/components/SearchSkeleton"
import { SearchSettings } from "@/components/SearchSettings"
import { InfoCard } from "@/components/InfoCard"
import { ImageLightbox } from "@/components/ImageLightbox"

interface SearchResult {
  title: string
  url: string
  content?: string
  description?: string
  img_src?: string
  thumbnail_src?: string
  thumbnail?: string
  resolution?: string
  source?: string
  engine?: string
  length?: string
  publishedDate?: string
}

interface SearchResultsProps {
  query: string
}

const tabs = [
  { id: "", label: "All" },
  { id: "images", label: "Images" },
  { id: "news", label: "News" },
  { id: "videos", label: "Videos" },
  { id: "music", label: "Music" },
  { id: "maps", label: "Maps" },
] as const

const searchEngineNames = new Set([
  "google", "bing", "yandex", "baidu", "yahoo",
  "google search", "bing search", "yandex search",
  "google search engine", "bing search engine", "yandex search engine",
  "google.com", "bing.com", "yandex.com", "yahoo.com",
])

const browserNames = new Set([
  "chrome", "firefox", "edge", "opera", "safari", "brave",
  "chrome browser", "firefox browser", "edge browser", "opera browser",
  "safari browser", "brave browser",
])

const searchEnginePrefixes = ["google ", "bing ", "yandex ", "baidu ", "yahoo "]
const browserPrefixes = ["chrome ", "firefox ", "edge ", "opera ", "safari ", "brave "]

function isCompetitorQuery(q: string): { name: string; type: "search-engine" | "browser" } | null {
  const lower = q.toLowerCase()
  if (searchEngineNames.has(lower)) return { name: lower, type: "search-engine" }
  if (browserNames.has(lower)) return { name: lower, type: "browser" }
  for (const prefix of searchEnginePrefixes) {
    if (lower.startsWith(prefix)) return { name: prefix.trim(), type: "search-engine" }
  }
  for (const prefix of browserPrefixes) {
    if (lower.startsWith(prefix)) return { name: prefix.trim(), type: "browser" }
  }
  return null
}
function AliOnePromo({ query }: { query: string }) {
  const detected = isCompetitorQuery(query)!
  const isBrowser = detected.type === "browser"
  const logo = isBrowser ? "/logo.png" : "/AliSearch.png"
  const logoAlt = isBrowser ? "AliBrowser" : "AliSearch"
  const productName = isBrowser ? "AliBrowser" : "AliSearch"

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-6 overflow-hidden rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/5 via-primary/[0.02] to-transparent p-6 shadow-sm dark:from-primary/10"
    >
      <div className="flex items-start gap-4">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl shadow-md">
          <Image
            src={logo}
            alt={logoAlt}
            fill
            className="object-contain"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-foreground">
            Why use {detected.name}? Use{" "}
            <span className="text-primary">{productName}</span> —{" "}
            <span className="text-primary/80">secure & privacy first</span>
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Built by <strong>AliOne</strong> — a privacy-first ecosystem. No tracking, no profiling, completely free.
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            {[
              { label: "AliBrowser", desc: "Privacy browser", icon: "/logo.png" },
              { label: "AliMail", desc: "Secure email" },
              { label: "AliSearch", desc: "Private search", icon: "/AliSearch.png" },
            ].map((item) => (
              <span
                key={item.label}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
              >
                {item.icon && (
                  <span className="relative h-3.5 w-3.5">
                    <Image src={item.icon} alt="" fill className="object-contain" />
                  </span>
                )}
                {item.label}
                <span className="text-primary/60">·</span>
                <span className="font-normal text-primary/70">{item.desc}</span>
              </span>
            ))}
          </div>
          <a
            href="https://alione.cc"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary transition-colors hover:text-primary/80"
          >
            Discover more at alione.cc →
          </a>
        </div>
      </div>
    </motion.div>
  )
}

function EmptyState({ query, isCompetitor }: { query: string; isCompetitor: { name: string; type: string } | null }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
        <svg
          className="h-8 w-8 text-muted-foreground/50"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-foreground">No results found</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        {isCompetitor
          ? `${isCompetitor.name.charAt(0).toUpperCase() + isCompetitor.name.slice(1)} doesn't return results here. But you don't need it — AliSearch keeps your searches private.`
          : `We couldn't find anything for "${query}". Try different keywords.`}
      </p>
      {!isCompetitor && (
        <div className="mt-6 flex flex-col items-center gap-3">
          <p className="text-xs text-muted-foreground/50">
            Discover privacy-first alternatives from AliOne
          </p>
          <a
            href="https://alione.cc"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-xs font-medium text-muted-foreground transition-all duration-200 hover:border-primary/30 hover:text-foreground hover:shadow-sm"
          >
            <div className="relative h-4 w-4">
              <Image
                src="/AliSearch.png"
                alt="AliOne"
                fill
                className="object-contain"
              />
            </div>
            Explore AliOne ecosystem
          </a>
        </div>
      )}
    </div>
  )
}

interface InfoData {
  title: string
  description: string
  extract: string
  thumbnail: string | null
  url: string
  infobox: { label: string; value: string }[]
}

export function SearchResults({ query }: SearchResultsProps) {
  const [activeTab, setActiveTab] = useState<string>("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [safeSearch, setSafeSearch] = useState("1")
  const [language, setLanguage] = useState("auto")
  const [info, setInfo] = useState<InfoData | null>(null)
  const [infoLoading, setInfoLoading] = useState(false)
  const [infoError, setInfoError] = useState(false)
  const observerRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const queryRef = useRef(query)
  const tabRef = useRef(activeTab)
  const safeRef = useRef(safeSearch)
  const langRef = useRef(language)

  queryRef.current = query
  tabRef.current = activeTab
  safeRef.current = safeSearch
  langRef.current = language

  useEffect(() => {
    function getCookie(name: string) {
      const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))
      return match ? decodeURIComponent(match[2]) : null
    }
    setSafeSearch(getCookie("alisearch-safesearch") || "1")
    setLanguage(getCookie("alisearch-language") || "auto")
  }, [])

  function setCookie(name: string, value: string, days = 365) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString()
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`
  }

  const handleSafeSearch = (value: string) => {
    setSafeSearch(value)
    setCookie("alisearch-safesearch", value)
  }

  const handleLanguage = (value: string) => {
    setLanguage(value)
    setCookie("alisearch-language", value)
  }

  const isCompetitor = isCompetitorQuery(query)

  const fetchResults = useCallback(
    async (pageNum: number, append: boolean) => {
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      if (append) {
        setIsLoadingMore(true)
      } else {
        setIsLoading(true)
      }
      setError(null)

      const params = new URLSearchParams({
        q: queryRef.current.trim(),
        page: String(pageNum),
        safe_search: safeRef.current,
        language: langRef.current,
      })
      if (tabRef.current) params.set("category", tabRef.current)

      try {
        const res = await fetch(`/api/search?${params.toString()}`, {
          signal: controller.signal,
        })
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body.error || `Request failed (${res.status})`)
        }
        const data = await res.json()
        const newResults: SearchResult[] = data.results || []

        if (append) {
          setResults((prev) => [...prev, ...newResults])
        } else {
          setResults(newResults)
        }
        setHasMore(newResults.length > 0)
        setPage(pageNum)
      } catch (err: any) {
        if (err.name === "AbortError") return
        setError(err.message)
      } finally {
        setIsLoading(false)
        setIsLoadingMore(false)
      }
    },
    []
  )

  useEffect(() => {
    if (activeTab === "") {
      setInfo(null)
      setInfoError(false)
      setInfoLoading(true)
      const controller = new AbortController()
      fetch(`/api/info?q=${encodeURIComponent(query)}&lang=${langRef.current}`, { signal: controller.signal })
        .then((res) => res.json())
        .then((data) => {
          if (data.info) setInfo(data.info)
          else setInfoError(true)
        })
        .catch(() => {})
        .finally(() => setInfoLoading(false))
      setIsLoading(true)
      setResults([])
      setPage(1)
      setHasMore(true)
      setIsLoadingMore(false)
      fetchResults(1, false)
      return
    }
    setIsLoading(true)
    setResults([])
    setPage(1)
    setHasMore(true)
    setIsLoadingMore(false)
    fetchResults(1, false)
  }, [query, activeTab, fetchResults])

  useEffect(() => {
    const el = observerRef.current
    if (!el || !hasMore || isLoading || isLoadingMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          fetchResults(page + 1, true)
        }
      },
      { rootMargin: "400px" }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [hasMore, isLoading, isLoadingMore, page, fetchResults])

  const renderResults = () => {
    const validResults = results.filter((r) => r.title && r.url)

    if (activeTab === "images") {
      const imageResults = validResults.map((r) => ({
        url: r.url,
        title: r.title,
        imgSrc: r.img_src || "",
        thumbnailSrc: r.thumbnail_src,
        source: r.source || r.engine,
        resolution: r.resolution,
      }))
      return (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {imageResults.map((r, i) => (
              <ImageCard
                key={`${r.url}-${i}`}
                rank={i}
                title={r.title}
                url={r.url}
                imgSrc={r.imgSrc}
                thumbnailSrc={r.thumbnailSrc}
                resolution={r.resolution}
                source={r.source}
                onOpen={() => {
                  setLightboxIndex(i)
                  setLightboxOpen(true)
                }}
              />
            ))}
          </div>
          {lightboxOpen && (
            <ImageLightbox
              images={imageResults}
              currentIndex={lightboxIndex}
              onClose={() => setLightboxOpen(false)}
              onPrev={() => setLightboxIndex((i) => (i > 0 ? i - 1 : imageResults.length - 1))}
              onNext={() => setLightboxIndex((i) => (i < imageResults.length - 1 ? i + 1 : 0))}
            />
          )}
        </>
      )
    }

    if (activeTab === "videos") {
      return (
        <div className="space-y-4">
          {validResults.map((r, i) => (
            <VideoCard
              key={`${r.url}-${i}`}
              rank={i}
              title={r.title}
              url={r.url}
              description={r.content}
              length={r.length}
              thumbnail={r.thumbnail || r.thumbnail_src}
              source={r.source || r.engine}
              publishedDate={r.publishedDate}
            />
          ))}
        </div>
      )
    }

    return (
      <div className="space-y-3">
        {isCompetitor && <AliOnePromo query={query} />}
        {validResults.map((r, i) => (
          <SearchCard
            key={`${r.url}-${i}`}
            rank={i}
            title={r.title}
            url={r.url}
            description={r.content || r.description || ""}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1 rounded-2xl bg-muted/30 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-current={activeTab === tab.id ? "page" : undefined}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <SearchSettings
          safeSearch={safeSearch}
          language={language}
          onSafeSearchChange={handleSafeSearch}
          onLanguageChange={handleLanguage}
        />
      </div>

      {(() => {
        const showSidebar = activeTab === "" && info && !infoError

        return (
          <div className={showSidebar ? "flex flex-col gap-6 lg:flex-row" : ""}>
            <div className="min-w-0 flex-1">
              {isLoading ? (
                activeTab === "images" ? (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-border/50 bg-card">
                        <div className="aspect-[4/3] bg-muted" />
                        <div className="space-y-2 p-3">
                          <div className="h-3 w-3/4 rounded-full bg-muted" />
                          <div className="h-2 w-1/2 rounded-full bg-muted" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : activeTab === "videos" ? (
                  <div className="space-y-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="animate-pulse rounded-2xl border border-border/50 bg-card p-4">
                        <div className="flex gap-4">
                          <div className="aspect-video h-24 shrink-0 rounded-xl bg-muted sm:h-28" />
                          <div className="flex-1 space-y-2">
                            <div className="h-4 w-3/4 rounded-full bg-muted" />
                            <div className="h-3 w-1/3 rounded-full bg-muted" />
                            <div className="h-3 w-1/2 rounded-full bg-muted" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <SearchSkeleton />
                )
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
                    <svg className="h-8 w-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Search unavailable</h3>
                  <p className="mt-1 max-w-md text-sm text-muted-foreground">{error}</p>
                </div>
              ) : results.length === 0 ? (
                <EmptyState query={query} isCompetitor={isCompetitor} />
              ) : (
                <div>
                  {showSidebar ? (
                    renderResults()
                  ) : (
                    <>
                      {activeTab !== "images" && (
                        <div className="mb-5 flex items-center gap-2 text-xs text-muted-foreground/60">
                          <span className="rounded-lg bg-muted/50 px-2.5 py-1 font-medium text-muted-foreground/70">Page {page}</span>
                          <span className="text-muted-foreground/20">&middot;</span>
                          <span>{results.length} result{results.length !== 1 ? "s" : ""}</span>
                          <span className="hidden sm:inline text-muted-foreground/20">&middot;</span>
                          <span className="hidden sm:inline truncate">&ldquo;{query}&rdquo;{activeTab && ` in ${tabs.find((t) => t.id === activeTab)?.label.toLowerCase()}`}</span>
                        </div>
                      )}
                      {renderResults()}
                    </>
                  )}
                  <div ref={observerRef} className="h-4" />
                  {isLoadingMore && (
                    <div className="flex items-center justify-center py-8">
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        Loading more...
                      </div>
                    </div>
                  )}
                  {!hasMore && results.length > 0 && (
                    <p className="py-8 text-center text-sm text-muted-foreground/50">You&apos;ve reached the end of the results.</p>
                  )}
                </div>
              )}
            </div>

            {showSidebar && (
              <div className="w-full shrink-0 lg:w-80 xl:w-96">
                {!info || infoError ? null : (
                  <InfoCard info={info} />
                )}
              </div>
            )}
          </div>
        )
      })()}
    </div>
  )
}
