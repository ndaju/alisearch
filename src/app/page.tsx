import { Suspense } from "react"
import { HomeContent } from "@/components/HomeContent"

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  )
}
