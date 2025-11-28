"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface MedVibeCardProps {
  title?: string
  description?: string
  icon?: LucideIcon
  iconColor?: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
  interactive?: boolean
}

export function MedVibeCard({
  title,
  description,
  icon: Icon,
  iconColor = "text-primary",
  children,
  className,
  onClick,
  interactive = false,
}: MedVibeCardProps) {
  const Component = onClick ? "button" : "div"

  return (
    <Component
      onClick={onClick}
      className={cn(
        "relative rounded-2xl border-2 border-border bg-card p-6 text-left shadow-sm",
        interactive &&
          "cursor-pointer transition-all hover:border-primary hover:shadow-md focus:outline-none focus:ring-4 focus:ring-primary focus:ring-offset-2",
        className,
      )}
    >
      {(title || Icon) && (
        <div className="mb-4 flex items-center gap-4">
          {Icon && (
            <div className={cn("flex h-14 w-14 items-center justify-center rounded-xl bg-secondary", iconColor)}>
              <Icon className="h-7 w-7" />
            </div>
          )}
          <div>
            {title && <h3 className="text-xl font-bold text-foreground">{title}</h3>}
            {description && <p className="text-base text-muted-foreground">{description}</p>}
          </div>
        </div>
      )}
      {children}
    </Component>
  )
}
