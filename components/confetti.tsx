"use client"

import { useEffect, useState } from "react"

interface ConfettiPiece {
  id: number
  x: number
  color: string
  delay: number
  size: number
}

export function Confetti({ active }: { active: boolean }) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])

  useEffect(() => {
    if (active) {
      const colors = ["#2563eb", "#059669", "#d97706", "#dc2626", "#8b5cf6"]
      const newPieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5,
        size: 8 + Math.random() * 8,
      }))
      setPieces(newPieces)

      const timeout = setTimeout(() => setPieces([]), 3000)
      return () => clearTimeout(timeout)
    }
  }, [active])

  if (!active || pieces.length === 0) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti rounded-sm"
          style={{
            left: `${piece.x}%`,
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
