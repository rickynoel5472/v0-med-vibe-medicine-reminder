"use client"

import { useState, useEffect } from "react"
import { Users, AlertCircle, Check, Bell, Phone, Mail, TrendingUp, TrendingDown } from "lucide-react"
import { LargeButton } from "@/components/ui/large-button"
import { MedVibeCard } from "@/components/ui/medvibe-card"
import { Modal } from "@/components/ui/modal"
import { VoiceControls } from "@/components/voice-controls"
import { getPatientAdherence } from "@/lib/api"
import { caregivers } from "@/lib/mock-data"

interface PatientAdherence {
  patient: { id: string; name: string; age: number; conditions: string[] }
  adherenceRate: number
  lastDose?: { medicineName: string; status: string; scheduledTime: string }
  alerts: number
}

export default function CaregiverDashboardPage() {
  const [patientData, setPatientData] = useState<PatientAdherence[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPatient, setSelectedPatient] = useState<PatientAdherence | null>(null)
  const [showAlertModal, setShowAlertModal] = useState(false)
  const caregiver = caregivers[0]

  useEffect(() => {
    const fetchData = async () => {
      const data = await getPatientAdherence(caregiver.id)
      setPatientData(data)
      setLoading(false)
    }
    fetchData()
  }, [caregiver.id])

  const totalAlerts = patientData.reduce((acc, p) => acc + p.alerts, 0)
  const avgAdherence =
    patientData.length > 0
      ? Math.round(patientData.reduce((acc, p) => acc + p.adherenceRate, 0) / patientData.length)
      : 0

  const voiceText = `Caregiver dashboard for ${caregiver.name}. You are monitoring ${patientData.length} patients. Average adherence is ${avgAdherence}%. There are ${totalAlerts} alerts requiring attention.`

  const acknowledgeAlert = (patientId: string) => {
    setPatientData((prev) =>
      prev.map((p) => (p.patient.id === patientId ? { ...p, alerts: Math.max(0, p.alerts - 1) } : p)),
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto flex min-h-[400px] items-center justify-center px-4 py-8">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-xl text-muted-foreground">Loading patient data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
            <Users className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Caregiver Dashboard</h1>
            <p className="text-xl text-muted-foreground">Welcome, {caregiver.name}</p>
          </div>
        </div>
      </div>

      <VoiceControls textToSpeak={voiceText} className="mb-8" />

      {/* Summary Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <MedVibeCard icon={Users} iconColor="text-primary" title="Patients">
          <p className="text-4xl font-bold text-foreground">{patientData.length}</p>
        </MedVibeCard>
        <MedVibeCard
          icon={avgAdherence >= 80 ? TrendingUp : TrendingDown}
          iconColor={avgAdherence >= 80 ? "text-success" : "text-warning"}
          title="Avg Adherence"
        >
          <p
            className={`text-4xl font-bold ${
              avgAdherence >= 80 ? "text-success" : avgAdherence >= 60 ? "text-warning" : "text-destructive"
            }`}
          >
            {avgAdherence}%
          </p>
        </MedVibeCard>
        <MedVibeCard
          icon={AlertCircle}
          iconColor={totalAlerts > 0 ? "text-destructive" : "text-success"}
          title="Active Alerts"
        >
          <p className={`text-4xl font-bold ${totalAlerts > 0 ? "text-destructive" : "text-success"}`}>{totalAlerts}</p>
        </MedVibeCard>
      </div>

      {/* Patient Cards */}
      <h2 className="mb-4 text-2xl font-bold text-foreground">Your Patients</h2>
      <div className="space-y-4">
        {patientData.map((data) => (
          <MedVibeCard key={data.patient.id} className={data.alerts > 0 ? "border-warning" : ""}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-foreground">{data.patient.name}</h3>
                  {data.alerts > 0 && (
                    <span className="flex items-center gap-1 rounded-lg bg-warning px-3 py-1 text-sm font-medium text-warning-foreground">
                      <Bell className="h-4 w-4" />
                      {data.alerts} alert{data.alerts !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-base text-muted-foreground">
                  Age {data.patient.age} • {data.patient.conditions.join(", ")}
                </p>

                <div className="mt-4 flex items-center gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Adherence</p>
                    <p
                      className={`text-2xl font-bold ${
                        data.adherenceRate >= 80
                          ? "text-success"
                          : data.adherenceRate >= 60
                            ? "text-warning"
                            : "text-destructive"
                      }`}
                    >
                      {data.adherenceRate}%
                    </p>
                  </div>
                  {data.lastDose && (
                    <div>
                      <p className="text-sm text-muted-foreground">Last Dose</p>
                      <p className="text-base font-medium text-foreground">
                        {data.lastDose.medicineName}
                        <span
                          className={`ml-2 ${data.lastDose.status === "taken" ? "text-success" : "text-destructive"}`}
                        >
                          ({data.lastDose.status})
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:items-end">
                <LargeButton
                  variant="primary"
                  onClick={() => {
                    setSelectedPatient(data)
                    setShowAlertModal(true)
                  }}
                  className="!min-h-[48px] !px-6 !py-2"
                >
                  View Details
                </LargeButton>
                {data.alerts > 0 && (
                  <LargeButton
                    variant="success"
                    icon={Check}
                    onClick={() => acknowledgeAlert(data.patient.id)}
                    className="!min-h-[48px] !px-6 !py-2"
                  >
                    Acknowledge
                  </LargeButton>
                )}
              </div>
            </div>
          </MedVibeCard>
        ))}
      </div>

      {/* Contact Options */}
      <div className="mt-8">
        <h2 className="mb-4 text-2xl font-bold text-foreground">Quick Actions</h2>
        <div className="flex flex-col gap-4 sm:flex-row">
          <LargeButton variant="secondary" icon={Phone} className="flex-1">
            Call Patient
          </LargeButton>
          <LargeButton variant="secondary" icon={Mail} className="flex-1">
            Send Reminder
          </LargeButton>
        </div>
      </div>

      {/* Patient Detail Modal */}
      <Modal
        isOpen={showAlertModal}
        onClose={() => {
          setShowAlertModal(false)
          setSelectedPatient(null)
        }}
        title={selectedPatient?.patient.name || "Patient Details"}
        size="large"
      >
        {selectedPatient && (
          <div className="space-y-6">
            <div className="rounded-xl bg-secondary p-4">
              <p className="text-lg font-medium text-foreground">Health Conditions</p>
              <p className="text-base text-muted-foreground">{selectedPatient.patient.conditions.join(", ")}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border p-4">
                <p className="text-base text-muted-foreground">Adherence Rate</p>
                <p
                  className={`text-3xl font-bold ${
                    selectedPatient.adherenceRate >= 80
                      ? "text-success"
                      : selectedPatient.adherenceRate >= 60
                        ? "text-warning"
                        : "text-destructive"
                  }`}
                >
                  {selectedPatient.adherenceRate}%
                </p>
              </div>
              <div className="rounded-xl border border-border p-4">
                <p className="text-base text-muted-foreground">Active Alerts</p>
                <p className={`text-3xl font-bold ${selectedPatient.alerts > 0 ? "text-destructive" : "text-success"}`}>
                  {selectedPatient.alerts}
                </p>
              </div>
            </div>

            {selectedPatient.alerts > 0 && (
              <div className="rounded-xl border-2 border-warning bg-warning/5 p-4">
                <p className="font-medium text-foreground">Alert: Low medicine stock</p>
                <p className="mt-1 text-base text-muted-foreground">
                  Some medicines are running low and need to be refilled soon.
                </p>
              </div>
            )}

            <div className="flex gap-4">
              <LargeButton variant="secondary" icon={Phone} className="flex-1">
                Call
              </LargeButton>
              <LargeButton variant="primary" icon={Mail} className="flex-1">
                Message
              </LargeButton>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
