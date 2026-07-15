import { describe, it, expect } from 'vitest'
import { aiMealPlanOutputSchema, aiRecipeSchema, aiSingleMealOutputSchema } from '@/lib/ai/schemas/meal-plan'

const validRecipe = {
  title: 'Grilled Chicken Salad',
  description: 'A healthy grilled chicken salad',
  prepTimeMinutes: 15,
  cookTimeMinutes: 20,
  baseServings: 4,
  difficulty: 'EASY',
  cuisineType: 'Mediterranean',
  ingredients: [
    { quantity: 2, unit: 'lb', name: 'chicken breast', notes: 'boneless', orderIndex: 0 },
    { quantity: 4, unit: 'cup', name: 'mixed greens', notes: null, orderIndex: 1 },
  ],
  instructions: [
    { stepNumber: 1, instructionText: 'Season and grill the chicken', durationMinutes: 15 },
    { stepNumber: 2, instructionText: 'Assemble the salad', durationMinutes: null },
  ],
  tags: [{ tagName: 'Healthy' }, { tagName: 'High Protein' }],
  nutrition: { caloriesPerServing: 350, proteinG: 40, carbsG: 15, fatG: 12 },
}

function makeMeals(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    dayIndex: Math.floor(i / 4),
    mealType: ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'][i % 4],
    recipe: { ...validRecipe, title: `Recipe ${i + 1}` },
  }))
}

describe('aiRecipeSchema', () => {
  it('accepts valid recipe with nutrition', () => {
    const result = aiRecipeSchema.safeParse(validRecipe)
    expect(result.success).toBe(true)
  })

  it('rejects recipe without nutrition', () => {
    const { nutrition, ...noNutrition } = validRecipe
    const result = aiRecipeSchema.safeParse(noNutrition)
    expect(result.success).toBe(false)
  })

  it('rejects recipe with empty ingredients', () => {
    const result = aiRecipeSchema.safeParse({ ...validRecipe, ingredients: [] })
    expect(result.success).toBe(false)
  })

  it('rejects recipe with empty instructions', () => {
    const result = aiRecipeSchema.safeParse({ ...validRecipe, instructions: [] })
    expect(result.success).toBe(false)
  })
})

describe('aiMealPlanOutputSchema', () => {
  it('accepts valid 28-meal plan', () => {
    const result = aiMealPlanOutputSchema.safeParse({ meals: makeMeals(28) })
    expect(result.success).toBe(true)
  })

  it('rejects fewer than 28 meals', () => {
    const result = aiMealPlanOutputSchema.safeParse({ meals: makeMeals(20) })
    expect(result.success).toBe(false)
  })

  it('rejects more than 28 meals', () => {
    const result = aiMealPlanOutputSchema.safeParse({ meals: makeMeals(30) })
    expect(result.success).toBe(false)
  })

  it('rejects invalid dayIndex (7)', () => {
    const meals = makeMeals(28)
    meals[0] = { ...meals[0]!, dayIndex: 7 }
    const result = aiMealPlanOutputSchema.safeParse({ meals })
    expect(result.success).toBe(false)
  })

  it('rejects invalid mealType', () => {
    const meals = makeMeals(28)
    meals[0] = { ...meals[0]!, mealType: 'BRUNCH' }
    const result = aiMealPlanOutputSchema.safeParse({ meals })
    expect(result.success).toBe(false)
  })
})

describe('aiSingleMealOutputSchema', () => {
  it('accepts valid single meal', () => {
    const result = aiSingleMealOutputSchema.safeParse({ recipe: validRecipe })
    expect(result.success).toBe(true)
  })

  it('rejects without recipe', () => {
    const result = aiSingleMealOutputSchema.safeParse({})
    expect(result.success).toBe(false)
  })
})
