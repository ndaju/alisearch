"use client"

import { Shield, Globe } from "lucide-react"
import { useState, useRef, useEffect } from "react"

const safeLevels = [
  { value: "0", label: "Off" },
  { value: "1", label: "Moderate" },
  { value: "2", label: "Strict" },
] as const

const languages = [
  { value: "auto", label: "All languages" },
  { value: "tr", label: "Türkçe" },
  { value: "en", label: "English" },
  { value: "de", label: "Deutsch" },
  { value: "fr", label: "Français" },
  { value: "es", label: "Español" },
  { value: "it", label: "Italiano" },
  { value: "pt", label: "Português" },
  { value: "ru", label: "Русский" },
  { value: "ar", label: "العربية" },
  { value: "ja", label: "日本語" },
  { value: "ko", label: "한국어" },
  { value: "zh", label: "中文" },
] as const

interface SearchSettingsProps {
  safeSearch: string
  language: string
  onSafeSearchChange: (value: string) => void
  onLanguageChange: (value: string) => void
}

export function SearchSettings({
  safeSearch,
  language,
  onSafeSearchChange,
  onLanguageChange,
}: SearchSettingsProps) {
  const [open, setOpen] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(null)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const currentSafe = safeLevels.find((l) => l.value === safeSearch)
  const currentLang = languages.find((l) => l.value === language)
  const isSafeActive = safeSearch !== "1"

  return (
    <div ref={ref} className="relative flex items-center gap-1">
      <button
        onClick={() => setOpen(open === "safe" ? null : "safe")}
        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
          isSafeActive
            ? "bg-primary/10 text-primary shadow-sm"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        }`}
        aria-label="Safe search settings"
      >
        <Shield className={`h-3.5 w-3.5 ${isSafeActive ? "fill-primary/10" : ""}`} />
        Güvenli Arama
        {isSafeActive && (
          <span className="ml-0.5 rounded-md bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
            {currentSafe?.label}
          </span>
        )}
      </button>

      <button
        onClick={() => setOpen(open === "lang" ? null : "lang")}
        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground"
        aria-label="Search language"
      >
        <Globe className="h-3.5 w-3.5" />
        {currentLang?.label || "All languages"}
      </button>

      {open === "safe" && (
        <div className="absolute left-0 top-full z-40 mt-1.5 w-44 rounded-xl border bg-popover p-1.5 shadow-xl">
          {safeLevels.map((level) => (
            <button
              key={level.value}
              onClick={() => {
                onSafeSearchChange(level.value)
                setOpen(null)
              }}
              className={`flex w-full items-center rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                safeSearch === level.value
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              {level.label}
            </button>
          ))}
        </div>
      )}

      {open === "lang" && (
        <div className="absolute left-0 top-full z-40 mt-1.5 w-40 rounded-xl border bg-popover p-1.5 shadow-xl">
          {languages.map((lang) => (
            <button
              key={lang.value}
              onClick={() => {
                onLanguageChange(lang.value)
                setOpen(null)
              }}
              className={`flex w-full items-center rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                language === lang.value
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
