"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Pill, Menu, X, Volume2, VolumeX, Heart } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useVoice } from "@/lib/hooks"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Home" },
  { href: "/upload", label: "Upload" },
  { href: "/history", label: "History" },
  { href: "/refills", label: "Refills" },
  { href: "/caregiver", label: "Caregiver" },
  { href: "/settings", label: "Settings" },
]

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { speak, stop, isSpeaking } = useVoice()

  if (pathname === "/") return null

  const speakCurrentPage = () => {
    const currentItem = navItems.find((item) => item.href === pathname)
    if (currentItem) {
      speak(`You are on the ${currentItem.label} page`)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <Pill className="h-7 w-7 text-primary-foreground" />
            <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-success">
              <Heart className="h-3 w-3 text-success-foreground" />
            </div>
          </div>
          <span className="text-2xl font-bold text-foreground">MedVibe</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-2 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-4 py-3 text-lg font-medium rounded-lg transition-colors",
                pathname === item.href ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={isSpeaking ? stop : speakCurrentPage}
            className="hidden bg-transparent sm:flex"
            aria-label={isSpeaking ? "Stop speaking" : "Speak page name"}
          >
            {isSpeaking ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="bg-transparent lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="border-t border-border bg-background p-4 lg:hidden">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "px-4 py-4 text-xl font-medium rounded-lg transition-colors",
                  pathname === item.href ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary",
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
