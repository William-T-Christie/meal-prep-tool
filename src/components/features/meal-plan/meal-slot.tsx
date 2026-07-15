'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw, Clock, Flame, Loader2 } from 'lucide-react'
import type { MealPlanMealDetail } from '@/types'

interface MealSlotProps {
  meal: MealPlanMealDetail
  onSwap: () => void
  isSwapping: boolean
}

export function MealSlot({ meal, onSwap, isSwapping }: MealSlotProps) {
  const { recipe } = meal
  const calories = recipe.nutrition?.caloriesPerServing ?? 0

  return (
    <Card className="group relative">
      <CardContent className="p-3 space-y-1">
        <div className="flex items-start justify-between gap-1">
          <Link
            href={`/recipes/${recipe.id}`}
            className="text-sm font-medium leading-tight hover:text-primary line-clamp-2 flex-1"
          >
            {recipe.title}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={onSwap}
            disabled={isSwapping}
          >
            {isSwapping ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <RefreshCw className="h-3 w-3" />
            )}
          </Button>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> {recipe.totalTimeMinutes}m
          </span>
          <span className="flex items-center gap-1">
            <Flame className="h-3 w-3" /> {calories} cal
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
