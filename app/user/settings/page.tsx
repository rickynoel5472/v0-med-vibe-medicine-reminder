"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Pill, User, LogOut, ArrowLeft, Bell, Moon, Volume2, Shield, Trash2, Mail } from "lucide-react"
import { LargeButton } from "@/components/ui/large-button"

interface UserData {
  name: string
  email: string
  isLoggedIn: boolean
  createdAt: string
}

export default function UserSettingsPage() {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [settings, setSettings] = useState({
    notifications: true,
    voiceReminders: true,
    sleepMode: false,
    sleepStart: "22:00",
    sleepEnd: "07:00",
  })

  useEffect(() => {
    const storedUser = sessionStorage.getItem("userData")
    if (!storedUser) {
      router.push("/login")
      return
    }
    setUserData(JSON.parse(storedUser))
  }, [router])

  const handleLogout = () => {
    sessionStorage.removeItem("userData")
    sessionStorage.removeItem("userMedicines")
    sessionStorage.removeItem("userDoses")
    router.push("/")
  }

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      sessionStorage.clear()
      router.push("/")
    }
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
      {/* Header */}
      <header className="sticky top-0 z-50 bg-navy/95 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white/80">
              <Pill className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">MedVibe</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="hidden text-sm font-medium text-white sm:block">{userData.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-2xl px-4 py-8">
        {/* Back Button */}
        <Link
          href="/user/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-lg font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Dashboard
        </Link>

        <h1 className="mb-8 text-3xl font-bold text-foreground">Settings</h1>

        {/* Profile Section */}
        <div className="mb-8 rounded-2xl border-2 border-border bg-white p-6">
          <h2 className="mb-4 text-xl font-bold text-foreground">Profile</h2>
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary">
              <User className="h-10 w-10 text-white" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{userData.name}</p>
              <p className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                {userData.email}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Member since {new Date(userData.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="mb-8 rounded-2xl border-2 border-border bg-white p-6">
          <h2 className="mb-4 text-xl font-bold text-foreground">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">Get reminded when it{"'"}s time for your medicine</p>
                </div>
              </div>
              <button
                onClick={() => setSettings({ ...settings, notifications: !settings.notifications })}
                className={`h-8 w-14 rounded-full transition-colors ${
                  settings.notifications ? "bg-primary" : "bg-muted"
                }`}
              >
                <div
                  className={`h-6 w-6 transform rounded-full bg-white shadow-md transition-transform ${
                    settings.notifications ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Volume2 className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Voice Reminders</p>
                  <p className="text-sm text-muted-foreground">Hear your medicine reminders spoken aloud</p>
                </div>
              </div>
              <button
                onClick={() => setSettings({ ...settings, voiceReminders: !settings.voiceReminders })}
                className={`h-8 w-14 rounded-full transition-colors ${
                  settings.voiceReminders ? "bg-primary" : "bg-muted"
                }`}
              >
                <div
                  className={`h-6 w-6 transform rounded-full bg-white shadow-md transition-transform ${
                    settings.voiceReminders ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Sleep Mode */}
        <div className="mb-8 rounded-2xl border-2 border-border bg-white p-6">
          <h2 className="mb-4 text-xl font-bold text-foreground">Sleep Mode</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Do Not Disturb</p>
                  <p className="text-sm text-muted-foreground">Pause notifications during sleep hours</p>
                </div>
              </div>
              <button
                onClick={() => setSettings({ ...settings, sleepMode: !settings.sleepMode })}
                className={`h-8 w-14 rounded-full transition-colors ${settings.sleepMode ? "bg-primary" : "bg-muted"}`}
              >
                <div
                  className={`h-6 w-6 transform rounded-full bg-white shadow-md transition-transform ${
                    settings.sleepMode ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {settings.sleepMode && (
              <div className="grid grid-cols-2 gap-4 rounded-xl bg-muted/50 p-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Sleep Start</label>
                  <input
                    type="time"
                    value={settings.sleepStart}
                    onChange={(e) => setSettings({ ...settings, sleepStart: e.target.value })}
                    className="w-full rounded-xl border-2 border-border px-4 py-3 text-lg focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Sleep End</label>
                  <input
                    type="time"
                    value={settings.sleepEnd}
                    onChange={(e) => setSettings({ ...settings, sleepEnd: e.target.value })}
                    className="w-full rounded-xl border-2 border-border px-4 py-3 text-lg focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Privacy */}
        <div className="mb-8 rounded-2xl border-2 border-border bg-white p-6">
          <h2 className="mb-4 text-xl font-bold text-foreground">Privacy & Security</h2>
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-success" />
            <div>
              <p className="font-medium text-foreground">Your data is encrypted</p>
              <p className="text-sm text-muted-foreground">
                All your health data is stored locally and encrypted for your privacy
              </p>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-2xl border-2 border-destructive/30 bg-destructive/5 p-6">
          <h2 className="mb-4 text-xl font-bold text-destructive">Danger Zone</h2>
          <p className="mb-4 text-muted-foreground">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <LargeButton variant="destructive" icon={Trash2} onClick={handleDeleteAccount}>
            Delete Account
          </LargeButton>
        </div>
      </div>
    </div>
  )
}
