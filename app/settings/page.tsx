"use client"

import { useState } from "react"
import { Settings, Moon, Bell, Volume2, Eye, Globe, Save, Check } from "lucide-react"
import { LargeButton } from "@/components/ui/large-button"
import { MedVibeCard } from "@/components/ui/medvibe-card"
import { VoiceControls } from "@/components/voice-controls"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { defaultSettings } from "@/lib/mock-data"
import { useVoice } from "@/lib/hooks"
import type { Settings as SettingsType } from "@/lib/types"

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
]

const fontSizes = [
  { value: "normal", label: "Normal" },
  { value: "large", label: "Large" },
  { value: "extra-large", label: "Extra Large" },
]

export default function SettingsPage() {
  const { speak } = useVoice()
  const [settings, setSettings] = useState<SettingsType>(defaultSettings)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    localStorage.setItem("medvibe-settings", JSON.stringify(settings))
    setSaved(true)
    speak("Settings saved successfully")
    setTimeout(() => setSaved(false), 3000)
  }

  const voiceText = `Settings page. Configure your sleep window, notifications, voice reminders, and display preferences.`

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-secondary">
          <Settings className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="mt-2 text-xl text-muted-foreground">Customize your MedVibe experience</p>
      </div>

      <VoiceControls textToSpeak={voiceText} className="mb-8" />

      <div className="space-y-6">
        {/* Language */}
        <MedVibeCard icon={Globe} title="Language">
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setSettings({ ...settings, language: lang.code })}
                className={`flex items-center justify-between rounded-xl border-2 p-4 text-left transition-all ${
                  settings.language === lang.code
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <span className="text-lg font-medium text-foreground">{lang.name}</span>
                {settings.language === lang.code && <Check className="h-6 w-6 text-primary" />}
              </button>
            ))}
          </div>
        </MedVibeCard>

        {/* Sleep Window */}
        <MedVibeCard icon={Moon} title="Sleep Window" description="No reminders during this time">
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="sleep-start" className="text-lg">
                Start Time
              </Label>
              <Input
                id="sleep-start"
                type="time"
                value={settings.sleepWindowStart}
                onChange={(e) => setSettings({ ...settings, sleepWindowStart: e.target.value })}
                className="h-14 text-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sleep-end" className="text-lg">
                End Time
              </Label>
              <Input
                id="sleep-end"
                type="time"
                value={settings.sleepWindowEnd}
                onChange={(e) => setSettings({ ...settings, sleepWindowEnd: e.target.value })}
                className="h-14 text-lg"
              />
            </div>
          </div>
        </MedVibeCard>

        {/* Notifications */}
        <MedVibeCard icon={Bell} title="Notifications">
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-medium text-foreground">Push Notifications</p>
                <p className="text-base text-muted-foreground">Receive dose reminders</p>
              </div>
              <Switch
                checked={settings.notificationsEnabled}
                onCheckedChange={(checked) => setSettings({ ...settings, notificationsEnabled: checked })}
              />
            </div>
          </div>
        </MedVibeCard>

        {/* Voice */}
        <MedVibeCard icon={Volume2} title="Voice Settings">
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-medium text-foreground">Voice Reminders</p>
                <p className="text-base text-muted-foreground">Speak reminders aloud</p>
              </div>
              <Switch
                checked={settings.voiceReminders}
                onCheckedChange={(checked) => setSettings({ ...settings, voiceReminders: checked })}
              />
            </div>
          </div>
        </MedVibeCard>

        {/* Display */}
        <MedVibeCard icon={Eye} title="Display">
          <div className="mt-4 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-medium text-foreground">High Contrast Mode</p>
                <p className="text-base text-muted-foreground">Improve visibility</p>
              </div>
              <Switch
                checked={settings.highContrast}
                onCheckedChange={(checked) => setSettings({ ...settings, highContrast: checked })}
              />
            </div>

            <div>
              <p className="mb-3 text-lg font-medium text-foreground">Font Size</p>
              <div className="flex gap-3">
                {fontSizes.map((size) => (
                  <button
                    key={size.value}
                    onClick={() => setSettings({ ...settings, fontSize: size.value as SettingsType["fontSize"] })}
                    className={`flex-1 rounded-xl border-2 p-4 text-center transition-all ${
                      settings.fontSize === size.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <span
                      className={`font-medium text-foreground ${
                        size.value === "normal" ? "text-base" : size.value === "large" ? "text-lg" : "text-xl"
                      }`}
                    >
                      {size.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </MedVibeCard>

        {/* Save Button */}
        <LargeButton variant={saved ? "success" : "primary"} icon={saved ? Check : Save} onClick={handleSave} fullWidth>
          {saved ? "Saved!" : "Save Settings"}
        </LargeButton>
      </div>
    </div>
  )
}
