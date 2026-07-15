'use client'

import { useCookMode } from './cook-mode-provider'
import { CookTimer } from './cook-timer'
import { Badge } from '@/components/ui/badge'

export function CookStepDisplay() {
  const { recipe, currentStep } = useCookMode()
  const instruction = recipe.instructions[currentStep]

  if (!instruction) return null

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-8">
      <Badge variant="secondary" className="mb-6 text-base px-4 py-1">
        Step {instruction.stepNumber} of {recipe.instructions.length}
      </Badge>

      <p className="text-xl leading-relaxed text-center max-w-2xl sm:text-2xl">
        {instruction.instructionText}
      </p>

      {instruction.durationMinutes && (
        <div className="mt-8 w-full max-w-xs">
          <CookTimer
            durationMinutes={instruction.durationMinutes}
            label={`Step ${instruction.stepNumber}`}
          />
        </div>
      )}
    </main>
  )
}
