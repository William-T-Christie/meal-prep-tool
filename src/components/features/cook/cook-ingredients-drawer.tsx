'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useCookMode } from './cook-mode-provider'
import { scaleIngredients } from '@/lib/scaling'
import { ClipboardList } from 'lucide-react'

export function CookIngredientsDrawer() {
  const { recipe } = useCookMode()
  const scaled = scaleIngredients(recipe.ingredients, recipe.baseServings, recipe.baseServings)

  return (
    <Sheet>
      <SheetTrigger className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent">
        <ClipboardList className="h-4 w-4" />
        Ingredients
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[60vh]">
        <SheetHeader>
          <SheetTitle>Ingredients</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-2 overflow-auto">
          {scaled.map((ing) => (
            <div key={ing.id} className="text-sm">
              {ing.displayQuantity && <span className="font-medium">{ing.displayQuantity}</span>}{' '}
              {ing.unit && <span>{ing.unit}</span>}{' '}
              <span>{ing.name}</span>
              {ing.notes && <span className="text-muted-foreground"> ({ing.notes})</span>}
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}
