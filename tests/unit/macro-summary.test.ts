import { describe, it, expect } from 'vitest'
import { computeMacroSummary } from '@/lib/nutrition/macro-summary'
import type { MealPlanMealDetail } from '@/types'

function makeMeal(dayIndex: number, mealType: string, calories: number, protein: number, carbs: number, fat: number): MealPlanMealDetail {
  return {
    id: `meal-${dayIndex}-${mealType}`,
    dayIndex,
    mealType: mealType as MealPlanMealDetail['mealType'],
    recipe: {
      id: `recipe-${dayIndex}-${mealType}`,
      userId: 'user1',
      title: `Recipe ${dayIndex}-${mealType}`,
      description: null,
      prepTimeMinutes: 10,
      cookTimeMinutes: 20,
      totalTimeMinutes: 30,
      baseServings: 4,
      difficulty: 'EASY',
      cuisineType: null,
      imageUrl: null,
      sourceUrl: null,
      isAiGenerated: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ingredients: [],
      instructions: [],
      tags: [],
      nutrition: {
        id: `nutr-${dayIndex}-${mealType}`,
        caloriesPerServing: calories,
        proteinG: protein,
        carbsG: carbs,
        fatG: fat,
        fiberG: null,
        sugarG: null,
      },
    },
  }
}

describe('computeMacroSummary', () => {
  it('computes correct daily totals', () => {
    const meals = [
      makeMeal(0, 'BREAKFAST', 400, 30, 50, 15),
      makeMeal(0, 'LUNCH', 600, 40, 60, 20),
      makeMeal(0, 'DINNER', 700, 45, 70, 25),
      makeMeal(0, 'SNACK', 200, 10, 30, 5),
    ]

    const summary = computeMacroSummary(meals)
    const monday = summary.daily[0]!

    expect(monday.calories).toBe(1900)
    expect(monday.proteinG).toBe(125)
    expect(monday.carbsG).toBe(210)
    expect(monday.fatG).toBe(65)
  })

  it('computes correct weekly average', () => {
    // Same meals for 2 days, rest are zero
    const meals = [
      makeMeal(0, 'BREAKFAST', 400, 30, 50, 15),
      makeMeal(1, 'BREAKFAST', 600, 40, 60, 20),
    ]

    const summary = computeMacroSummary(meals)

    // Average across 7 days: (400+600)/7 = ~143
    expect(summary.weeklyAverage.calories).toBe(Math.round(1000 / 7))
  })

  it('handles empty meals array', () => {
    const summary = computeMacroSummary([])
    expect(summary.daily).toHaveLength(7)
    expect(summary.daily.every((d) => d.calories === 0)).toBe(true)
    expect(summary.weeklyAverage.calories).toBe(0)
  })

  it('handles meals without nutrition gracefully', () => {
    const meal: MealPlanMealDetail = {
      id: 'meal-1',
      dayIndex: 0,
      mealType: 'BREAKFAST',
      recipe: {
        id: 'recipe-1',
        userId: 'user1',
        title: 'Test',
        description: null,
        prepTimeMinutes: 5,
        cookTimeMinutes: 10,
        totalTimeMinutes: 15,
        baseServings: 1,
        difficulty: 'EASY',
        cuisineType: null,
        imageUrl: null,
        sourceUrl: null,
        isAiGenerated: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ingredients: [],
        instructions: [],
        tags: [],
        nutrition: null,
      },
    }

    const summary = computeMacroSummary([meal])
    expect(summary.daily[0]!.calories).toBe(0)
  })
})
