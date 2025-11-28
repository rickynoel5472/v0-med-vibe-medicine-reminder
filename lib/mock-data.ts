import type { Patient, Medicine, DoseRecord, Caregiver, Settings } from "./types"

export const patients: Patient[] = [
  {
    id: "patient-1",
    name: "Margaret Johnson",
    age: 72,
    conditions: ["Type 2 Diabetes", "Hypertension"],
    caregiverId: "caregiver-1",
  },
  {
    id: "patient-2",
    name: "Robert Williams",
    age: 68,
    conditions: ["Heart Disease", "High Cholesterol"],
    caregiverId: "caregiver-1",
  },
]

export const medicines: Medicine[] = [
  {
    id: "med-1",
    name: "Metformin",
    dosage: "500mg",
    frequency: "Twice daily",
    times: ["08:00", "20:00"],
    pillsPerDose: 1,
    totalPills: 60,
    remainingPills: 23,
    refillThreshold: 10,
    instructions: "Take with food",
    color: "#2563eb",
  },
  {
    id: "med-2",
    name: "Lisinopril",
    dosage: "10mg",
    frequency: "Once daily",
    times: ["09:00"],
    pillsPerDose: 1,
    totalPills: 30,
    remainingPills: 8,
    refillThreshold: 7,
    instructions: "Take in the morning",
    color: "#059669",
  },
  {
    id: "med-3",
    name: "Atorvastatin",
    dosage: "20mg",
    frequency: "Once daily",
    times: ["21:00"],
    pillsPerDose: 1,
    totalPills: 30,
    remainingPills: 15,
    refillThreshold: 7,
    instructions: "Take at bedtime",
    color: "#d97706",
  },
  {
    id: "med-4",
    name: "Aspirin",
    dosage: "81mg",
    frequency: "Once daily",
    times: ["08:00"],
    pillsPerDose: 1,
    totalPills: 90,
    remainingPills: 45,
    refillThreshold: 14,
    instructions: "Take with breakfast",
    color: "#dc2626",
  },
]

export const todaysDoses: DoseRecord[] = [
  {
    id: "dose-1",
    medicineId: "med-1",
    medicineName: "Metformin 500mg",
    scheduledTime: "08:00",
    takenTime: "08:15",
    status: "taken",
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "dose-2",
    medicineId: "med-2",
    medicineName: "Lisinopril 10mg",
    scheduledTime: "09:00",
    status: "pending",
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "dose-3",
    medicineId: "med-4",
    medicineName: "Aspirin 81mg",
    scheduledTime: "08:00",
    takenTime: "08:20",
    status: "taken",
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "dose-4",
    medicineId: "med-1",
    medicineName: "Metformin 500mg",
    scheduledTime: "20:00",
    status: "pending",
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "dose-5",
    medicineId: "med-3",
    medicineName: "Atorvastatin 20mg",
    scheduledTime: "21:00",
    status: "pending",
    date: new Date().toISOString().split("T")[0],
  },
]

export const doseHistory: DoseRecord[] = [
  ...todaysDoses,
  {
    id: "dose-h1",
    medicineId: "med-1",
    medicineName: "Metformin 500mg",
    scheduledTime: "08:00",
    takenTime: "08:10",
    status: "taken",
    date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
  },
  {
    id: "dose-h2",
    medicineId: "med-2",
    medicineName: "Lisinopril 10mg",
    scheduledTime: "09:00",
    status: "missed",
    date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
  },
  {
    id: "dose-h3",
    medicineId: "med-1",
    medicineName: "Metformin 500mg",
    scheduledTime: "20:00",
    takenTime: "20:30",
    status: "taken",
    date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
  },
  {
    id: "dose-h4",
    medicineId: "med-3",
    medicineName: "Atorvastatin 20mg",
    scheduledTime: "21:00",
    takenTime: "21:05",
    status: "taken",
    date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
  },
]

export const caregivers: Caregiver[] = [
  {
    id: "caregiver-1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    patients: ["patient-1", "patient-2"],
  },
]

export const defaultSettings: Settings = {
  language: "en",
  sleepWindowStart: "22:00",
  sleepWindowEnd: "07:00",
  notificationsEnabled: true,
  voiceReminders: true,
  highContrast: false,
  fontSize: "large",
}
