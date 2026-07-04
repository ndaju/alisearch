import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q")
  let lang = searchParams.get("lang") || "tr"

  if (lang === "auto" || lang.length > 5) lang = "tr"

  if (!q || !q.trim()) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 })
  }

  function wikiUrl(path: string) {
    const base = `https://${lang}.wikipedia.org`
    return `${base}${path.startsWith("/") ? path : "/" + path}`
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000)

  try {
    const searchRes = await fetch(
      wikiUrl(`/api/rest_v1/page/summary/${encodeURIComponent(q.trim())}`),
      { signal: controller.signal, headers: { "User-Agent": "AliSearch/1.0" } }
    )

    if (!searchRes.ok) {
      const searchUrl = wikiUrl(`/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q.trim())}&format=json&srlimit=1`)
      const searchFallback = await fetch(searchUrl, {
        signal: controller.signal,
        headers: { "User-Agent": "AliSearch/1.0" },
      })
      const searchData = await searchFallback.json()
      const pages = searchData?.query?.search
      if (!pages || pages.length === 0) {
        clearTimeout(timeout)
        return NextResponse.json({ info: null })
      }
      const title = pages[0].title
      const summaryRes = await fetch(
        wikiUrl(`/api/rest_v1/page/summary/${encodeURIComponent(title)}`),
        { signal: controller.signal, headers: { "User-Agent": "AliSearch/1.0" } }
      )
      if (!summaryRes.ok) {
        clearTimeout(timeout)
        return NextResponse.json({ info: null })
      }
      const summaryData = await summaryRes.json()
      const infobox = await fetchInfobox(title, lang)
      clearTimeout(timeout)
      return NextResponse.json({ info: formatInfo(summaryData, infobox, lang) })
    }

    const data = await searchRes.json()
    const infobox = await fetchInfobox(data.title || q.trim(), lang)
    clearTimeout(timeout)
    return NextResponse.json({ info: formatInfo(data, infobox, lang) })
  } catch {
    clearTimeout(timeout)
    return NextResponse.json({ info: null })
  }
}

async function fetchInfobox(title: string, lang: string) {
  function wikiUrl(path: string) {
    return `https://${lang}.wikipedia.org${path.startsWith("/") ? path : "/" + path}`
  }
  try {
    const keysUrl = wikiUrl(`/w/api.php?action=parse&page=${encodeURIComponent(title)}&prop=text&format=json&section=0`)
    const keysRes = await fetch(keysUrl, {
      headers: { "User-Agent": "AliSearch/1.0" },
      signal: AbortSignal.timeout(5000),
    })
    const keysData = await keysRes.json()
    const html = keysData?.parse?.text?.["*"] || ""
    return extractInfobox(html)
  } catch {
    return []
  }
}

function extractInfobox(html: string) {
  const rows: { label: string; value: string }[] = []
  const infoboxMatch = html.match(/<table[^>]*class="[^"]*infobox[^"]*"[^>]*>([\s\S]*?)<\/table>/i)
  if (!infoboxMatch) return rows

  const tableHtml = infoboxMatch[1]
  const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi
  let trMatch
  while ((trMatch = trRegex.exec(tableHtml)) !== null) {
    const trContent = trMatch[1]
    const thMatch = trContent.match(/<th[^>]*>(.*?)<\/th>/i)
    const tdMatch = trContent.match(/<td[^>]*>(.*?)<\/td>/i)
    if (thMatch && tdMatch) {
      const label = stripHtml(thMatch[1]).trim()
      const value = stripHtml(tdMatch[1]).trim()
      if (label && value && !label.includes("[")) {
        rows.push({ label, value })
      }
    }
  }
  return rows.slice(0, 12)
}

function stripHtml(str: string) {
  return str
    .replace(/<br\s*\/?>/gi, ", ")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .replace(/&#91;/g, "[")
    .replace(/&#93;/g, "]")
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(d))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .trim()
}

function decodeEntities(str: string) {
  return str
    .replace(/&#91;/g, "[")
    .replace(/&#93;/g, "]")
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(d))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
}

function formatInfo(data: any, infobox: { label: string; value: string }[], lang: string) {
  if (!data || data.type === "disambiguation" || !data.extract) return null
  return {
    title: data.title || "",
    description: data.description || "",
    extract: decodeEntities(data.extract || ""),
    thumbnail: data.thumbnail?.source || null,
    url: `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(data.title || "")}`,
    infobox: infobox.map((r) => ({
      label: decodeEntities(r.label),
      value: decodeEntities(r.value),
    })),
  }
}
