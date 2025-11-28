"use client"

import { Volume2, VolumeX, Mic, MicOff } from "lucide-react"
import { LargeButton } from "@/components/ui/large-button"
import { useVoice, useVoiceRecognition } from "@/lib/hooks"

interface VoiceControlsProps {
  textToSpeak?: string
  onVoiceCommand?: (command: string) => void
  className?: string
}

export function VoiceControls({ textToSpeak, onVoiceCommand, className }: VoiceControlsProps) {
  const { speak, stop, isSpeaking } = useVoice()
  const { startListening, isListening, transcript } = useVoiceRecognition()

  const handleSpeak = () => {
    if (isSpeaking) {
      stop()
    } else if (textToSpeak) {
      speak(textToSpeak)
    }
  }

  const handleListen = () => {
    if (!isListening) {
      startListening()
    }
  }

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-4">
        <LargeButton
          variant={isSpeaking ? "destructive" : "primary"}
          icon={isSpeaking ? VolumeX : Volume2}
          onClick={handleSpeak}
          aria-label={isSpeaking ? "Stop speaking" : "Read aloud"}
        >
          {isSpeaking ? "Stop" : "Speak"}
        </LargeButton>

        <LargeButton
          variant={isListening ? "warning" : "secondary"}
          icon={isListening ? MicOff : Mic}
          onClick={handleListen}
          aria-label={isListening ? "Stop listening" : "Start listening"}
        >
          {isListening ? "Listening..." : "Listen"}
        </LargeButton>
      </div>

      {transcript && (
        <div className="mt-4 rounded-xl bg-secondary p-4">
          <p className="text-sm font-medium text-muted-foreground">You said:</p>
          <p className="text-lg text-foreground">{transcript}</p>
        </div>
      )}
    </div>
  )
}
