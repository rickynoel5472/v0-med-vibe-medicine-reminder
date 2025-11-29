"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Check,
  Clock,
  AlertCircle,
  Pill,
  Calendar,
  Package,
  ChevronRight,
  User,
  LogOut,
  Settings,
  Bell,
} from "lucide-react"
import { LargeButton } from "@/components/ui/large-button"
import { MedVibeCard } from "@/components/ui/medvibe-card"
import { VoiceControls } from "@/components/voice-controls"
import { Confetti } from "@/components/confetti"
import { useVoice } from "@/lib/hooks"
import type { Medicine, DoseRecord } from "@/lib/types"

interface UserData {
  name: string
  email: string
  isLoggedIn: boolean
  createdAt: string
}

export default function UserDashboardPage() {
  const router = useRouter()
  const { speak } = useVoice()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [doses, setDoses] = useState<DoseRecord[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    const storedUser = sessionStorage.getItem("userData")
    if (!storedUser) {
      router.push("/login")
      return
    }
    setUserData(JSON.parse(storedUser))

    // Get user's medicines
    const storedMeds = sessionStorage.getItem("userMedicines")
    if (storedMeds) {
      const meds: Medicine[] = JSON.parse(storedMeds)
      setMedicines(meds)

      // Generate today's doses from medicines
      const today = new Date().toISOString().split("T")[0]
      const generatedDoses: DoseRecord[] = []
      meds.forEach((med) => {
        med.times.forEach((time, idx) => {
          generatedDoses.push({
            id: `${med.id}-${today}-${idx}`,
            medicineId: med.id,
            medicineName: `${med.name} ${med.dosage}`,
            scheduledTime: time,
            status: "pending",
            date: today,
          })
        })
      })
      // Sort by time
      generatedDoses.sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime))

      // Check for stored dose statuses
      const storedDoses = sessionStorage.getItem("userDoses")
      if (storedDoses) {
        const savedDoses: DoseRecord[] = JSON.parse(storedDoses)
        generatedDoses.forEach((dose, idx) => {
          const saved = savedDoses.find((d) => d.id === dose.id)
          if (saved) {
            generatedDoses[idx] = saved
          }
        })
      }
      setDoses(generatedDoses)
    }

    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [router])

  const handleLogout = () => {
    sessionStorage.removeItem("userData")
    sessionStorage.removeItem("userMedicines")
    sessionStorage.removeItem("userDoses")
    router.push("/")
  }

  const pendingDoses = doses.filter((d) => d.status === "pending")
  const completedDoses = doses.filter((d) => d.status === "taken")
  const nextDose = pendingDoses[0]
  const lowStockMeds = medicines.filter((m) => m.remainingPills <= m.refillThreshold)

  const handleTakeDose = (dose: DoseRecord) => {
    const updatedDoses = doses.map((d) =>
      d.id === dose.id
        ? {
            ...d,
            status: "taken" as const,
            takenTime: currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
          }
        : d,
    )
    setDoses(updatedDoses)
    sessionStorage.setItem("userDoses", JSON.stringify(updatedDoses))

    // Update remaining pills
    const updatedMeds = medicines.map((m) =>
      m.id === dose.medicineId ? { ...m, remainingPills: Math.max(0, m.remainingPills - 1) } : m,
    )
    setMedicines(updatedMeds)
    sessionStorage.setItem("userMedicines", JSON.stringify(updatedMeds))

    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 100)
    speak(`${dose.medicineName} marked as taken. Great job!`)
  }

  const handleSkipDose = (dose: DoseRecord) => {
    const updatedDoses = doses.map((d) => (d.id === dose.id ? { ...d, status: "skipped" as const } : d))
    setDoses(updatedDoses)
    sessionStorage.setItem("userDoses", JSON.stringify(updatedDoses))
    speak(`${dose.medicineName} skipped.`)
  }

  if (!userData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  const voiceText = nextDose
    ? `Hello ${userData.name}. Your next medicine is ${nextDose.medicineName} at ${nextDose.scheduledTime}. You have ${pendingDoses.length} doses remaining today.`
    : `Great job ${userData.name}! You have taken all your medicines for today.`

  return (
    <div className="min-h-screen bg-gradient-to-b from-hero-peach-light via-white to-white">
      <Confetti active={showConfetti} />

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
            <Link
              href="/user/settings"
              className="rounded-lg p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Settings className="h-5 w-5" />
            </Link>
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

      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Hello, {userData.name}!</h1>
          <p className="mt-2 text-xl text-muted-foreground">
            {currentTime.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{userData.email}</p>
        </div>

        <VoiceControls textToSpeak={voiceText} className="mb-8" />

        {/* Summary Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <MedVibeCard icon={Clock} iconColor="text-warning" title="Pending">
            <p className="text-4xl font-bold text-foreground">{pendingDoses.length}</p>
          </MedVibeCard>
          <MedVibeCard icon={Check} iconColor="text-success" title="Completed">
            <p className="text-4xl font-bold text-foreground">{completedDoses.length}</p>
          </MedVibeCard>
          <MedVibeCard icon={AlertCircle} iconColor="text-destructive" title="Low Stock">
            <p className="text-4xl font-bold text-foreground">{lowStockMeds.length}</p>
          </MedVibeCard>
        </div>

        {/* Next Dose Card */}
        {nextDose && (
          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-foreground">Next Medicine</h2>
            <div className="relative overflow-hidden rounded-2xl border-4 border-primary bg-primary/5 p-6">
              <div className="absolute -right-4 -top-4 h-24 w-24 animate-pulse rounded-full bg-primary/20" />
              <div className="relative flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary">
                  <Pill className="h-10 w-10 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-2xl font-bold text-foreground">{nextDose.medicineName}</p>
                  <p className="text-xl text-muted-foreground">Scheduled: {nextDose.scheduledTime}</p>
                </div>
              </div>

              <div className="relative mt-6 flex flex-col gap-4 sm:flex-row">
                <LargeButton variant="destructive" icon={Check} onClick={() => handleTakeDose(nextDose)} fullWidth>
                  I Took This
                </LargeButton>
                <LargeButton variant="secondary" onClick={() => handleSkipDose(nextDose)} fullWidth>
                  Skip This Time
                </LargeButton>
              </div>
            </div>
          </div>
        )}

        {/* Today's Schedule */}
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-bold text-foreground">{"Today's Schedule"}</h2>
          <div className="space-y-4">
            {doses.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-border bg-muted/50 p-8 text-center">
                <Bell className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-lg font-medium text-muted-foreground">No medicines scheduled</p>
                <Link href="/user/upload" className="mt-4 inline-block text-primary hover:underline">
                  Upload a prescription to get started
                </Link>
              </div>
            ) : (
              doses.map((dose) => {
                const medicine = medicines.find((m) => m.id === dose.medicineId)
                return (
                  <div
                    key={dose.id}
                    className={`flex items-center gap-4 rounded-2xl border-2 p-4 transition-all ${
                      dose.status === "taken"
                        ? "border-success bg-success/5"
                        : dose.status === "skipped"
                          ? "border-muted bg-muted/50"
                          : "border-border bg-card"
                    }`}
                  >
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-xl"
                      style={{ backgroundColor: medicine?.color || "#2563eb" }}
                    >
                      <Pill className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-lg font-semibold text-foreground">{dose.medicineName}</p>
                      <p className="text-base text-muted-foreground">
                        {dose.scheduledTime}
                        {dose.takenTime && ` - Taken at ${dose.takenTime}`}
                      </p>
                    </div>
                    {dose.status === "pending" && (
                      <LargeButton
                        variant="destructive"
                        icon={Check}
                        onClick={() => handleTakeDose(dose)}
                        className="!min-h-[56px] !px-6 !py-3"
                      >
                        Take
                      </LargeButton>
                    )}
                    {dose.status === "taken" && (
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-success">
                        <Check className="h-8 w-8 text-success-foreground" />
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Link href="/user/history">
            <MedVibeCard icon={Calendar} title="Dose History" interactive>
              <p className="text-base text-muted-foreground">View your past medicine records</p>
              <ChevronRight className="absolute right-6 top-1/2 h-8 w-8 -translate-y-1/2 text-muted-foreground" />
            </MedVibeCard>
          </Link>
          <Link href="/user/refills">
            <MedVibeCard icon={Package} title="Refill Alerts" interactive>
              <p className="text-base text-muted-foreground">
                {lowStockMeds.length > 0
                  ? `${lowStockMeds.length} medicine${lowStockMeds.length !== 1 ? "s" : ""} running low`
                  : "All medicines well stocked"}
              </p>
              <ChevronRight className="absolute right-6 top-1/2 h-8 w-8 -translate-y-1/2 text-muted-foreground" />
            </MedVibeCard>
          </Link>
        </div>
      </div>
    </div>
  )
}
