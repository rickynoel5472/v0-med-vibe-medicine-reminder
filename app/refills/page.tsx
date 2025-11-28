"use client"

import { useState } from "react"
import { Package, AlertTriangle, Plus, Check, ShoppingCart, ExternalLink } from "lucide-react"
import { LargeButton } from "@/components/ui/large-button"
import { MedVibeCard } from "@/components/ui/medvibe-card"
import { Modal } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { VoiceControls } from "@/components/voice-controls"
import { medicines } from "@/lib/mock-data"
import { updateInventory } from "@/lib/api"
import { useVoice } from "@/lib/hooks"

const pharmacyOptions = [
  { name: "Netmeds", url: "https://www.netmeds.com", color: "#1aab8a" },
  { name: "PharmEasy", url: "https://pharmeasy.in", color: "#10847e" },
  { name: "1mg", url: "https://www.1mg.com", color: "#ff6f61" },
  { name: "Apollo Pharmacy", url: "https://www.apollopharmacy.in", color: "#002d5b" },
  { name: "Amazon Pharmacy", url: "https://www.amazon.in/pharmacy", color: "#ff9900" },
]

export default function RefillsPage() {
  const { speak } = useVoice()
  const [inventory, setInventory] = useState(
    medicines.map((med) => ({
      ...med,
      daysRemaining: Math.floor(med.remainingPills / med.pillsPerDose / med.times.length),
      needsRefill: med.remainingPills <= med.refillThreshold,
    })),
  )
  const [selectedMedicine, setSelectedMedicine] = useState<(typeof inventory)[0] | null>(null)
  const [showRefillModal, setShowRefillModal] = useState(false)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [orderMedicine, setOrderMedicine] = useState<(typeof inventory)[0] | null>(null)
  const [pillsToAdd, setPillsToAdd] = useState("")

  const lowStockMeds = inventory.filter((m) => m.needsRefill)
  const voiceText =
    lowStockMeds.length > 0
      ? `Alert! ${lowStockMeds.length} medicine${lowStockMeds.length !== 1 ? "s" : ""} running low. ${lowStockMeds.map((m) => `${m.name} has ${m.daysRemaining} days left`).join(". ")}`
      : "All your medicines are well stocked."

  const handleAddPills = async () => {
    if (selectedMedicine && pillsToAdd) {
      const added = Number.parseInt(pillsToAdd)
      await updateInventory(selectedMedicine.id, added)

      setInventory((prev) =>
        prev.map((m) => {
          if (m.id === selectedMedicine.id) {
            const newRemaining = m.remainingPills + added
            return {
              ...m,
              remainingPills: newRemaining,
              daysRemaining: Math.floor(newRemaining / m.pillsPerDose / m.times.length),
              needsRefill: newRemaining <= m.refillThreshold,
            }
          }
          return m
        }),
      )

      speak(`Added ${added} pills to ${selectedMedicine.name}`)
      setShowRefillModal(false)
      setPillsToAdd("")
      setSelectedMedicine(null)
    }
  }

  const handleOrderClick = (medicine: (typeof inventory)[0]) => {
    setOrderMedicine(medicine)
    setShowOrderModal(true)
  }

  const handlePharmacyClick = (pharmacyUrl: string, medicineName: string) => {
    // Open pharmacy site with search query for the medicine
    const searchUrl = `${pharmacyUrl}/search/all?name=${encodeURIComponent(medicineName)}`
    window.open(searchUrl, "_blank", "noopener,noreferrer")
    speak(`Opening pharmacy to order ${medicineName}`)
    setShowOrderModal(false)
    setOrderMedicine(null)
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-secondary">
          <Package className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">Refill Alerts</h1>
        <p className="mt-2 text-xl text-muted-foreground">Monitor your medicine inventory</p>
      </div>

      <VoiceControls textToSpeak={voiceText} className="mb-8" />

      {/* Low Stock Alert */}
      {lowStockMeds.length > 0 && (
        <div className="mb-8 rounded-2xl border-4 border-destructive bg-destructive/5 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-destructive">
              <AlertTriangle className="h-8 w-8 text-destructive-foreground" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">
                {lowStockMeds.length} Medicine{lowStockMeds.length !== 1 ? "s" : ""} Running Low
              </p>
              <p className="text-lg text-muted-foreground">Order refills soon to avoid missing doses</p>
            </div>
          </div>
        </div>
      )}

      {/* Inventory List */}
      <div className="space-y-4">
        {inventory.map((medicine) => {
          const stockPercentage = (medicine.remainingPills / medicine.totalPills) * 100

          return (
            <MedVibeCard key={medicine.id} className={medicine.needsRefill ? "border-destructive" : ""}>
              <div className="flex items-start gap-4">
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-xl"
                  style={{ backgroundColor: medicine.color }}
                >
                  <Package className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xl font-bold text-foreground">{medicine.name}</p>
                      <p className="text-base text-muted-foreground">{medicine.dosage}</p>
                    </div>
                    {medicine.needsRefill && (
                      <span className="rounded-lg bg-destructive px-3 py-1 text-sm font-medium text-destructive-foreground">
                        Low Stock
                      </span>
                    )}
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-base text-muted-foreground">Pills Remaining</p>
                      <p className="text-2xl font-bold text-foreground">
                        {medicine.remainingPills}{" "}
                        <span className="text-lg text-muted-foreground">/ {medicine.totalPills}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-base text-muted-foreground">Days Left</p>
                      <p
                        className={`text-2xl font-bold ${
                          medicine.daysRemaining <= 3
                            ? "text-destructive"
                            : medicine.daysRemaining <= 7
                              ? "text-warning"
                              : "text-success"
                        }`}
                      >
                        {medicine.daysRemaining} days
                      </p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4">
                    <div className="h-4 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className={`h-full rounded-full transition-all ${
                          stockPercentage <= 20 ? "bg-destructive" : stockPercentage <= 40 ? "bg-warning" : "bg-success"
                        }`}
                        style={{ width: `${stockPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <LargeButton
                      variant="primary"
                      icon={Plus}
                      onClick={() => {
                        setSelectedMedicine(medicine)
                        setShowRefillModal(true)
                      }}
                      className="flex-1 !min-h-[56px] !py-3"
                    >
                      Add Pills
                    </LargeButton>
                    <LargeButton
                      variant="secondary"
                      icon={ShoppingCart}
                      className="flex-1 !min-h-[56px] !py-3"
                      onClick={() => handleOrderClick(medicine)}
                    >
                      Order
                    </LargeButton>
                  </div>
                </div>
              </div>
            </MedVibeCard>
          )
        })}
      </div>

      {/* Add Pills Modal */}
      <Modal
        isOpen={showRefillModal}
        onClose={() => {
          setShowRefillModal(false)
          setSelectedMedicine(null)
          setPillsToAdd("")
        }}
        title="Add Pills"
        description={selectedMedicine ? `Update inventory for ${selectedMedicine.name}` : ""}
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="pills-count" className="text-lg">
              Number of Pills to Add
            </Label>
            <Input
              id="pills-count"
              type="number"
              value={pillsToAdd}
              onChange={(e) => setPillsToAdd(e.target.value)}
              placeholder="e.g., 30"
              className="h-14 text-lg"
            />
          </div>

          <div className="flex gap-4">
            <LargeButton
              variant="secondary"
              onClick={() => {
                setShowRefillModal(false)
                setSelectedMedicine(null)
                setPillsToAdd("")
              }}
              className="flex-1"
            >
              Cancel
            </LargeButton>
            <LargeButton variant="success" icon={Check} onClick={handleAddPills} className="flex-1">
              Add
            </LargeButton>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showOrderModal}
        onClose={() => {
          setShowOrderModal(false)
          setOrderMedicine(null)
        }}
        title="Order Medicine"
        description={orderMedicine ? `Choose a pharmacy to order ${orderMedicine.name}` : "Select a pharmacy"}
      >
        <div className="space-y-4">
          <div className="rounded-xl bg-secondary/50 p-4 mb-6">
            <p className="text-lg font-semibold text-foreground">{orderMedicine?.name}</p>
            <p className="text-muted-foreground">{orderMedicine?.dosage}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Suggested quantity:{" "}
              {orderMedicine ? Math.max(30, orderMedicine.totalPills - orderMedicine.remainingPills) : 30} pills
            </p>
          </div>

          <p className="text-base font-medium text-foreground mb-3">Select Pharmacy:</p>

          <div className="grid gap-3">
            {pharmacyOptions.map((pharmacy) => (
              <button
                key={pharmacy.name}
                onClick={() => handlePharmacyClick(pharmacy.url, orderMedicine?.name || "")}
                className="flex items-center justify-between p-4 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: pharmacy.color }}
                  >
                    {pharmacy.name[0]}
                  </div>
                  <span className="text-lg font-medium text-foreground">{pharmacy.name}</span>
                </div>
                <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <LargeButton
              variant="secondary"
              onClick={() => {
                setShowOrderModal(false)
                setOrderMedicine(null)
              }}
              className="w-full"
            >
              Cancel
            </LargeButton>
          </div>
        </div>
      </Modal>
    </div>
  )
}
