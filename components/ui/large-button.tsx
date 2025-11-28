"use client"

import type React from "react"

import { forwardRef } from "react"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface LargeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "success" | "warning" | "destructive"
  icon?: LucideIcon
  iconPosition?: "left" | "right"
  fullWidth?: boolean
}

const variantStyles = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary",
  success: "bg-success text-success-foreground hover:bg-success/90 focus:ring-success",
  warning: "bg-warning text-warning-foreground hover:bg-warning/90 focus:ring-warning",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive",
}

export const LargeButton = forwardRef<HTMLButtonElement, LargeButtonProps>(
  ({ className, variant = "primary", icon: Icon, iconPosition = "left", fullWidth, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-4 rounded-2xl px-8 py-6 text-xl font-semibold transition-all",
          "focus:outline-none focus:ring-4 focus:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          "min-h-[80px] touch-manipulation",
          variantStyles[variant],
          fullWidth && "w-full",
          className,
        )}
        {...props}
      >
        {Icon && iconPosition === "left" && <Icon className="h-8 w-8" />}
        {children}
        {Icon && iconPosition === "right" && <Icon className="h-8 w-8" />}
      </button>
    )
  },
)

LargeButton.displayName = "LargeButton"
