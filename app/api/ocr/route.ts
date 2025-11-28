import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Simulate OCR processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock OCR response
    const parsedMedicines = [
      {
        id: `med-${Date.now()}-1`,
        name: "Metformin",
        dosage: "500mg",
        frequency: "Twice daily",
        times: ["08:00", "20:00"],
        pillsPerDose: 1,
        instructions: "Take with food",
      },
      {
        id: `med-${Date.now()}-2`,
        name: "Lisinopril",
        dosage: "10mg",
        frequency: "Once daily",
        times: ["09:00"],
        pillsPerDose: 1,
        instructions: "Take in the morning",
      },
    ]

    return NextResponse.json({
      success: true,
      medicines: parsedMedicines,
      confidence: 0.95,
    })
  } catch (error) {
    console.error("OCR Error:", error)
    return NextResponse.json({ error: "OCR processing failed" }, { status: 500 })
  }
}
