"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Pill, Eye, EyeOff, Mail, Lock, User, ArrowRight, Heart } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields")
      setIsLoading(false)
      return
    }

    if (!isLogin && !formData.name) {
      setError("Please enter your name")
      setIsLoading(false)
      return
    }

    const userData = {
      name: formData.name || formData.email.split("@")[0],
      email: formData.email,
      isLoggedIn: true,
      createdAt: new Date().toISOString(),
    }
    sessionStorage.setItem("userData", JSON.stringify(userData))

    router.push("/user/upload")
  }

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-b from-hero-peach-light via-hero-peach to-hero-peach-dark">
      {/* Circular wave pattern background */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="hero-ripple absolute h-[600px] w-[600px]" style={{ animationDelay: `${i * 0.7}s` }} />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 bg-navy/95 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white/80">
              <Pill className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">MedVibe</span>
          </Link>

          <Link
            href="/"
            className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            Back to Home
          </Link>
        </div>
      </header>

      {/* Login Form Container */}
      <div className="relative z-10 flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="rounded-3xl border border-white/20 bg-white/90 p-8 shadow-2xl backdrop-blur-md md:p-10">
            {/* Logo */}
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-blue-600 shadow-lg">
                <Heart className="h-8 w-8 text-white" />
              </div>
            </div>

            {/* Title */}
            <h1 className="mb-2 text-center text-3xl font-bold text-foreground">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="mb-8 text-center text-muted-foreground">
              {isLogin ? "Sign in to manage your medications" : "Start your journey to better health"}
            </p>

            {/* Toggle */}
            <div className="mb-8 flex rounded-xl bg-muted p-1">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 rounded-lg py-3 text-base font-semibold transition-all ${
                  isLogin
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 rounded-lg py-3 text-base font-semibold transition-all ${
                  !isLogin
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Error Message */}
            {error && <div className="mb-6 rounded-xl bg-destructive/10 p-4 text-center text-destructive">{error}</div>}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field (Sign Up only) */}
              {!isLogin && (
                <div>
                  <label className="mb-2 block text-base font-semibold text-foreground">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your name"
                      className="w-full rounded-xl border-2 border-border bg-white py-4 pl-12 pr-4 text-lg transition-colors focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label className="mb-2 block text-base font-semibold text-foreground">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border-2 border-border bg-white py-4 pl-12 pr-4 text-lg transition-colors focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="mb-2 block text-base font-semibold text-foreground">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border-2 border-border bg-white py-4 pl-12 pr-12 text-lg transition-colors focus:border-primary focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Forgot Password (Login only) */}
              {isLogin && (
                <div className="text-right">
                  <button type="button" className="text-base text-primary hover:underline">
                    Forgot Password?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="glow-primary flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 text-lg font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    {isLogin ? "Sign In" : "Create Account"}
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-border" />
              <span className="text-sm text-muted-foreground">or continue with</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 rounded-xl border-2 border-border bg-white py-3 font-medium transition-colors hover:bg-muted">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>
              <button className="flex items-center justify-center gap-2 rounded-xl border-2 border-border bg-white py-3 font-medium transition-colors hover:bg-muted">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
                </svg>
                Apple
              </button>
            </div>

            {/* Terms */}
            <p className="mt-6 text-center text-sm text-muted-foreground">
              By continuing, you agree to our <button className="text-primary hover:underline">Terms of Service</button>{" "}
              and <button className="text-primary hover:underline">Privacy Policy</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
