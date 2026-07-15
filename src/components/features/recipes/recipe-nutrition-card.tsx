'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { RecipeNutrition } from '@/types'

interface RecipeNutritionCardProps {
  nutrition: RecipeNutrition
  baseServings: number
  currentServings: number
}

export function RecipeNutritionCard({ nutrition, baseServings, currentServings }: RecipeNutritionCardProps) {
  const scale = currentServings / baseServings

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Nutrition per serving</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-2 text-center">
          <div>
            <div className="text-lg font-semibold">{Math.round(nutrition.caloriesPerServing)}</div>
            <div className="text-xs text-muted-foreground">cal</div>
          </div>
          <div>
            <div className="text-lg font-semibold">{Math.round(nutrition.proteinG)}g</div>
            <div className="text-xs text-muted-foreground">protein</div>
          </div>
          <div>
            <div className="text-lg font-semibold">{Math.round(nutrition.carbsG)}g</div>
            <div className="text-xs text-muted-foreground">carbs</div>
          </div>
          <div>
            <div className="text-lg font-semibold">{Math.round(nutrition.fatG)}g</div>
            <div className="text-xs text-muted-foreground">fat</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
