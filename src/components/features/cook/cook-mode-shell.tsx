'use client'

import { useCookMode } from './cook-mode-provider'
import { CookStepDisplay } from './cook-step-display'
import { CookIngredientsDrawer } from './cook-ingredients-drawer'
import { ErrorBoundary } from '@/components/features/layout/error-boundary'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'

export function CookModeShell() {
  const { recipe, currentStep, totalSteps, isFirstStep, isLastStep, nextStep, prevStep } = useCookMode()
  const progress = ((currentStep + 1) / totalSteps) * 100

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Link href={`/recipes/${recipe.id}`}>
            <Button variant="ghost" size="icon" className="shrink-0" aria-label="Close cooking mode">
              <X className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-sm font-semibold truncate">{recipe.title}</h1>
        </div>
        <CookIngredientsDrawer />
      </header>

      {/* Progress */}
      <Progress value={progress} className="h-1 rounded-none" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} aria-label="Cooking progress" />

      {/* Step Content */}
      <ErrorBoundary>
        <CookStepDisplay />
      </ErrorBoundary>

      {/* Navigation */}
      <nav className="border-t p-4">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <Button
            variant="outline"
            size="lg"
            onClick={prevStep}
            disabled={isFirstStep}
            aria-label="Go to previous step"
            className="min-w-[120px] h-14 text-base"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Previous
          </Button>

          <span className="text-sm text-muted-foreground">
            {currentStep + 1} / {totalSteps}
          </span>

          {isLastStep ? (
            <Link href={`/recipes/${recipe.id}`}>
              <Button size="lg" className="min-w-[120px] h-14 text-base">
                Done!
              </Button>
            </Link>
          ) : (
            <Button
              size="lg"
              onClick={nextStep}
              aria-label="Go to next step"
              className="min-w-[120px] h-14 text-base"
            >
              Next
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}
        </div>
      </nav>
    </div>
  )
}
