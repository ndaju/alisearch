import Image from "next/image"
import { MotionDiv } from "@/components/MotionDiv"

export function Footer() {
  return (
    <footer className="w-full border-t bg-background/50 py-8">
      <MotionDiv
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-4 px-4 sm:flex-row sm:gap-6"
      >
        <a
          href="https://alione.cc"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 text-sm text-muted-foreground transition-all duration-300 hover:text-foreground"
        >
          <div className="relative h-5 w-5 overflow-hidden rounded transition-transform duration-300 group-hover:scale-110">
            <Image
              src="/alione.png"
              alt="AliOne"
              fill
              className="object-contain"
            />
          </div>
          <span className="font-medium">Made by AliOne</span>
        </a>
        <span className="hidden text-sm text-muted-foreground/40 sm:inline">·</span>
        <span className="text-sm text-muted-foreground/60 transition-colors hover:text-muted-foreground/80">
          Privacy First
        </span>
        <span className="hidden text-sm text-muted-foreground/40 sm:inline">·</span>
        <span className="text-sm text-muted-foreground/60">© 2026 AliSearch</span>
      </MotionDiv>
    </footer>
  )
}
