"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion } from "framer-motion"
import { Languages, ArrowRightLeft, Copy, Volume2, Check, Loader2 } from "lucide-react"

const languages: { code: string; name: string }[] = [
  { code: "tr", name: "Turkish" },
  { code: "en", name: "English" },
  { code: "de", name: "German" },
  { code: "fr", name: "French" },
  { code: "es", name: "Spanish" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Chinese" },
  { code: "ar", name: "Arabic" },
  { code: "nl", name: "Dutch" },
  { code: "pl", name: "Polish" },
  { code: "sv", name: "Swedish" },
  { code: "da", name: "Danish" },
  { code: "fi", name: "Finnish" },
  { code: "el", name: "Greek" },
  { code: "he", name: "Hebrew" },
  { code: "hi", name: "Hindi" },
  { code: "th", name: "Thai" },
  { code: "vi", name: "Vietnamese" },
  { code: "id", name: "Indonesian" },
  { code: "ms", name: "Malay" },
  { code: "cs", name: "Czech" },
  { code: "hu", name: "Hungarian" },
  { code: "ro", name: "Romanian" },
  { code: "uk", name: "Ukrainian" },
  { code: "bn", name: "Bengali" },
  { code: "no", name: "Norwegian" },
]

const langMap: Record<string, string> = {
  turkish: "tr", türkçe: "tr", turkce: "tr",
  english: "en", İngilizce: "en", ingilizce: "en",
  german: "de", almanca: "de",
  french: "fr", fransızca: "fr",
  spanish: "es", İspanyolca: "es", ispanyolca: "es",
  italian: "it", İtalyanca: "it", italyanca: "it",
  portuguese: "pt", portekizce: "pt",
  russian: "ru", rusça: "ru",
  japanese: "ja", japonca: "ja",
  korean: "ko", korece: "ko",
  chinese: "zh", çince: "zh", since: "zh",
  arabic: "ar", arapça: "ar",
  dutch: "nl", hollandaca: "nl",
  polish: "pl", lehçe: "pl",
  swedish: "sv", İsveççe: "sv", isvecce: "sv",
  danish: "da", danca: "da",
  finnish: "fi", fince: "fi",
  greek: "el", yunanca: "el",
  hebrew: "he", İbranice: "he", ibranice: "he",
  hindi: "hi", hintçe: "hi", hintce: "hi",
  thai: "th", tayca: "th",
  vietnamese: "vi", vietnamca: "vi",
  indonesian: "id", endonezce: "id",
  malay: "ms", malezyaca: "ms",
  czech: "cs", çekçe: "cs",
  hungarian: "hu", macarca: "hu",
  romanian: "ro", rumence: "ro",
  ukrainian: "uk", ukraynaca: "uk",
  bengali: "bn", bengalce: "bn",
  norwegian: "no", norveççe: "no",
}

function codeToName(code: string): string {
  return languages.find((l) => l.code === code)?.name || code
}

function findLangCode(name: string): string | null {
  const lower = name.toLowerCase().trim()
  if (langMap[lower]) return langMap[lower]
  const match = languages.find((l) => l.name.toLowerCase() === lower)
  return match?.code || null
}

interface ParsedTranslate {
  text: string
  fromLang: string
  toLang: string
  fromCode: string
  toCode: string
}

function parseTranslateQuery(q: string): ParsedTranslate | null {
  const lower = q.trim().toLowerCase()

  const patterns: RegExp[] = [
    /^(?:translate|çevir|çeviri)\s+(.+?)\s+(?:to|into|->|→|dan|den|a|ya|ye|e)\s+(.+)$/i,
    /^(?:translate|çevir|çeviri)\s+(.+?)\s+(?:to|into|->|→)\s+(.+)$/i,
    /^(.+?)\s+(?:in|anlamı|anlami|meaning|ne demek|nedir|nasıl söylenir|how to say)\s+(.+)$/i,
    /^(.+?)\s+(?:meaning in|nasıl|ne demek)\s+(.+)$/i,
    /^"(.+?)"\s+(?:in|to|->)\s+(.+)$/i,
    /^(?:how to say|nasıl denir|nasıl söylenir)\s+(.+?)\s+(?:in|on)\s+(.+)$/i,
  ]

  for (const pattern of patterns) {
    const match = q.match(pattern)
    if (match) {
      const text = match[1].trim()
      const targetLang = match[2].trim()
      const toCode = findLangCode(targetLang)
      if (toCode && text.length < 500) {
        return {
          text,
          fromLang: "auto",
          toLang: codeToName(toCode),
          fromCode: "auto",
          toCode,
        }
      }
    }
  }

  return null
}

export function parseTranslationQuery(q: string) {
  return parseTranslateQuery(q)
}

interface TranslateCardProps {
  query: string
}

export function TranslateCard({ query }: TranslateCardProps) {
  const parsed = parseTranslateQuery(query)
  const [sourceText, setSourceText] = useState(parsed?.text || query)
  const [translated, setTranslated] = useState("")
  const [loading, setLoading] = useState(false)
  const [fromCode, setFromCode] = useState(parsed?.fromCode || "auto")
  const [toCode, setToCode] = useState(parsed?.toCode || "en")
  const [copied, setCopied] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const translate = useCallback(async (text: string, from: string, to: string) => {
    if (!text.trim()) return
    setLoading(true)
    try {
      const res = await fetch(
        `https://lingva.scrool.dev/api/v1/${from}/${to}/${encodeURIComponent(text)}`
      )
      if (!res.ok) throw new Error("Translation failed")
      const data = await res.json()
      setTranslated(data.translation || "")
    } catch {
      try {
        const res = await fetch(
          `https://translate.terraprint.co/translate?text=${encodeURIComponent(text)}&source=${from}&target=${to}`
        )
        if (!res.ok) throw new Error("Translation failed")
        const data = await res.json()
        setTranslated(data.translatedText || "")
      } catch {
        setTranslated("[Translation unavailable]")
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      translate(sourceText, fromCode, toCode)
    }, 400)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [sourceText, fromCode, toCode, translate])

  const swapLanguages = () => {
    const newFrom = toCode
    const newTo = fromCode === "auto" ? "en" : fromCode
    setFromCode(newFrom)
    setToCode(newTo)
    setSourceText(translated)
  }

  const copyTranslation = () => {
    navigator.clipboard.writeText(translated)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const speakTranslation = () => {
    if ("speechSynthesis" in window && translated) {
      const utterance = new SpeechSynthesisUtterance(translated)
      utterance.lang = toCode
      speechSynthesis.speak(utterance)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-6 overflow-hidden rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent shadow-sm"
    >
      <div className="flex items-center gap-2 border-b border-border/50 px-4 py-3">
        <Languages className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium text-foreground">Translator</span>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <select
              value={fromCode}
              onChange={(e) => setFromCode(e.target.value)}
              className="rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="auto">Detect language</option>
              {languages.map((l) => (
                <option key={l.code} value={l.code}>{l.name}</option>
              ))}
            </select>
            <button
              onClick={swapLanguages}
              disabled={fromCode === "auto"}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30"
            >
              <ArrowRightLeft className="h-4 w-4" />
            </button>
            <select
              value={toCode}
              onChange={(e) => setToCode(e.target.value)}
              className="rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code}>{l.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Enter text to translate..."
              rows={3}
              className="w-full resize-none rounded-xl border border-border/50 bg-background p-3 text-sm text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="relative">
            <div className="min-h-[4.5rem] w-full rounded-xl border border-border/50 bg-muted/30 p-3">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground/50" />
                </div>
              ) : translated ? (
                <p className="text-sm text-foreground">{translated}</p>
              ) : (
                <p className="text-sm text-muted-foreground/40">Translation...</p>
              )}
            </div>
            {translated && !loading && (
              <div className="mt-2 flex items-center gap-1">
                <button
                  onClick={copyTranslation}
                  className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </button>
                <button
                  onClick={speakTranslation}
                  className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Volume2 className="h-3.5 w-3.5" />
                  Listen
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
