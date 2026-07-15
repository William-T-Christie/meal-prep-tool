import type { MealPlanMealDetail, DayMacroSummary, WeekMacroSummary } from '@/types'

/**
 * Compute daily and weekly macro summaries from a meal plan's meals.
 * Assumes AI-generated recipes always have nutrition data.
 */
export function computeMacroSummary(meals: MealPlanMealDetail[]): WeekMacroSummary {
  const dailyMap = new Map<number, DayMacroSummary>()

  // Initialize all 7 days
  for (let i = 0; i < 7; i++) {
    dailyMap.set(i, { dayIndex: i, calories: 0, proteinG: 0, carbsG: 0, fatG: 0 })
  }

  // Sum up nutrition for each day
  for (const meal of meals) {
    const nutrition = meal.recipe.nutrition
    if (!nutrition) continue

    const day = dailyMap.get(meal.dayIndex)
    if (!day) continue

    day.calories += nutrition.caloriesPerServing
    day.proteinG += nutrition.proteinG
    day.carbsG += nutrition.carbsG
    day.fatG += nutrition.fatG
  }

  const daily = Array.from(dailyMap.values()).sort((a, b) => a.dayIndex - b.dayIndex)

  // Compute weekly averages
  const totalDays = daily.length || 1
  const weeklyAverage = {
    calories: Math.round(daily.reduce((sum, d) => sum + d.calories, 0) / totalDays),
    proteinG: Math.round(daily.reduce((sum, d) => sum + d.proteinG, 0) / totalDays),
    carbsG: Math.round(daily.reduce((sum, d) => sum + d.carbsG, 0) / totalDays),
    fatG: Math.round(daily.reduce((sum, d) => sum + d.fatG, 0) / totalDays),
  }

  return { daily, weeklyAverage }
}
