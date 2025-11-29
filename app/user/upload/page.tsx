"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { FileUpload } from "@/components/ui/file-upload"
import { LargeButton } from "@/components/ui/large-button"
import { VoiceControls } from "@/components/voice-controls"
import { parsePresciption } from "@/lib/api"
import { ArrowRight, FileText, Pill, User, LogOut } from "lucide-react"
import type { Medicine } from "@/lib/types"

interface UserData {
  name: string
  email: string
  isLoggedIn: boolean
  createdAt: string
}

export default function UserUploadPage() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [parsedMedicines, setParsedMedicines] = useState<Medicine[]>([])
  const [userData, setUserData] = useState<UserData | null>(null)

  useEffect(() => {
    // Check if user is logged in
    const storedUser = sessionStorage.getItem("userData")
    if (!storedUser) {
      router.push("/login")
      return
    }
    setUserData(JSON.parse(storedUser))
  }, [router])

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true)
    try {
      const medicines = await parsePresciption(file)
      setParsedMedicines(medicines)
      sessionStorage.setItem("userMedicines", JSON.stringify(medicines))
    } catch (error) {
      console.error("OCR Error:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleContinue = () => {
    router.push("/user/review")
  }

  const handleLogout = () => {
    sessionStorage.removeItem("userData")
    sessionStorage.removeItem("userMedicines")
    router.push("/")
  }

  if (!userData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-hero-peach-light via-white to-white">
      {/* Header with user info */}
      <header className="sticky top-0 z-50 bg-navy/95 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white/80">
              <Pill className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">MedVibe</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium text-white">{userData.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-sm text-white transition-colors hover:bg-white/10"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-3xl px-4 py-8">
        {/* Welcome message */}
        <div className="mb-8 rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm">
          <h1 className="text-2xl font-bold text-foreground">Welcome, {userData.name}!</h1>
          <p className="mt-1 text-muted-foreground">
            Logged in as <span className="font-medium">{userData.email}</span>
          </p>
        </div>

        {/* Upload Section */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-secondary">
            <FileText className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-foreground">Upload Your Prescription</h2>
          <p className="mt-2 text-xl text-muted-foreground">
            Take a photo or upload your prescription to set up your medicine schedule
          </p>
        </div>

        <VoiceControls
          textToSpeak={`Welcome ${userData.name}. Please upload a photo of your prescription. I will read it and create your personalized medicine schedule.`}
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

        {/* Skip option */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground">
            {"Don't have a prescription right now?"}{" "}
            <button
              onClick={() => router.push("/user/dashboard")}
              className="font-semibold text-primary hover:underline"
            >
              Add medicines manually
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
