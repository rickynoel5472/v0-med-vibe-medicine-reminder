"use client"

import type React from "react"

import { useEffect } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  size?: "default" | "large"
}

export function Modal({ isOpen, onClose, title, description, children, size = "default" }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        className={cn(
          "relative z-10 w-full rounded-2xl bg-background p-8 shadow-xl",
          size === "default" ? "max-w-lg" : "max-w-2xl",
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 id="modal-title" className="text-2xl font-bold text-foreground">
              {title}
            </h2>
            {description && <p className="mt-1 text-lg text-muted-foreground">{description}</p>}
          </div>
          <Button
            variant="ghost"
            size="lg"
            onClick={onClose}
            className="h-14 w-14 rounded-xl p-0"
            aria-label="Close modal"
          >
            <X className="h-8 w-8" />
          </Button>
        </div>
        {children}
      </div>
    </div>
  )
}
