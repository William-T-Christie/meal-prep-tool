'use client'

import { useState } from 'react'
import { DayColumn } from './day-column'
import { useSwapMeal } from '@/lib/hooks/use-meal-plans'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { MealPlanMealDetail, MealType } from '@/types'

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

interface WeeklyGridProps {
  mealPlanId: string
  meals: MealPlanMealDetail[]
}

export function WeeklyGrid({ mealPlanId, meals }: WeeklyGridProps) {
  const swapMeal = useSwapMeal(mealPlanId)
  const [swappingSlot, setSwappingSlot] = useState<{ dayIndex: number; mealType: MealType } | null>(null)

  function handleSwap(dayIndex: number, mealType: MealType) {
    setSwappingSlot({ dayIndex, mealType })
    swapMeal.mutate(
      { dayIndex, mealType },
      { onSettled: () => setSwappingSlot(null) }
    )
  }

  // Group meals by day
  const mealsByDay = new Map<number, MealPlanMealDetail[]>()
  for (let i = 0; i < 7; i++) {
    mealsByDay.set(i, meals.filter((m) => m.dayIndex === i))
  }

  return (
    <>
      {/* Desktop: 7-column grid */}
      <div className="hidden lg:grid lg:grid-cols-7 lg:gap-3">
        {Array.from({ length: 7 }, (_, i) => (
          <DayColumn
            key={i}
            dayIndex={i}
            meals={mealsByDay.get(i) ?? []}
            onSwap={handleSwap}
            swappingSlot={swappingSlot}
          />
        ))}
      </div>

      {/* Mobile: tabbed day view */}
      <div className="lg:hidden">
        <Tabs defaultValue="0">
          <TabsList className="grid w-full grid-cols-7">
            {DAY_NAMES.map((name, i) => (
              <TabsTrigger key={i} value={String(i)} className="text-xs px-1">
                {name}
              </TabsTrigger>
            ))}
          </TabsList>
          {Array.from({ length: 7 }, (_, i) => (
            <TabsContent key={i} value={String(i)}>
              <DayColumn
                dayIndex={i}
                meals={mealsByDay.get(i) ?? []}
                onSwap={handleSwap}
                swappingSlot={swappingSlot}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </>
  )
}
