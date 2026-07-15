'use client'

import { Button } from '@/components/ui/button'
import { Minus, Plus } from 'lucide-react'

interface RecipeServingAdjusterProps {
  servings: number
  onChange: (servings: number) => void
}

export function RecipeServingAdjuster({ servings, onChange }: RecipeServingAdjusterProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-muted-foreground">Servings:</span>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onChange(Math.max(1, servings - 1))}
          disabled={servings <= 1}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="w-8 text-center text-lg font-semibold">{servings}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onChange(servings + 1)}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}
