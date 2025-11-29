"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { LargeButton } from "@/components/ui/large-button"
import { VoiceControls } from "@/components/voice-controls"
import { Check, Edit2, Pill, Plus, Trash2, User, LogOut, Clock, Calendar } from "lucide-react"
import type { Medicine } from "@/lib/types"

interface UserData {
  name: string
  email: string
  isLoggedIn: boolean
  createdAt: string
}

const defaultMedicines: Medicine[] = [
  {
    id: "user-med-1",
    name: "Metformin",
    dosage: "500mg",
    frequency: "twice daily",
    times: ["08:00", "20:00"],
    color: "#2563eb",
    instructions: "Take with meals",
    remainingPills: 60,
    totalPills: 60,
    refillThreshold: 10,
  },
  {
    id: "user-med-2",
    name: "Lisinopril",
    dosage: "10mg",
    frequency: "once daily",
    times: ["09:00"],
    color: "#16a34a",
    instructions: "Take in the morning",
    remainingPills: 30,
    totalPills: 30,
    refillThreshold: 7,
  },
]

export default function UserReviewPage() {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Medicine>>({})

  useEffect(() => {
    const storedUser = sessionStorage.getItem("userData")
    if (!storedUser) {
      router.push("/login")
      return
    }
    setUserData(JSON.parse(storedUser))

    // Get medicines from upload or use defaults
    const storedMeds = sessionStorage.getItem("userMedicines")
    if (storedMeds) {
      setMedicines(JSON.parse(storedMeds))
    } else {
      setMedicines(defaultMedicines)
    }
  }, [router])

  const handleEdit = (medicine: Medicine) => {
    setEditingId(medicine.id)
    setEditForm(medicine)
  }

  const handleSaveEdit = () => {
    if (editingId && editForm) {
      setMedicines((prev) => prev.map((m) => (m.id === editingId ? { ...m, ...editForm } : m)))
      setEditingId(null)
      setEditForm({})
    }
  }

  const handleDelete = (id: string) => {
    setMedicines((prev) => prev.filter((m) => m.id !== id))
  }

  const handleContinue = () => {
    sessionStorage.setItem("userMedicines", JSON.stringify(medicines))
    router.push("/user/dashboard")
  }

  const handleLogout = () => {
    sessionStorage.removeItem("userData")
    sessionStorage.removeItem("userMedicines")
    router.push("/")
  }

  if (!userData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

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

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium text-white">{userData.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-sm text-white transition-colors hover:bg-white/10"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-3xl px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground">Review Your Medicines</h1>
          <p className="mt-2 text-xl text-muted-foreground">Confirm or edit the medicines from your prescription</p>
        </div>

        <VoiceControls
          textToSpeak={`I found ${medicines.length} medicines. Please review and edit if needed, then confirm to set up your schedule.`}
          className="mb-8"
        />

        {/* Medicines List */}
        <div className="space-y-4">
          {medicines.map((medicine) => (
            <div
              key={medicine.id}
              className="rounded-2xl border-2 border-border bg-white p-6 shadow-sm transition-all hover:shadow-md"
            >
              {editingId === medicine.id ? (
                // Edit Mode
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium">Medicine Name</label>
                      <input
                        type="text"
                        value={editForm.name || ""}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full rounded-xl border-2 border-border px-4 py-3 text-lg focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Dosage</label>
                      <input
                        type="text"
                        value={editForm.dosage || ""}
                        onChange={(e) => setEditForm({ ...editForm, dosage: e.target.value })}
                        className="w-full rounded-xl border-2 border-border px-4 py-3 text-lg focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Instructions</label>
                    <input
                      type="text"
                      value={editForm.instructions || ""}
                      onChange={(e) => setEditForm({ ...editForm, instructions: e.target.value })}
                      className="w-full rounded-xl border-2 border-border px-4 py-3 text-lg focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div className="flex gap-3">
                    <LargeButton variant="primary" icon={Check} onClick={handleSaveEdit} fullWidth>
                      Save Changes
                    </LargeButton>
                    <LargeButton variant="secondary" onClick={() => setEditingId(null)}>
                      Cancel
                    </LargeButton>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: medicine.color }}
                  >
                    <Pill className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground">
                      {medicine.name} <span className="font-normal text-muted-foreground">{medicine.dosage}</span>
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-3">
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {medicine.times.join(", ")}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {medicine.frequency}
                      </span>
                    </div>
                    {medicine.instructions && (
                      <p className="mt-2 text-sm text-muted-foreground">{medicine.instructions}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(medicine)}
                      className="rounded-xl bg-secondary p-3 text-primary transition-colors hover:bg-secondary/80"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(medicine.id)}
                      className="rounded-xl bg-destructive/10 p-3 text-destructive transition-colors hover:bg-destructive/20"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add Medicine Button */}
        <button
          onClick={() => {
            const newMed: Medicine = {
              id: `user-med-${Date.now()}`,
              name: "New Medicine",
              dosage: "100mg",
              frequency: "once daily",
              times: ["09:00"],
              color: "#6366f1",
              instructions: "",
              remainingPills: 30,
              totalPills: 30,
              refillThreshold: 7,
            }
            setMedicines([...medicines, newMed])
            setEditingId(newMed.id)
            setEditForm(newMed)
          }}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border py-6 text-lg font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <Plus className="h-6 w-6" />
          Add Another Medicine
        </button>

        {/* Continue Button */}
        <div className="mt-8">
          <LargeButton variant="primary" icon={Check} onClick={handleContinue} fullWidth>
            Confirm & Continue to Dashboard
          </LargeButton>
        </div>
      </div>
    </div>
  )
}
