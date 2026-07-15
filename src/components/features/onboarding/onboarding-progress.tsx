'use client'

import { Progress } from '@/components/ui/progress'

interface OnboardingProgressProps {
  currentStep: number
  steps: readonly string[]
}

export function OnboardingProgress({ currentStep, steps }: OnboardingProgressProps) {
  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{steps[currentStep]}</span>
        <span className="text-muted-foreground">
          Step {currentStep + 1} of {steps.length}
        </span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  )
}
