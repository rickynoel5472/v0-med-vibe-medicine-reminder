"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, Camera, ImageIcon, X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { LargeButton } from "./large-button"

interface FileUploadProps {
  onFileSelect: (file: File) => void
  isLoading?: boolean
  accept?: string
  label?: string
}

export function FileUpload({
  onFileSelect,
  isLoading = false,
  accept = "image/*",
  label = "Upload Prescription",
}: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
    onFileSelect(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const clearPreview = () => {
    setPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
        id="file-upload"
      />

      {!preview ? (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "flex min-h-[250px] flex-col items-center justify-center rounded-2xl border-4 border-dashed p-8 transition-colors",
            isDragging ? "border-primary bg-primary/5" : "border-border bg-card",
          )}
        >
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
            <Upload className="h-10 w-10 text-primary" />
          </div>
          <p className="mb-6 text-center text-xl font-medium text-foreground">{label}</p>
          <p className="mb-6 text-center text-lg text-muted-foreground">Drag and drop or click to select</p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <LargeButton
              variant="primary"
              icon={ImageIcon}
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              Choose File
            </LargeButton>
            <LargeButton
              variant="secondary"
              icon={Camera}
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              Take Photo
            </LargeButton>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-2xl border-2 border-border bg-card">
          <img
            src={preview || "/placeholder.svg"}
            alt="Prescription preview"
            className="h-auto max-h-[400px] w-full object-contain"
          />
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-xl font-medium text-foreground">Processing prescription...</p>
              </div>
            </div>
          ) : (
            <button
              onClick={clearPreview}
              className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-lg"
              aria-label="Remove image"
            >
              <X className="h-6 w-6" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
