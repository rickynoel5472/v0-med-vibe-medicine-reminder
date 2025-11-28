import { type NextRequest, NextResponse } from "next/server"
import { medicines, todaysDoses, patients } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const patientId = searchParams.get("patientId") || patients[0].id

  return NextResponse.json({
    patientId,
    medicines,
    doses: todaysDoses,
    patient: patients.find((p) => p.id === patientId) || patients[0],
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { patientId, medicines: newMedicines } = body

    return NextResponse.json({
      success: true,
      patientId,
      medicinesCount: newMedicines?.length || 0,
    })
  } catch (error) {
    console.error("Schedule Error:", error)
    return NextResponse.json({ error: "Failed to update schedule" }, { status: 500 })
  }
}
