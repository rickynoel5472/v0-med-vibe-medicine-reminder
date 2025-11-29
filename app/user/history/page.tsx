"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Pill, User, LogOut, ArrowLeft } from "lucide-react"
import { Timeline } from "@/components/ui/timeline"
import { VoiceControls } from "@/components/voice-controls"

interface UserData {
  name: string
  email: string
  isLoggedIn: boolean
  createdAt: string
}

export default function UserHistoryPage() {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)

  useEffect(() => {
    const storedUser = sessionStorage.getItem("userData")
    if (!storedUser) {
      router.push("/login")
      return
    }
    setUserData(JSON.parse(storedUser))
  }, [router])

  const handleLogout = () => {
    sessionStorage.removeItem("userData")
    sessionStorage.removeItem("userMedicines")
    sessionStorage.removeItem("userDoses")
    router.push("/")
  }

  // Mock history data
  const historyItems = [
    { id: "1", time: "08:00 AM", title: "Metformin 500mg", status: "taken" as const, date: "Today" },
    { id: "2", time: "09:00 AM", title: "Lisinopril 10mg", status: "taken" as const, date: "Today" },
    { id: "3", time: "08:00 AM", title: "Metformin 500mg", status: "taken" as const, date: "Yesterday" },
    { id: "4", time: "09:00 AM", title: "Lisinopril 10mg", status: "taken" as const, date: "Yesterday" },
    { id: "5", time: "08:00 PM", title: "Metformin 500mg", status: "skipped" as const, date: "Yesterday" },
  ]

  if (!userData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  const takenCount = historyItems.filter((h) => h.status === "taken").length
  const adherenceRate = Math.round((takenCount / historyItems.length) * 100)

  return (
    <div className="min-h-screen bg-gradient-to-b from-hero-peach-light via-white to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-navy/95 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white/80">
              <Pill className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">MedVibe</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="hidden text-sm font-medium text-white sm:block">{userData.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-3xl px-4 py-8">
        <Link
          href="/user/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-lg font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Dashboard
        </Link>

        <h1 className="mb-2 text-3xl font-bold text-foreground">Dose History</h1>
        <p className="mb-8 text-xl text-muted-foreground">Track your medication adherence</p>

        <VoiceControls
          textToSpeak={`Your adherence rate is ${adherenceRate} percent. You have taken ${takenCount} out of ${historyItems.length} doses.`}
          className="mb-8"
        />

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border-2 border-border bg-white p-6 text-center">
            <p className="text-4xl font-bold text-success">{adherenceRate}%</p>
            <p className="mt-1 text-muted-foreground">Adherence Rate</p>
          </div>
          <div className="rounded-2xl border-2 border-border bg-white p-6 text-center">
            <p className="text-4xl font-bold text-primary">{takenCount}</p>
            <p className="mt-1 text-muted-foreground">Doses Taken</p>
          </div>
          <div className="rounded-2xl border-2 border-border bg-white p-6 text-center">
            <p className="text-4xl font-bold text-destructive">{historyItems.length - takenCount}</p>
            <p className="mt-1 text-muted-foreground">Doses Missed</p>
          </div>
        </div>

        {/* Timeline */}
        <Timeline items={historyItems} />
      </div>
    </div>
  )
}
