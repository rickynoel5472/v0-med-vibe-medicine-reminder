"use client"

import { useState, useEffect } from "react"
import { Check, Clock, AlertCircle, Pill, Calendar, Package, ChevronRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { LargeButton } from "@/components/ui/large-button"
import { MedVibeCard } from "@/components/ui/medvibe-card"
import { VoiceControls } from "@/components/voice-controls"
import { Confetti } from "@/components/confetti"
import { NotificationToast } from "@/components/notification-toast"
import { todaysDoses, medicines, patients } from "@/lib/mock-data"
import { recordDose } from "@/lib/api"
import { useVoice } from "@/lib/hooks"
import type { DoseRecord } from "@/lib/types"

export default function DashboardPage() {
  const { speak } = useVoice()
  const [doses, setDoses] = useState<DoseRecord[]>(todaysDoses)
  const [currentPatient] = useState(patients[0])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showConfetti, setShowConfetti] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationData, setNotificationData] = useState({ message: "", medicineName: "" })
  const [isDemoMode, setIsDemoMode] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    // Check for demo mode
    const demoMode = sessionStorage.getItem("demoMode") === "true"
    setIsDemoMode(demoMode)

    if (demoMode) {
      const notifTimer = setTimeout(() => {
        setNotificationData({
          medicineName: "Lisinopril 10mg",
          message: "Time to take your morning medicine!",
        })
        setShowNotification(true)
      }, 3000)
      return () => {
        clearInterval(timer)
        clearTimeout(notifTimer)
      }
    }

    return () => clearInterval(timer)
  }, [])

  const pendingDoses = doses.filter((d) => d.status === "pending")
  const completedDoses = doses.filter((d) => d.status === "taken")
  const nextDose = pendingDoses[0]

  const handleTakeDose = async (dose: DoseRecord) => {
    await recordDose(dose.id, "taken")
    setDoses((prev) =>
      prev.map((d) =>
        d.id === dose.id
          ? {
              ...d,
              status: "taken",
              takenTime: currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
            }
          : d,
      ),
    )
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 100)
    speak(`${dose.medicineName} marked as taken. Great job!`)
  }

  const handleSkipDose = async (dose: DoseRecord) => {
    await recordDose(dose.id, "skipped")
    setDoses((prev) => prev.map((d) => (d.id === dose.id ? { ...d, status: "skipped" } : d)))
    speak(`${dose.medicineName} skipped.`)
  }

  const voiceText = nextDose
    ? `Hello ${currentPatient.name.split(" ")[0]}. Your next medicine is ${nextDose.medicineName} at ${nextDose.scheduledTime}. You have ${pendingDoses.length} doses remaining today.`
    : `Great job ${currentPatient.name.split(" ")[0]}! You have taken all your medicines for today.`

  const lowStockMeds = medicines.filter((m) => m.remainingPills <= m.refillThreshold)

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Confetti active={showConfetti} />

      {showNotification && (
        <NotificationToast
          message={notificationData.message}
          medicineName={notificationData.medicineName}
          onClose={() => setShowNotification(false)}
        />
      )}

      {isDemoMode && (
        <div className="mb-6 flex items-center justify-center gap-2 rounded-xl bg-primary/10 px-4 py-3">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="font-medium text-primary">Demo Mode - Explore all features!</span>
        </div>
      )}

      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Hello, {currentPatient.name.split(" ")[0]}!</h1>
        <p className="mt-2 text-xl text-muted-foreground">
          {currentTime.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </p>
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
          {doses.map((dose) => {
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
          })}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/history">
          <MedVibeCard icon={Calendar} title="Dose History" interactive>
            <p className="text-base text-muted-foreground">View your past medicine records</p>
            <ChevronRight className="absolute right-6 top-1/2 h-8 w-8 -translate-y-1/2 text-muted-foreground" />
          </MedVibeCard>
        </Link>
        <Link href="/refills">
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
  )
}
