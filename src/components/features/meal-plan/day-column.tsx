'use client'

import { MealSlot } from './meal-slot'
import type { MealPlanMealDetail, MealType } from '@/types'

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MEAL_ORDER: MealType[] = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK']
const MEAL_LABELS: Record<MealType, string> = {
  BREAKFAST: 'Breakfast',
  LUNCH: 'Lunch',
  DINNER: 'Dinner',
  SNACK: 'Snack',
}

interface DayColumnProps {
  dayIndex: number
  meals: MealPlanMealDetail[]
  onSwap: (dayIndex: number, mealType: MealType) => void
  swappingSlot: { dayIndex: number; mealType: MealType } | null
}

export function DayColumn({ dayIndex, meals, onSwap, swappingSlot }: DayColumnProps) {
  const mealMap = new Map(meals.map((m) => [m.mealType, m]))

  return (
    <div className="space-y-2">
      <h3 className="text-center text-sm font-semibold">{DAY_NAMES[dayIndex]}</h3>
      {MEAL_ORDER.map((type) => {
        const meal = mealMap.get(type)
        if (!meal) {
          return (
            <div key={type} className="rounded-md border border-dashed p-3 text-center text-xs text-muted-foreground">
              {MEAL_LABELS[type]}
            </div>
          )
        }
        return (
          <MealSlot
            key={meal.id}
            meal={meal}
            onSwap={() => onSwap(dayIndex, type)}
            isSwapping={swappingSlot?.dayIndex === dayIndex && swappingSlot?.mealType === type}
          />
        )
      })}
    </div>
  )
}
