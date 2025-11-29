"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Pill, User, LogOut, ArrowLeft, Package, AlertTriangle, ShoppingCart, ExternalLink } from "lucide-react"
import { LargeButton } from "@/components/ui/large-button"
import { VoiceControls } from "@/components/voice-controls"
import { Modal } from "@/components/ui/modal"
import type { Medicine } from "@/lib/types"

interface UserData {
  name: string
  email: string
  isLoggedIn: boolean
  createdAt: string
}

const pharmacies = [
  { name: "Netmeds", color: "#1BA9C5", url: "https://www.netmeds.com/catalogsearch/result?q=" },
  { name: "PharmEasy", color: "#10847E", url: "https://pharmeasy.in/search/all?name=" },
  { name: "1mg", color: "#FF6F61", url: "https://www.1mg.com/search/all?name=" },
  { name: "Apollo Pharmacy", color: "#003366", url: "https://www.apollopharmacy.in/search-medicines/" },
  { name: "Amazon Pharmacy", color: "#FF9900", url: "https://www.amazon.in/s?k=" },
]

export default function UserRefillsPage() {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [showPharmacyModal, setShowPharmacyModal] = useState(false)
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null)

  useEffect(() => {
    const storedUser = sessionStorage.getItem("userData")
    if (!storedUser) {
      router.push("/login")
      return
    }
    setUserData(JSON.parse(storedUser))

    const storedMeds = sessionStorage.getItem("userMedicines")
    if (storedMeds) {
      setMedicines(JSON.parse(storedMeds))
    }
  }, [router])

  const handleLogout = () => {
    sessionStorage.removeItem("userData")
    sessionStorage.removeItem("userMedicines")
    sessionStorage.removeItem("userDoses")
    router.push("/")
  }

  const handleOrder = (medicine: Medicine) => {
    setSelectedMedicine(medicine)
    setShowPharmacyModal(true)
  }

  const openPharmacy = (pharmacy: (typeof pharmacies)[0]) => {
    if (selectedMedicine) {
      window.open(`${pharmacy.url}${encodeURIComponent(selectedMedicine.name)}`, "_blank")
    }
    setShowPharmacyModal(false)
  }

  if (!userData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  const lowStockMeds = medicines.filter((m) => m.remainingPills <= m.refillThreshold)

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

        <h1 className="mb-2 text-3xl font-bold text-foreground">Refill Alerts</h1>
        <p className="mb-8 text-xl text-muted-foreground">Keep track of your medicine inventory</p>

        <VoiceControls
          textToSpeak={
            lowStockMeds.length > 0
              ? `You have ${lowStockMeds.length} medicines running low. Please consider reordering soon.`
              : "All your medicines are well stocked."
          }
          className="mb-8"
        />

        {/* Low Stock Alert */}
        {lowStockMeds.length > 0 && (
          <div className="mb-8 rounded-2xl border-2 border-warning bg-warning/10 p-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-warning" />
              <div>
                <p className="text-xl font-bold text-foreground">
                  {lowStockMeds.length} Medicine{lowStockMeds.length !== 1 ? "s" : ""} Running Low
                </p>
                <p className="text-muted-foreground">Order soon to avoid missing doses</p>
              </div>
            </div>
          </div>
        )}

        {/* All Medicines */}
        <div className="space-y-4">
          {medicines.map((medicine) => {
            const daysLeft = Math.floor(medicine.remainingPills / (medicine.times.length || 1))
            const isLow = medicine.remainingPills <= medicine.refillThreshold
            const percentage = (medicine.remainingPills / medicine.totalPills) * 100

            return (
              <div
                key={medicine.id}
                className={`rounded-2xl border-2 bg-white p-6 transition-all ${
                  isLow ? "border-warning" : "border-border"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: medicine.color }}
                  >
                    <Pill className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-foreground">{medicine.name}</h3>
                      <span className="text-muted-foreground">{medicine.dosage}</span>
                      {isLow && (
                        <span className="rounded-full bg-warning/20 px-2 py-0.5 text-xs font-medium text-warning">
                          Low Stock
                        </span>
                      )}
                    </div>

                    <div className="mt-3">
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {medicine.remainingPills} of {medicine.totalPills} pills
                        </span>
                        <span className={isLow ? "font-medium text-warning" : "text-muted-foreground"}>
                          ~{daysLeft} days left
                        </span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full transition-all ${isLow ? "bg-warning" : "bg-success"}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>

                    {isLow && (
                      <div className="mt-4">
                        <LargeButton
                          variant="primary"
                          icon={ShoppingCart}
                          onClick={() => handleOrder(medicine)}
                          className="!min-h-[48px]"
                        >
                          Order Refill
                        </LargeButton>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}

          {medicines.length === 0 && (
            <div className="rounded-2xl border-2 border-dashed border-border bg-muted/50 p-8 text-center">
              <Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium text-muted-foreground">No medicines added yet</p>
              <Link href="/user/upload" className="mt-4 inline-block text-primary hover:underline">
                Upload a prescription to get started
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Pharmacy Selection Modal */}
      <Modal isOpen={showPharmacyModal} onClose={() => setShowPharmacyModal(false)} title="Choose a Pharmacy">
        <p className="mb-6 text-muted-foreground">
          Select where you{"'"}d like to order <strong>{selectedMedicine?.name}</strong>
        </p>
        <div className="space-y-3">
          {pharmacies.map((pharmacy) => (
            <button
              key={pharmacy.name}
              onClick={() => openPharmacy(pharmacy)}
              className="flex w-full items-center justify-between rounded-xl border-2 border-border p-4 transition-all hover:border-primary hover:bg-primary/5"
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-white font-bold"
                  style={{ backgroundColor: pharmacy.color }}
                >
                  {pharmacy.name[0]}
                </div>
                <span className="text-lg font-medium">{pharmacy.name}</span>
              </div>
              <ExternalLink className="h-5 w-5 text-muted-foreground" />
            </button>
          ))}
        </div>
      </Modal>
    </div>
  )
}
