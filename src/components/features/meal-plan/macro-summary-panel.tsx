'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { computeMacroSummary } from '@/lib/nutrition/macro-summary'
import type { MealPlanMealDetail, UserMacroGoal } from '@/types'

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

interface MacroSummaryPanelProps {
  meals: MealPlanMealDetail[]
  macroGoals: UserMacroGoal[]
}

export function MacroSummaryPanel({ meals, macroGoals }: MacroSummaryPanelProps) {
  const summary = useMemo(() => computeMacroSummary(meals), [meals])

  // Compute daily targets (sum all meal type goals)
  const dailyTarget = macroGoals.reduce(
    (acc, goal) => ({
      calories: acc.calories + goal.calories,
      proteinG: acc.proteinG + goal.proteinG,
      carbsG: acc.carbsG + goal.carbsG,
      fatG: acc.fatG + goal.fatG,
    }),
    { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 }
  )

  const hasDailyTarget = dailyTarget.calories > 0

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Weekly Nutrition Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Weekly average */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <MacroItem label="Avg Calories" value={summary.weeklyAverage.calories} target={hasDailyTarget ? dailyTarget.calories : undefined} unit="" />
          <MacroItem label="Avg Protein" value={summary.weeklyAverage.proteinG} target={hasDailyTarget ? dailyTarget.proteinG : undefined} unit="g" />
          <MacroItem label="Avg Carbs" value={summary.weeklyAverage.carbsG} target={hasDailyTarget ? dailyTarget.carbsG : undefined} unit="g" />
          <MacroItem label="Avg Fat" value={summary.weeklyAverage.fatG} target={hasDailyTarget ? dailyTarget.fatG : undefined} unit="g" />
        </div>

        {/* Daily breakdown */}
        {hasDailyTarget && (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground">Daily Calories vs Target</h4>
            {summary.daily.map((day) => {
              const pct = dailyTarget.calories > 0 ? Math.min(100, (day.calories / dailyTarget.calories) * 100) : 0
              return (
                <div key={day.dayIndex} className="flex items-center gap-2">
                  <span className="w-8 text-xs text-muted-foreground">{DAY_NAMES[day.dayIndex]}</span>
                  <Progress value={pct} className="flex-1 h-2" />
                  <span className="w-16 text-right text-xs">{day.calories} cal</span>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function MacroItem({ label, value, target, unit }: { label: string; value: number; target?: number; unit: string }) {
  const color = target
    ? Math.abs(value - target) / target < 0.1 ? 'text-green-600' : Math.abs(value - target) / target < 0.2 ? 'text-yellow-600' : 'text-red-600'
    : ''

  return (
    <div>
      <div className={`text-lg font-semibold ${color}`}>{value}{unit}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
      {target !== undefined && <div className="text-xs text-muted-foreground">/{target}{unit}</div>}
    </div>
  )
}
