export interface Patient {
  id: string
  name: string
  age: number
  conditions: string[]
  caregiverId?: string
  avatar?: string
}

export interface Medicine {
  id: string
  name: string
  dosage: string
  frequency: string
  times: string[]
  pillsPerDose: number
  totalPills: number
  remainingPills: number
  refillThreshold: number
  instructions?: string
  color: string
}

export interface DoseRecord {
  id: string
  medicineId: string
  medicineName: string
  scheduledTime: string
  takenTime?: string
  status: "pending" | "taken" | "missed" | "skipped"
  date: string
}

export interface Schedule {
  id: string
  patientId: string
  medicines: Medicine[]
  doses: DoseRecord[]
}

export interface Caregiver {
  id: string
  name: string
  email: string
  phone: string
  patients: string[]
}

export interface Settings {
  language: string
  sleepWindowStart: string
  sleepWindowEnd: string
  notificationsEnabled: boolean
  voiceReminders: boolean
  highContrast: boolean
  fontSize: "normal" | "large" | "extra-large"
}
