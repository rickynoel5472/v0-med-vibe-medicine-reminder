import { type NextRequest, NextResponse } from "next/server"
import { medicines } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const patientId = searchParams.get("patientId")

  const inventory = medicines.map((med) => ({
    ...med,
    daysRemaining: Math.floor(med.remainingPills / med.pillsPerDose / med.times.length),
    needsRefill: med.remainingPills <= med.refillThreshold,
  }))

  return NextResponse.json({
    patientId,
    inventory,
    lowStockCount: inventory.filter((m) => m.needsRefill).length,
  })
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { medicineId, pillsAdded, patientId } = body

    if (!medicineId || pillsAdded === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      medicineId,
      pillsAdded,
      patientId,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Inventory Error:", error)
    return NextResponse.json({ error: "Failed to update inventory" }, { status: 500 })
  }
}
