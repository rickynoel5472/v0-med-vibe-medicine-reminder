"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FileUpload } from "@/components/ui/file-upload"
import { LargeButton } from "@/components/ui/large-button"
import { VoiceControls } from "@/components/voice-controls"
import { parsePresciption } from "@/lib/api"
import { ArrowRight, FileText } from "lucide-react"
import type { Medicine } from "@/lib/types"

export default function UploadPage() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [parsedMedicines, setParsedMedicines] = useState<Medicine[]>([])

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true)
    try {
      const medicines = await parsePresciption(file)
      setParsedMedicines(medicines)
      sessionStorage.setItem("parsedMedicines", JSON.stringify(medicines))
    } catch (error) {
      console.error("OCR Error:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleContinue = () => {
    router.push("/review")
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-secondary">
          <FileText className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">Upload Prescription</h1>
        <p className="mt-2 text-xl text-muted-foreground">Take a photo or upload your prescription to get started</p>
      </div>

      <VoiceControls
        textToSpeak="Upload a photo of your prescription. I will read it and create your medicine schedule."
        className="mb-8"
      />

      <FileUpload
        onFileSelect={handleFileSelect}
        isLoading={isProcessing}
        label="Upload or photograph your prescription"
      />

      {parsedMedicines.length > 0 && !isProcessing && (
        <div className="mt-8 space-y-4">
          <div className="rounded-2xl border-2 border-success bg-success/10 p-6">
            <p className="text-xl font-semibold text-foreground">
              Found {parsedMedicines.length} medicine{parsedMedicines.length !== 1 ? "s" : ""}!
            </p>
            <p className="mt-2 text-lg text-muted-foreground">Review and confirm the details on the next screen</p>
          </div>

          <LargeButton variant="primary" icon={ArrowRight} iconPosition="right" onClick={handleContinue} fullWidth>
            Review Medicines
          </LargeButton>
        </div>
      )}
    </div>
  )
}
