"use client"

import { useState } from "react"
import { Calendar, Download } from "lucide-react"
import { Timeline } from "@/components/ui/timeline"
import { LargeButton } from "@/components/ui/large-button"
import { MedVibeCard } from "@/components/ui/medvibe-card"
import { VoiceControls } from "@/components/voice-controls"
import { doseHistory } from "@/lib/mock-data"

export default function HistoryPage() {
  const [filter, setFilter] = useState<"all" | "taken" | "missed">("all")

  const filteredHistory = filter === "all" ? doseHistory : doseHistory.filter((d) => d.status === filter)

  const taken = doseHistory.filter((d) => d.status === "taken").length
  const missed = doseHistory.filter((d) => d.status === "missed").length
  const total = doseHistory.filter((d) => d.status !== "pending").length
  const adherenceRate = total > 0 ? Math.round((taken / total) * 100) : 100

  const voiceText = `Your dose history shows ${adherenceRate}% adherence. You have taken ${taken} doses and missed ${missed} doses.`

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-secondary">
          <Calendar className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">Dose History</h1>
        <p className="mt-2 text-xl text-muted-foreground">Track your medicine adherence</p>
      </div>

      <VoiceControls textToSpeak={voiceText} className="mb-8" />

      {/* Adherence Summary */}
      <MedVibeCard className="mb-8">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Overall Adherence</p>
          <p
            className={`text-5xl font-bold ${
              adherenceRate >= 80 ? "text-success" : adherenceRate >= 60 ? "text-warning" : "text-destructive"
            }`}
          >
            {adherenceRate}%
          </p>
          <div className="mt-4 flex justify-center gap-8 text-base">
            <div>
              <span className="font-bold text-success">{taken}</span>
              <span className="text-muted-foreground"> taken</span>
            </div>
            <div>
              <span className="font-bold text-destructive">{missed}</span>
              <span className="text-muted-foreground"> missed</span>
            </div>
          </div>
        </div>
      </MedVibeCard>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        <LargeButton
          variant={filter === "all" ? "primary" : "secondary"}
          onClick={() => setFilter("all")}
          className="!min-h-[56px] !px-6 !py-3"
        >
          All ({doseHistory.length})
        </LargeButton>
        <LargeButton
          variant={filter === "taken" ? "success" : "secondary"}
          onClick={() => setFilter("taken")}
          className="!min-h-[56px] !px-6 !py-3"
        >
          Taken ({taken})
        </LargeButton>
        <LargeButton
          variant={filter === "missed" ? "destructive" : "secondary"}
          onClick={() => setFilter("missed")}
          className="!min-h-[56px] !px-6 !py-3"
        >
          Missed ({missed})
        </LargeButton>
      </div>

      {/* Timeline */}
      <Timeline items={filteredHistory} />

      {/* Export Button */}
      <div className="mt-8">
        <LargeButton variant="secondary" icon={Download} fullWidth>
          Export History
        </LargeButton>
      </div>
    </div>
  )
}
