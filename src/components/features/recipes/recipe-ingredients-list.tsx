'use client'

import { useMemo } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { scaleIngredients } from '@/lib/scaling'
import type { RecipeIngredient } from '@/types'

interface RecipeIngredientsListProps {
  ingredients: RecipeIngredient[]
  baseServings: number
  currentServings: number
}

export function RecipeIngredientsList({ ingredients, baseServings, currentServings }: RecipeIngredientsListProps) {
  const scaled = useMemo(
    () => scaleIngredients(ingredients, baseServings, currentServings),
    [ingredients, baseServings, currentServings]
  )

  return (
    <div className="space-y-2">
      {scaled.map((ing) => (
        <div key={ing.id} className="flex items-start gap-3 py-1">
          <Checkbox id={`ing-${ing.id}`} className="mt-0.5" />
          <label htmlFor={`ing-${ing.id}`} className="text-sm cursor-pointer leading-relaxed">
            {ing.displayQuantity && (
              <span className="font-medium">{ing.displayQuantity}</span>
            )}{' '}
            {ing.unit && <span>{ing.unit}</span>}{' '}
            <span>{ing.name}</span>
            {ing.notes && (
              <span className="text-muted-foreground"> ({ing.notes})</span>
            )}
          </label>
        </div>
      ))}
    </div>
  )
}
