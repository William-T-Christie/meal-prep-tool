'use client'

import { Badge } from '@/components/ui/badge'
import { Clock } from 'lucide-react'
import type { RecipeInstruction } from '@/types'

interface RecipeInstructionsListProps {
  instructions: RecipeInstruction[]
}

export function RecipeInstructionsList({ instructions }: RecipeInstructionsListProps) {
  return (
    <div className="space-y-4">
      {instructions.map((step) => (
        <div key={step.id} className="flex gap-4">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
            {step.stepNumber}
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm leading-relaxed">{step.instructionText}</p>
            {step.durationMinutes && (
              <Badge variant="outline" className="gap-1 text-xs">
                <Clock className="h-3 w-3" /> {step.durationMinutes} min
              </Badge>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
