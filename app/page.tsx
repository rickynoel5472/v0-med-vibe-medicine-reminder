"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Pill,
  Play,
  ChevronDown,
  Sparkles,
  Bell,
  Volume2,
  Users,
  Shield,
  Clock,
  Lock,
  ArrowRight,
  CheckCircle2,
  Heart,
  Smartphone,
  Camera,
  FileCheck,
  Activity,
  LogIn,
} from "lucide-react"

export default function LandingPage() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [currentStat, setCurrentStat] = useState(0)
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())

  const stats = [
    { value: "50%", label: "of elderly patients miss doses regularly" },
    { value: "125K", label: "preventable hospitalizations annually" },
    { value: "89%", label: "adherence improvement with reminders" },
  ]

  const features = [
    {
      icon: Bell,
      title: "Smart Reminders",
      description: "Voice and visual alerts that adapt to your schedule",
      color: "from-blue-500/20 to-blue-600/10",
    },
    {
      icon: Volume2,
      title: "Voice-First Design",
      description: "Speak commands, hear reminders - no typing needed",
      color: "from-green-500/20 to-green-600/10",
    },
    {
      icon: Users,
      title: "Caregiver Connect",
      description: "Family members stay informed and can help remotely",
      color: "from-purple-500/20 to-purple-600/10",
    },
    {
      icon: Shield,
      title: "Never Miss a Refill",
      description: "Automatic inventory tracking and pharmacy alerts",
      color: "from-orange-500/20 to-orange-600/10",
    },
    {
      icon: Clock,
      title: "Never Miss a Dose",
      description: "Persistent reminders until you confirm your medication",
      color: "from-red-500/20 to-red-600/10",
    },
    {
      icon: Lock,
      title: "Privacy First",
      description: "Your health data stays encrypted and never shared",
      color: "from-teal-500/20 to-teal-600/10",
    },
  ]

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length)
    }, 3000)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]))
          }
        })
      },
      { threshold: 0.1 },
    )

    document.querySelectorAll("section[id]").forEach((section) => {
      observer.observe(section)
    })

    return () => {
      clearInterval(interval)
      observer.disconnect()
    }
  }, [stats.length])

  const handleDemoMode = () => {
    sessionStorage.setItem("demoMode", "true")
    router.push("/dashboard")
  }

  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <header className="sticky top-0 z-50 bg-navy/95 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white/80">
              <Pill className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">MedVibe</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link href="#features" className="text-white/80 transition-colors hover:text-white">
              Features
            </Link>
            <Link href="#problem" className="text-white/80 transition-colors hover:text-white">
              Problem
            </Link>
            <Link href="#team" className="text-white/80 transition-colors hover:text-white">
              Team
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-lg border border-white/30 px-4 py-2 font-medium text-white transition-all hover:bg-white/10"
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">Login</span>
            </Link>
            <button
              onClick={handleDemoMode}
              className="rounded-lg bg-primary px-5 py-2 font-semibold text-white transition-all hover:bg-primary/90 hover:scale-105"
            >
              Try Demo
            </button>
          </div>
        </div>
      </header>

      <section className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-gradient-to-b from-hero-peach-light via-hero-peach to-hero-peach-dark">
        {/* Circular wave pattern */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="hero-ripple absolute h-[600px] w-[600px]"
              style={{ animationDelay: `${i * 0.7}s` }}
            />
          ))}
        </div>

        <div className="container relative mx-auto flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-4 py-16 text-center">
          <div
            className={`transition-all duration-1000 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            {/* Hackathon badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-white/70 px-4 py-2 shadow-lg backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Built for Hackathon 2025</span>
            </div>

            {/* Main headline */}
            <h1 className="mb-6 text-balance text-5xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
              Medicine Reminders
              <br />
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Made Simple
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mx-auto mb-10 max-w-2xl text-pretty text-lg text-foreground/80 md:text-xl">
              An accessible, voice-first medicine reminder app designed for elderly and chronic patients. Never miss a
              dose again.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/login"
                className="glow-primary flex min-w-[200px] items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-primary/90 hover:scale-105"
              >
                <ArrowRight className="h-5 w-5" />
                Get Started
              </Link>
              <button
                onClick={handleDemoMode}
                className="flex min-w-[200px] items-center justify-center gap-2 rounded-xl border-2 border-foreground/20 bg-white/80 px-8 py-4 text-lg font-semibold text-foreground shadow-lg backdrop-blur-sm transition-all hover:border-foreground/40 hover:bg-white hover:scale-105"
              >
                <Play className="h-5 w-5" />
                Try Demo
              </button>
            </div>
          </div>

          {/* Scroll indicator */}
          <button
            onClick={scrollToFeatures}
            className="absolute bottom-8 animate-bounce-slow text-foreground/60 transition-colors hover:text-foreground"
            aria-label="Scroll to features"
          >
            <ChevronDown className="h-8 w-8" />
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      <section
        id="problem"
        className={`relative bg-white px-4 py-20 ${visibleSections.has("problem") ? "animate-fade-in-up" : "opacity-0"}`}
      >
        <div className="container mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-2">
            <Heart className="h-4 w-4 text-red-500" />
            <span className="text-sm font-medium text-red-700">The Problem We Solve</span>
          </div>
          <h2 className="mb-8 text-3xl font-bold text-foreground md:text-4xl">
            Medication Non-Adherence is a <span className="text-destructive">Silent Crisis</span>
          </h2>
          <div className="relative h-32">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 ${
                  index === currentStat ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
              >
                <p className="text-6xl font-bold text-primary md:text-7xl">{stat.value}</p>
                <p className="mt-2 text-lg text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-center gap-2">
            {stats.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStat(index)}
                className={`h-2 w-10 rounded-full transition-all ${
                  index === currentStat ? "bg-primary scale-110" : "bg-muted hover:bg-muted-foreground/30"
                }`}
                aria-label={`Show stat ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-cream/50 to-cream" />
      </section>

      <section
        id="features"
        className={`relative bg-cream px-4 py-20 ${visibleSections.has("features") ? "animate-fade-in-up" : "opacity-0"}`}
      >
        <div className="container mx-auto max-w-6xl">
          <div className="mb-4 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
              <Smartphone className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Our Solution</span>
            </div>
          </div>
          <h2 className="mb-4 text-center text-3xl font-bold text-foreground md:text-4xl">
            Designed for <span className="text-primary">Accessibility</span>
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-muted-foreground">
            Every feature built with elderly and chronic patients in mind
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`group relative overflow-hidden rounded-2xl border border-border bg-white p-6 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1 ${
                  visibleSections.has("features") ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 transition-opacity group-hover:opacity-100`}
                />
                <div className="relative">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-transform group-hover:scale-110">
                    <feature.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-primary/5" />
      </section>

      <section
        id="accessibility"
        className={`relative bg-primary/5 px-4 py-20 ${visibleSections.has("accessibility") ? "animate-fade-in-up" : "opacity-0"}`}
      >
        <div className="container mx-auto max-w-4xl">
          <div className="mb-4 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">Accessibility First</span>
            </div>
          </div>
          <h2 className="mb-8 text-center text-3xl font-bold text-foreground">Built for Everyone</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { icon: "Aa", label: "Large 18px+ Fonts", desc: "Easy to read text" },
              { icon: "48", label: "48px Touch Targets", desc: "Big buttons for easy tap" },
              { icon: "AA", label: "High Contrast", desc: "WCAG compliant colors" },
            ].map((item, index) => (
              <div
                key={item.label}
                className="group rounded-2xl border border-border bg-white p-6 text-center shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 font-mono text-3xl font-bold text-primary transition-transform group-hover:scale-110">
                  {item.icon}
                </div>
                <p className="font-semibold text-foreground">{item.label}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-white" />
      </section>

      <section
        id="how-it-works"
        className={`relative bg-white px-4 py-20 ${visibleSections.has("how-it-works") ? "animate-fade-in-up" : "opacity-0"}`}
      >
        <div className="container mx-auto max-w-4xl">
          <div className="mb-4 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2">
              <Activity className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Simple Process</span>
            </div>
          </div>
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground">How It Works</h2>
          <div className="space-y-8">
            {[
              { step: 1, icon: Camera, title: "Upload Prescription", desc: "Take a photo - our OCR reads it for you" },
              { step: 2, icon: FileCheck, title: "Review & Confirm", desc: "Edit any details before saving" },
              { step: 3, icon: Bell, title: "Get Reminders", desc: "Voice alerts at the right time, every time" },
              { step: 4, icon: Activity, title: "Track Progress", desc: "See your adherence improve over time" },
            ].map((item, index) => (
              <div
                key={item.step}
                className="group flex items-center gap-6"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-blue-600 text-2xl font-bold text-primary-foreground shadow-lg transition-transform group-hover:scale-110">
                  {item.step}
                  {index < 3 && (
                    <div className="absolute -bottom-10 left-1/2 h-8 w-0.5 -translate-x-1/2 bg-gradient-to-b from-primary/50 to-transparent" />
                  )}
                </div>
                <div className="flex-1 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all group-hover:shadow-md group-hover:border-primary/30">
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
                  </div>
                  <p className="mt-1 text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-cream" />
      </section>

      <section
        id="team"
        className={`relative bg-cream px-4 py-20 ${visibleSections.has("team") ? "animate-fade-in-up" : "opacity-0"}`}
      >
        <div className="container mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2">
            <Users className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">The Creators</span>
          </div>
          <h2 className="mb-2 text-3xl font-bold text-foreground">Meet the Team</h2>
          <p className="mb-10 text-2xl font-bold text-primary">Rookie Coders</p>
          <div className="flex flex-wrap items-center justify-center gap-10">
            {[
              { name: "M. Ricky Noel", role: "Developer" },
              { name: "A. Abhinay", role: "Designer" },
              { name: "R. Harshavardhan", role: "Researcher" },
            ].map((member, index) => (
              <div
                key={member.name}
                className="group flex flex-col items-center"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 shadow-lg transition-all group-hover:shadow-xl group-hover:scale-110">
                  <Users className="h-10 w-10 text-primary" />
                </div>
                <p className="text-lg font-semibold text-foreground">{member.name}</p>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-white" />
      </section>

      <section className="relative bg-white px-4 py-20">
        <div className="container mx-auto max-w-2xl text-center">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-blue-600 to-primary p-10 shadow-2xl md:p-14">
            {/* Background pattern */}
            <div className="pointer-events-none absolute inset-0 opacity-10">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="absolute h-64 w-64 rounded-full border border-white"
                  style={{
                    top: `${20 + i * 20}%`,
                    left: `${10 + i * 30}%`,
                  }}
                />
              ))}
            </div>

            <div className="relative">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">Ready to Never Miss a Dose?</h2>
              <p className="mb-8 text-lg text-white/90">
                Join thousands of patients improving their health with MedVibe
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/login"
                  className="flex min-w-[180px] items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-semibold text-primary transition-all hover:bg-white/90 hover:scale-105"
                >
                  <ArrowRight className="h-5 w-5" />
                  Get Started
                </Link>
                <button
                  onClick={handleDemoMode}
                  className="flex min-w-[180px] items-center justify-center gap-2 rounded-xl border-2 border-white/50 px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-white/10 hover:scale-105"
                >
                  <Play className="h-5 w-5" />
                  Try Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy px-4 py-8">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white/60">
              <Pill className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">MedVibe</span>
          </div>
          <p className="text-center text-white/70">
            Built with love by <span className="font-semibold text-white">Rookie Coders</span> for Hackathon 2025
          </p>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-white/70 transition-colors hover:text-white">
              Login
            </Link>
            <button
              onClick={handleDemoMode}
              className="rounded-lg bg-white/10 px-4 py-2 text-white transition-colors hover:bg-white/20"
            >
              Demo
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
