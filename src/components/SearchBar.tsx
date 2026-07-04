"use client"

import { useState, useRef, useEffect, useCallback, type KeyboardEvent } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { motion } from "framer-motion"
import { SuggestionsDropdown } from "@/components/SuggestionsDropdown"

interface SearchBarProps {
  large?: boolean
  query?: string
  autofocus?: boolean
}

const RECENT_SEARCHES_KEY = "alisearch-recent"
const MAX_RECENT = 5

const mockSuggestions = [
  "ai search engine",
  "privacy focused browser",
  "next js documentation",
  "tailwind css components",
  "framer motion examples",
  "typescript handbook",
  "react server components",
  "web performance optimization",
]

export function SearchBar({ large = false, query: initialQuery = "", autofocus = false }: SearchBarProps) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState(-1)
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (autofocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autofocus])

  useEffect(() => {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY)
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored))
      } catch {}
    }
  }, [])

  useEffect(() => {
    if (query.length > 0) {
      const filtered = mockSuggestions.filter((s) =>
        s.toLowerCase().includes(query.toLowerCase())
      )
      setSuggestions(filtered.slice(0, 5))
      setIsOpen(true)
    } else {
      setSuggestions([])
      if (recentSearches.length > 0) {
        setIsOpen(true)
      } else {
        setIsOpen(false)
      }
    }
    setHighlightIndex(-1)
  }, [query, recentSearches])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const doSearch = useCallback(
    (q: string) => {
      const trimmed = q.trim()
      if (!trimmed) return
      const updated = [trimmed, ...recentSearches.filter((s) => s !== trimmed)].slice(0, MAX_RECENT)
      setRecentSearches(updated)
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
      setIsOpen(false)
      router.push(`/search?q=${encodeURIComponent(trimmed)}`)
    },
    [recentSearches, router]
  )

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (highlightIndex >= 0) {
        const items = suggestions.length > 0 ? suggestions : recentSearches
        doSearch(items[highlightIndex])
      } else {
        doSearch(query)
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      const items = suggestions.length > 0 ? suggestions : recentSearches
      setHighlightIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      const items = suggestions.length > 0 ? suggestions : recentSearches
      setHighlightIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1))
    } else if (e.key === "Escape") {
      setIsOpen(false)
    }
  }

  const handleSuggestionSelect = (term: string) => {
    setQuery(term)
    doSearch(term)
  }

  const handleRemoveRecent = (term: string) => {
    const updated = recentSearches.filter((s) => s !== term)
    setRecentSearches(updated)
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
  }

  const handleClearRecent = () => {
    setRecentSearches([])
    localStorage.removeItem(RECENT_SEARCHES_KEY)
    setIsOpen(false)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative" ref={dropdownRef}>
        <motion.div
          initial={large ? { opacity: 0, y: 20, scale: 0.98 } : false}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className={`relative flex items-center ${
            large
              ? "h-14 md:h-16 rounded-full shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/10"
              : "h-12 rounded-full"
          } border transition-all duration-300 ${
            focused
              ? "border-primary/50 ring-2 ring-primary/20"
              : "border-input"
          } bg-background`}
        >
          <Search className={`ml-4 shrink-0 text-muted-foreground ${large ? "h-5 w-5" : "h-4 w-4"}`} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              setFocused(true)
              if (query.length > 0 || recentSearches.length > 0) setIsOpen(true)
            }}
            onBlur={() => setFocused(false)}
            placeholder="Search the web privately..."
            className="flex-1 border-0 bg-transparent px-3 text-foreground placeholder-muted-foreground/60 focus:outline-none focus:ring-0"
            aria-label="Search query"
            aria-autocomplete="list"
            aria-controls="suggestions-list"
            role="combobox"
            aria-expanded={isOpen}
          />
          <div className="pr-2" />
        </motion.div>
        <SuggestionsDropdown
          suggestions={suggestions}
          recentSearches={recentSearches}
          isOpen={isOpen}
          onSelect={handleSuggestionSelect}
          onRemoveRecent={handleRemoveRecent}
          onClearRecent={handleClearRecent}
          highlightIndex={highlightIndex}
        />
      </div>
    </div>
  )
}
