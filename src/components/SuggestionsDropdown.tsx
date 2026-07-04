"use client"

import { Search, Clock, TrendingUp, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface SuggestionsDropdownProps {
  suggestions: string[]
  recentSearches: string[]
  isOpen: boolean
  onSelect: (suggestion: string) => void
  onRemoveRecent: (term: string) => void
  onClearRecent: () => void
  highlightIndex: number
}

export function SuggestionsDropdown({
  suggestions,
  recentSearches,
  isOpen,
  onSelect,
  onRemoveRecent,
  onClearRecent,
  highlightIndex,
}: SuggestionsDropdownProps) {
  if (!isOpen) return null

  const showRecent = suggestions.length === 0 && recentSearches.length > 0
  const showSuggestions = suggestions.length > 0

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border bg-popover p-2 shadow-2xl"
          role="listbox"
          aria-label="Search suggestions"
        >
          {showRecent && (
            <div>
              <div className="flex items-center justify-between px-3 py-2">
                <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  Recent searches
                </span>
                <button
                  onClick={onClearRecent}
                  className="text-xs text-muted-foreground/60 transition-colors hover:text-destructive"
                  aria-label="Clear all recent searches"
                >
                  Clear all
                </button>
              </div>
              {recentSearches.map((term, i) => (
                <div
                  key={term}
                  className={`group flex items-center rounded-xl transition-colors duration-150 ${
                    i === highlightIndex
                      ? "bg-accent text-accent-foreground"
                      : "text-foreground"
                  }`}
                >
                  <button
                    onClick={() => onSelect(term)}
                    className="flex flex-1 items-center gap-3 px-3 py-2.5 text-sm"
                    role="option"
                    aria-selected={i === highlightIndex}
                  >
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{term}</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemoveRecent(term)
                    }}
                    className="mr-1 flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground/40 opacity-0 transition-all duration-150 hover:bg-muted hover:text-muted-foreground group-hover:opacity-100"
                    aria-label={`Remove "${term}" from recent searches`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {showSuggestions && (
            <div>
              <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-muted-foreground">
                <TrendingUp className="h-3 w-3" />
                Suggestions
              </div>
              {suggestions.map((term, i) => (
                <button
                  key={term}
                  onClick={() => onSelect(term)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors duration-150 ${
                    i === highlightIndex
                      ? "bg-accent text-accent-foreground"
                      : "text-foreground hover:bg-muted"
                  }`}
                  role="option"
                  aria-selected={i === highlightIndex}
                >
                  <Search className="h-4 w-4 text-muted-foreground" />
                  {term}
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
