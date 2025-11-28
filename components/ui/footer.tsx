"use client"

import { Pill, Phone, Mail, Heart } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Footer() {
  const pathname = usePathname()

  if (pathname === "/") return null

  return (
    <footer className="border-t border-border bg-card py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Pill className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">MedVibe</span>
          </div>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
            <a href="tel:+1-800-MEDVIBE" className="flex items-center gap-2 text-lg text-foreground hover:text-primary">
              <Phone className="h-5 w-5" />
              <span>1-800-MEDVIBE</span>
            </a>
            <a
              href="mailto:help@medvibe.app"
              className="flex items-center gap-2 text-lg text-foreground hover:text-primary"
            >
              <Mail className="h-5 w-5" />
              <span>help@medvibe.app</span>
            </a>
          </div>

          <div className="flex gap-6 text-lg">
            <Link href="/settings" className="text-muted-foreground hover:text-foreground">
              Settings
            </Link>
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              About
            </Link>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-2 text-base text-muted-foreground">
              <span>Built with</span>
              <Heart className="h-4 w-4 text-destructive" />
              <span>for Hackathon 2024</span>
            </div>
            <p className="text-sm text-muted-foreground">
              MedVibe - Empowering elderly patients to manage their health
            </p>
            <p className="text-xs text-muted-foreground">Always consult your healthcare provider for medical advice</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
