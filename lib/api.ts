import { medicines, todaysDoses, doseHistory, patients } from "./mock-data"
import type { Medicine } from "./types"

// OCR API hook
export async function parsePresciption(imageFile: File): Promise<Medicine[]> {
  // Simulated OCR response
  await new Promise((resolve) => setTimeout(resolve, 2000))

  return [
    {
      id: `med-new-${Date.now()}`,
      name: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      times: ["08:00", "20:00"],
      pillsPerDose: 1,
      totalPills: 60,
      remainingPills: 60,
      refillThreshold: 10,
      instructions: "Take with food",
      color: "#2563eb",
    },
  ]
}

// Schedules API
export async function getSchedules(patientId: string) {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return {
    patientId,
    medicines: medicines,
    doses: todaysDoses,
  }
}

// Dose API
export async function recordDose(doseId: string, status: "taken" | "skipped") {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return {
    success: true,
    doseId,
    status,
    timestamp: new Date().toISOString(),
  }
}

export async function getDoseHistory(patientId: string) {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return doseHistory
}

// Inventory API
export async function getInventory(patientId: string) {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return medicines.map((med) => ({
    ...med,
    daysRemaining: Math.floor(med.remainingPills / med.pillsPerDose / med.times.length),
    needsRefill: med.remainingPills <= med.refillThreshold,
  }))
}

export async function updateInventory(medicineId: string, pillsAdded: number) {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return { success: true, medicineId, pillsAdded }
}

// Patient adherence for caregivers
export async function getPatientAdherence(caregiverId: string) {
  await new Promise((resolve) => setTimeout(resolve, 500))

  return patients.map((patient) => {
    const patientDoses = doseHistory.filter(() => Math.random() > 0.3)
    const taken = patientDoses.filter((d) => d.status === "taken").length
    const total = patientDoses.length || 1

    return {
      patient,
      adherenceRate: Math.round((taken / total) * 100),
      lastDose: patientDoses[0],
      alerts: medicines.filter((m) => m.remainingPills <= m.refillThreshold).length,
    }
  })
}
