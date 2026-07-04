import { NextRequest, NextResponse } from "next/server"

const SEARXNG_URL = process.env.SEARXNG_URL || "http://localhost:8080"

const categoryMap: Record<string, string> = {
  images: "images",
  news: "news",
  videos: "videos",
  music: "music",
  maps: "map",
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q")
  const cat = searchParams.get("category") || ""
  const page = parseInt(searchParams.get("page") || "1", 10)
  const safeSearch = searchParams.get("safe_search") || "1"
  const language = searchParams.get("language") || "auto"

  if (!q || !q.trim()) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 })
  }

  try {
    const searxngParams = new URLSearchParams()
    searxngParams.set("q", q.trim())
    searxngParams.set("format", "json")
    searxngParams.set("pageno", String(page))
    searxngParams.set("safe_search", safeSearch)
    if (language && language !== "auto") {
      searxngParams.set("language", language)
    }
    if (categoryMap[cat]) {
      searxngParams.set("categories", categoryMap[cat])
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 12000)

    const res = await fetch(
      `${SEARXNG_URL}/search?${searxngParams.toString()}`,
      { signal: controller.signal }
    )
    clearTimeout(timeout)

    if (!res.ok) {
      return NextResponse.json(
        { error: `SearXNG returned ${res.status}` },
        { status: 502 }
      )
    }

    const data = await res.json()

    return NextResponse.json({
      results: data.results || [],
      suggestions: data.suggestions || [],
      number_of_results: (data.results || []).length,
      unresponsive_engines: data.unresponsive_engines || [],
    })
  } catch (err: any) {
    if (err.name === "AbortError") {
      return NextResponse.json({ error: "Search timed out" }, { status: 504 })
    }
    return NextResponse.json(
      {
        error:
          "Could not connect to SearXNG. Make sure it's running on port 8080.",
      },
      { status: 502 }
    )
  }
}
