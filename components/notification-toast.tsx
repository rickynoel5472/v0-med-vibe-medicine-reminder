"use client"

import { useEffect, useState } from "react"
import { X, Bell, Pill } from "lucide-react"

interface ToastProps {
  message: string
  medicineName?: string
  onClose: () => void
  autoClose?: number
}

export function NotificationToast({ message, medicineName, onClose, autoClose = 5000 }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300)
    }, autoClose)
    return () => clearTimeout(timer)
  }, [autoClose, onClose])

  return (
    <div
      className={`fixed right-4 top-24 z-50 w-full max-w-sm transform transition-all duration-300 ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div className="overflow-hidden rounded-2xl border-2 border-primary bg-card shadow-2xl">
        <div className="flex items-center gap-1 bg-primary px-4 py-2">
          <Bell className="h-5 w-5 animate-pulse text-primary-foreground" />
          <span className="font-semibold text-primary-foreground">MedVibe Reminder</span>
        </div>
        <div className="flex items-center gap-4 p-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Pill className="h-7 w-7 text-primary" />
          </div>
          <div className="flex-1">
            {medicineName && <p className="text-lg font-bold text-foreground">{medicineName}</p>}
            <p className="text-base text-muted-foreground">{message}</p>
          </div>
          <button
            onClick={() => {
              setIsVisible(false)
              setTimeout(onClose, 300)
            }}
            className="rounded-lg p-2 hover:bg-secondary"
            aria-label="Close notification"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  )
}
