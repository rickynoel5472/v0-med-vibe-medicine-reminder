"use client"

import { useState, useCallback } from "react"

// Voice synthesis hook
export function useVoice() {
  const [isSpeaking, setIsSpeaking] = useState(false)

  const speak = useCallback((text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.85
      utterance.pitch = 1
      utterance.volume = 1
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      window.speechSynthesis.speak(utterance)
    }
  }, [])

  const stop = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }, [])

  return { speak, stop, isSpeaking }
}

// Voice recognition hook
export function useVoiceRecognition() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")

  const startListening = useCallback(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

      if (SpeechRecognitionAPI) {
        const recognition = new SpeechRecognitionAPI()
        recognition.continuous = false
        recognition.interimResults = false

        recognition.onstart = () => setIsListening(true)
        recognition.onend = () => setIsListening(false)
        recognition.onresult = (event) => {
          const result = event.results[0][0].transcript
          setTranscript(result)
        }

        recognition.start()
      }
    }
  }, [])

  const stopListening = useCallback(() => {
    setIsListening(false)
  }, [])

  return { startListening, stopListening, isListening, transcript }
}
