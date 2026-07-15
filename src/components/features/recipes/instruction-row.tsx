'use client'

import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import type { RecipeInstructionInput } from '@/lib/validators/recipe'

interface InstructionRowProps {
  instruction: RecipeInstructionInput
  onChange: (instruction: RecipeInstructionInput) => void
  onRemove: () => void
  canRemove: boolean
}

export function InstructionRow({ instruction, onChange, onRemove, canRemove }: InstructionRowProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
        {instruction.stepNumber}
      </div>
      <div className="flex-1 space-y-2">
        <Textarea
          placeholder="Describe this step..."
          value={instruction.instructionText}
          onChange={(e) => onChange({ ...instruction, instructionText: e.target.value })}
          rows={2}
        />
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Timer (min)"
            value={instruction.durationMinutes ?? ''}
            onChange={(e) => {
              const val = e.target.value
              onChange({ ...instruction, durationMinutes: val ? parseInt(val) : null })
            }}
            className="w-32"
          />
          <span className="text-xs text-muted-foreground">Optional timer</span>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onRemove}
        disabled={!canRemove}
        className="shrink-0"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}
