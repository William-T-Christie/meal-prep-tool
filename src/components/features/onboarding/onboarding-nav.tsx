'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react'

interface OnboardingNavProps {
  canGoBack: boolean
  canGoNext: boolean
  isReview: boolean
  isSubmitting: boolean
  onBack: () => void
  onNext: () => void
  onSubmit: () => void
}

export function OnboardingNav({
  canGoBack,
  canGoNext,
  isReview,
  isSubmitting,
  onBack,
  onNext,
  onSubmit,
}: OnboardingNavProps) {
  return (
    <div className="mt-6 flex items-center justify-between">
      <Button
        variant="ghost"
        onClick={onBack}
        disabled={!canGoBack}
        className={canGoBack ? '' : 'invisible'}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      {isReview ? (
        <Button onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Check className="mr-2 h-4 w-4" />
          )}
          Complete Setup
        </Button>
      ) : (
        <Button onClick={onNext} disabled={!canGoNext}>
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
