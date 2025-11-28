"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Pencil, Trash2, Plus, Check, X, Pill } from "lucide-react"
import { LargeButton } from "@/components/ui/large-button"
import { MedVibeCard } from "@/components/ui/medvibe-card"
import { Modal } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { VoiceControls } from "@/components/voice-controls"
import { medicines as defaultMedicines } from "@/lib/mock-data"
import type { Medicine } from "@/lib/types"

export default function ReviewPage() {
  const router = useRouter()
  const [medicineList, setMedicineList] = useState<Medicine[]>([])
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem("parsedMedicines")
    if (stored) {
      setMedicineList(JSON.parse(stored))
    } else {
      setMedicineList(defaultMedicines.slice(0, 2))
    }
  }, [])

  const handleEdit = (medicine: Medicine) => {
    setEditingMedicine({ ...medicine })
    setShowEditModal(true)
  }

  const handleSave = () => {
    if (editingMedicine) {
      setMedicineList((list) => list.map((m) => (m.id === editingMedicine.id ? editingMedicine : m)))
      setShowEditModal(false)
      setEditingMedicine(null)
    }
  }

  const handleDelete = (id: string) => {
    setMedicineList((list) => list.filter((m) => m.id !== id))
  }

  const handleAddNew = () => {
    const newMedicine: Medicine = {
      id: `med-new-${Date.now()}`,
      name: "New Medicine",
      dosage: "",
      frequency: "Once daily",
      times: ["08:00"],
      pillsPerDose: 1,
      totalPills: 30,
      remainingPills: 30,
      refillThreshold: 7,
      color: "#2563eb",
    }
    setEditingMedicine(newMedicine)
    setShowEditModal(true)
  }

  const handleConfirm = () => {
    sessionStorage.setItem("confirmedMedicines", JSON.stringify(medicineList))
    router.push("/dashboard")
  }

  const voiceText =
    medicineList.length > 0
      ? `You have ${medicineList.length} medicines to review. ${medicineList.map((m) => `${m.name} ${m.dosage}`).join(", ")}`
      : "No medicines found. Add your medicines manually."

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground">Review Your Medicines</h1>
        <p className="mt-2 text-xl text-muted-foreground">Check and edit the medicines we found</p>
      </div>

      <VoiceControls textToSpeak={voiceText} className="mb-8" />

      <div className="space-y-4">
        {medicineList.map((medicine) => (
          <MedVibeCard
            key={medicine.id}
            icon={Pill}
            iconColor="text-primary"
            title={medicine.name}
            description={`${medicine.dosage} • ${medicine.frequency}`}
          >
            <div className="mt-4 grid gap-3 text-base sm:grid-cols-2">
              <div>
                <span className="text-muted-foreground">Times: </span>
                <span className="font-medium text-foreground">{medicine.times.join(", ")}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Pills per dose: </span>
                <span className="font-medium text-foreground">{medicine.pillsPerDose}</span>
              </div>
              {medicine.instructions && (
                <div className="sm:col-span-2">
                  <span className="text-muted-foreground">Instructions: </span>
                  <span className="font-medium text-foreground">{medicine.instructions}</span>
                </div>
              )}
            </div>

            <div className="mt-4 flex gap-3">
              <LargeButton
                variant="secondary"
                icon={Pencil}
                onClick={() => handleEdit(medicine)}
                className="flex-1 !min-h-[60px] !py-3"
              >
                Edit
              </LargeButton>
              <LargeButton
                variant="destructive"
                icon={Trash2}
                onClick={() => handleDelete(medicine.id)}
                className="flex-1 !min-h-[60px] !py-3"
              >
                Remove
              </LargeButton>
            </div>
          </MedVibeCard>
        ))}

        <LargeButton variant="secondary" icon={Plus} onClick={handleAddNew} fullWidth>
          Add Medicine Manually
        </LargeButton>
      </div>

      {medicineList.length > 0 && (
        <div className="mt-8">
          <LargeButton variant="success" icon={Check} onClick={handleConfirm} fullWidth>
            Confirm and Continue
          </LargeButton>
        </div>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setEditingMedicine(null)
        }}
        title={editingMedicine?.id.includes("new") ? "Add Medicine" : "Edit Medicine"}
        size="large"
      >
        {editingMedicine && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="med-name" className="text-lg">
                  Medicine Name
                </Label>
                <Input
                  id="med-name"
                  value={editingMedicine.name}
                  onChange={(e) => setEditingMedicine({ ...editingMedicine, name: e.target.value })}
                  className="h-14 text-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="med-dosage" className="text-lg">
                  Dosage
                </Label>
                <Input
                  id="med-dosage"
                  value={editingMedicine.dosage}
                  onChange={(e) => setEditingMedicine({ ...editingMedicine, dosage: e.target.value })}
                  placeholder="e.g., 500mg"
                  className="h-14 text-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="med-frequency" className="text-lg">
                  Frequency
                </Label>
                <Input
                  id="med-frequency"
                  value={editingMedicine.frequency}
                  onChange={(e) => setEditingMedicine({ ...editingMedicine, frequency: e.target.value })}
                  placeholder="e.g., Twice daily"
                  className="h-14 text-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="med-pills" className="text-lg">
                  Pills per Dose
                </Label>
                <Input
                  id="med-pills"
                  type="number"
                  value={editingMedicine.pillsPerDose}
                  onChange={(e) =>
                    setEditingMedicine({ ...editingMedicine, pillsPerDose: Number.parseInt(e.target.value) || 1 })
                  }
                  className="h-14 text-lg"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="med-times" className="text-lg">
                  Times (comma-separated)
                </Label>
                <Input
                  id="med-times"
                  value={editingMedicine.times.join(", ")}
                  onChange={(e) =>
                    setEditingMedicine({
                      ...editingMedicine,
                      times: e.target.value
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="e.g., 08:00, 20:00"
                  className="h-14 text-lg"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="med-instructions" className="text-lg">
                  Special Instructions
                </Label>
                <Input
                  id="med-instructions"
                  value={editingMedicine.instructions || ""}
                  onChange={(e) => setEditingMedicine({ ...editingMedicine, instructions: e.target.value })}
                  placeholder="e.g., Take with food"
                  className="h-14 text-lg"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <LargeButton
                variant="secondary"
                icon={X}
                onClick={() => {
                  setShowEditModal(false)
                  setEditingMedicine(null)
                }}
                className="flex-1"
              >
                Cancel
              </LargeButton>
              <LargeButton
                variant="primary"
                icon={Check}
                onClick={() => {
                  if (editingMedicine.id.includes("new")) {
                    setMedicineList([...medicineList, editingMedicine])
                    setShowEditModal(false)
                    setEditingMedicine(null)
                  } else {
                    handleSave()
                  }
                }}
                className="flex-1"
              >
                Save
              </LargeButton>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
