import { cn } from "@/lib/utils"
import { Check, X, Clock, AlertCircle } from "lucide-react"
import type { DoseRecord } from "@/lib/types"

interface TimelineProps {
  items: DoseRecord[]
  className?: string
}

const statusConfig = {
  taken: {
    icon: Check,
    color: "bg-success text-success-foreground",
    borderColor: "border-success",
    label: "Taken",
  },
  missed: {
    icon: X,
    color: "bg-destructive text-destructive-foreground",
    borderColor: "border-destructive",
    label: "Missed",
  },
  pending: {
    icon: Clock,
    color: "bg-warning text-warning-foreground",
    borderColor: "border-warning",
    label: "Pending",
  },
  skipped: {
    icon: AlertCircle,
    color: "bg-muted text-muted-foreground",
    borderColor: "border-muted",
    label: "Skipped",
  },
}

export function Timeline({ items, className }: TimelineProps) {
  const groupedByDate = items.reduce(
    (acc, item) => {
      const date = item.date
      if (!acc[date]) acc[date] = []
      acc[date].push(item)
      return acc
    },
    {} as Record<string, DoseRecord[]>,
  )

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (dateStr === today.toISOString().split("T")[0]) return "Today"
    if (dateStr === yesterday.toISOString().split("T")[0]) return "Yesterday"
    return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
  }

  return (
    <div className={cn("space-y-8", className)}>
      {Object.entries(groupedByDate).map(([date, doses]) => (
        <div key={date}>
          <h3 className="mb-4 text-xl font-bold text-foreground">{formatDate(date)}</h3>
          <div className="space-y-4">
            {doses.map((dose) => {
              const config = statusConfig[dose.status]
              const Icon = config.icon

              return (
                <div
                  key={dose.id}
                  className={cn("flex items-center gap-4 rounded-xl border-2 bg-card p-4", config.borderColor)}
                >
                  <div className={cn("flex h-14 w-14 items-center justify-center rounded-xl", config.color)}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-foreground">{dose.medicineName}</p>
                    <p className="text-base text-muted-foreground">
                      Scheduled: {dose.scheduledTime}
                      {dose.takenTime && ` • Taken: ${dose.takenTime}`}
                    </p>
                  </div>
                  <div className={cn("rounded-lg px-4 py-2 text-base font-medium", config.color)}>{config.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
