'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Play, Pause, RotateCcw } from 'lucide-react'

interface CookTimerProps {
  durationMinutes: number
  label: string
  onComplete?: () => void
}

export function CookTimer({ durationMinutes, label, onComplete }: CookTimerProps) {
  const totalSeconds = durationMinutes * 60
  const [remaining, setRemaining] = useState(totalSeconds)
  const [isRunning, setIsRunning] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const wakeLockRef = useRef<WakeLockSentinel | null>(null)

  const minutes = Math.floor(remaining / 60)
  const seconds = remaining % 60

  const requestWakeLock = useCallback(async () => {
    try {
      if ('wakeLock' in navigator) {
        wakeLockRef.current = await navigator.wakeLock.request('screen')
      }
    } catch {
      // WakeLock not available or denied
    }
  }, [])

  const releaseWakeLock = useCallback(() => {
    wakeLockRef.current?.release().catch(() => {})
    wakeLockRef.current = null
  }, [])

  useEffect(() => {
    if (isRunning && remaining > 0) {
      requestWakeLock()
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false)
            setIsComplete(true)
            // Play notification sound
            try {
              const audio = new Audio('/timer-complete.mp3')
              audio.play().catch(() => {})
            } catch {
              // Audio not available
            }
            onComplete?.()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (!isRunning) releaseWakeLock()
    }
  }, [isRunning, remaining, onComplete, requestWakeLock, releaseWakeLock])

  function reset() {
    setRemaining(totalSeconds)
    setIsRunning(false)
    setIsComplete(false)
    releaseWakeLock()
  }

  return (
    <div className={`rounded-lg border p-4 text-center ${isComplete ? 'border-green-500 bg-green-50 dark:bg-green-950' : ''}`}>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <div className="text-3xl font-mono font-bold tabular-nums" aria-live="polite" aria-atomic="true" role="timer">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
      {isComplete && <p className="text-sm font-medium text-green-600 mt-1">Timer complete!</p>}
      <div className="flex justify-center gap-2 mt-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsRunning(!isRunning)}
          disabled={isComplete}
          aria-label={isRunning ? 'Pause timer' : 'Start timer'}
        >
          {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button variant="outline" size="sm" onClick={reset} aria-label="Reset timer">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
