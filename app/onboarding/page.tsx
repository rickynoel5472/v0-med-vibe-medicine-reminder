"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Globe, UserPlus, ArrowRight, Check, Pill, Bell, Users, Volume2 } from "lucide-react"
import { LargeButton } from "@/components/ui/large-button"
import { MedVibeCard } from "@/components/ui/medvibe-card"
import { Modal } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useVoice } from "@/lib/hooks"

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
]

const features = [
  { icon: Bell, title: "Smart Reminders", description: "Never miss a dose with voice and visual alerts" },
  { icon: Pill, title: "Easy Tracking", description: "Upload prescriptions and track your medicines" },
  { icon: Users, title: "Caregiver Support", description: "Let loved ones help monitor your health" },
  { icon: Volume2, title: "Voice First", description: "Speak commands and hear reminders aloud" },
]

export default function OnboardingPage() {
  const router = useRouter()
  const { speak } = useVoice()
  const [step, setStep] = useState(1)
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [showCaregiverModal, setShowCaregiverModal] = useState(false)
  const [caregiverEmail, setCaregiverEmail] = useState("")
  const [caregiverInvited, setCaregiverInvited] = useState(false)

  const handleLanguageSelect = (code: string) => {
    setSelectedLanguage(code)
    speak("Language selected")
  }

  const handleInviteCaregiver = () => {
    if (caregiverEmail) {
      setCaregiverInvited(true)
      setShowCaregiverModal(false)
      speak("Caregiver invitation sent")
    }
  }

  const handleComplete = () => {
    speak("Welcome to MedVibe. Let us set up your medicines.")
    router.push("/dashboard")
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Progress indicator */}
      <div className="mb-8 flex items-center justify-center gap-4">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold ${
              s === step
                ? "bg-primary text-primary-foreground"
                : s < step
                  ? "bg-success text-success-foreground"
                  : "bg-secondary text-secondary-foreground"
            }`}
          >
            {s < step ? <Check className="h-6 w-6" /> : s}
          </div>
        ))}
      </div>

      {/* Step 1: Welcome */}
      {step === 1 && (
        <div className="space-y-8 text-center">
          <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-3xl bg-primary">
            <Pill className="h-16 w-16 text-primary-foreground" />
          </div>

          <div>
            <h1 className="text-4xl font-bold text-foreground">Welcome to MedVibe</h1>
            <p className="mt-4 text-xl text-muted-foreground">Your trusted medicine reminder designed for easy use</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {features.map((feature) => (
              <MedVibeCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              >
                <div />
              </MedVibeCard>
            ))}
          </div>

          <LargeButton
            variant="primary"
            icon={ArrowRight}
            iconPosition="right"
            onClick={() => {
              setStep(2)
              speak("Select your language")
            }}
            fullWidth
          >
            Get Started
          </LargeButton>
        </div>
      )}

      {/* Step 2: Language Selection */}
      {step === 2 && (
        <div className="space-y-8">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-secondary">
              <Globe className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Choose Your Language</h1>
            <p className="mt-2 text-xl text-muted-foreground">Select your preferred language for the app</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className={`flex items-center gap-4 rounded-2xl border-2 p-6 text-left transition-all ${
                  selectedLanguage === lang.code
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                <span className="text-4xl">{lang.flag}</span>
                <span className="text-xl font-semibold text-foreground">{lang.name}</span>
                {selectedLanguage === lang.code && <Check className="ml-auto h-8 w-8 text-primary" />}
              </button>
            ))}
          </div>

          <div className="flex gap-4">
            <LargeButton variant="secondary" onClick={() => setStep(1)} className="flex-1">
              Back
            </LargeButton>
            <LargeButton
              variant="primary"
              icon={ArrowRight}
              iconPosition="right"
              onClick={() => {
                setStep(3)
                speak("Would you like to invite a caregiver?")
              }}
              className="flex-1"
            >
              Continue
            </LargeButton>
          </div>
        </div>
      )}

      {/* Step 3: Caregiver Invite */}
      {step === 3 && (
        <div className="space-y-8">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-secondary">
              <Users className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Invite a Caregiver</h1>
            <p className="mt-2 text-xl text-muted-foreground">
              Let a family member or caregiver help monitor your medicines
            </p>
          </div>

          <MedVibeCard title="Why invite a caregiver?" icon={UserPlus}>
            <ul className="mt-4 space-y-3 text-lg text-foreground">
              <li className="flex items-center gap-3">
                <Check className="h-6 w-6 text-success" />
                They can see your medication schedule
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-6 w-6 text-success" />
                Get alerts if you miss a dose
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-6 w-6 text-success" />
                Help manage refill reminders
              </li>
            </ul>
          </MedVibeCard>

          {caregiverInvited && (
            <div className="flex items-center gap-4 rounded-2xl border-2 border-success bg-success/10 p-6">
              <Check className="h-8 w-8 text-success" />
              <div>
                <p className="text-lg font-semibold text-foreground">Invitation Sent!</p>
                <p className="text-base text-muted-foreground">{caregiverEmail}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4 sm:flex-row">
            <LargeButton variant="secondary" icon={UserPlus} onClick={() => setShowCaregiverModal(true)} fullWidth>
              {caregiverInvited ? "Invite Another" : "Invite Caregiver"}
            </LargeButton>
            <LargeButton variant="primary" icon={ArrowRight} iconPosition="right" onClick={handleComplete} fullWidth>
              {caregiverInvited ? "Continue to App" : "Skip for Now"}
            </LargeButton>
          </div>

          <LargeButton variant="secondary" onClick={() => setStep(2)} fullWidth>
            Back
          </LargeButton>
        </div>
      )}

      {/* Caregiver Modal */}
      <Modal
        isOpen={showCaregiverModal}
        onClose={() => setShowCaregiverModal(false)}
        title="Invite Caregiver"
        description="Enter their email to send an invitation"
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="caregiver-email" className="text-lg">
              Email Address
            </Label>
            <Input
              id="caregiver-email"
              type="email"
              placeholder="caregiver@email.com"
              value={caregiverEmail}
              onChange={(e) => setCaregiverEmail(e.target.value)}
              className="h-14 text-lg"
            />
          </div>

          <div className="flex gap-4">
            <LargeButton variant="secondary" onClick={() => setShowCaregiverModal(false)} className="flex-1">
              Cancel
            </LargeButton>
            <LargeButton variant="primary" onClick={handleInviteCaregiver} className="flex-1">
              Send Invite
            </LargeButton>
          </div>
        </div>
      </Modal>
    </div>
  )
}
