import { describe, it, expect } from 'vitest'
import {
  createRecipeSchema,
  updateRecipeSchema,
  recipeListQuerySchema,
  recipeIngredientSchema,
  recipeInstructionSchema,
} from '@/lib/validators/recipe'

const validRecipe = {
  title: 'Pasta Carbonara',
  description: 'Classic Italian pasta dish',
  prepTimeMinutes: 10,
  cookTimeMinutes: 20,
  baseServings: 4,
  difficulty: 'MEDIUM',
  cuisineType: 'Italian',
  ingredients: [
    { quantity: 1, unit: 'lb', name: 'spaghetti', orderIndex: 0 },
    { quantity: 4, unit: 'slice', name: 'bacon', orderIndex: 1 },
  ],
  instructions: [
    { stepNumber: 1, instructionText: 'Cook pasta according to package directions' },
    { stepNumber: 2, instructionText: 'Fry bacon until crispy' },
  ],
  tags: [{ tagName: 'Quick' }, { tagName: 'Comfort Food' }],
}

describe('createRecipeSchema', () => {
  it('accepts valid full recipe data', () => {
    const result = createRecipeSchema.safeParse(validRecipe)
    expect(result.success).toBe(true)
  })

  it('accepts minimal recipe (no description, tags, nutrition)', () => {
    const result = createRecipeSchema.safeParse({
      title: 'Simple Toast',
      prepTimeMinutes: 1,
      cookTimeMinutes: 3,
      baseServings: 1,
      difficulty: 'EASY',
      ingredients: [{ quantity: 2, unit: 'slice', name: 'bread', orderIndex: 0 }],
      instructions: [{ stepNumber: 1, instructionText: 'Toast the bread' }],
    })
    expect(result.success).toBe(true)
  })

  it('rejects missing title', () => {
    const { title, ...rest } = validRecipe
    const result = createRecipeSchema.safeParse(rest)
    expect(result.success).toBe(false)
  })

  it('rejects empty ingredients array', () => {
    const result = createRecipeSchema.safeParse({ ...validRecipe, ingredients: [] })
    expect(result.success).toBe(false)
  })

  it('rejects empty instructions array', () => {
    const result = createRecipeSchema.safeParse({ ...validRecipe, instructions: [] })
    expect(result.success).toBe(false)
  })

  it('rejects negative prepTimeMinutes', () => {
    const result = createRecipeSchema.safeParse({ ...validRecipe, prepTimeMinutes: -5 })
    expect(result.success).toBe(false)
  })

  it('rejects baseServings of 0', () => {
    const result = createRecipeSchema.safeParse({ ...validRecipe, baseServings: 0 })
    expect(result.success).toBe(false)
  })

  it('rejects invalid difficulty', () => {
    const result = createRecipeSchema.safeParse({ ...validRecipe, difficulty: 'IMPOSSIBLE' })
    expect(result.success).toBe(false)
  })

  it('accepts optional nutrition', () => {
    const result = createRecipeSchema.safeParse({
      ...validRecipe,
      nutrition: { caloriesPerServing: 450, proteinG: 20, carbsG: 55, fatG: 18 },
    })
    expect(result.success).toBe(true)
  })
})

describe('updateRecipeSchema', () => {
  it('accepts partial updates (just title)', () => {
    const result = updateRecipeSchema.safeParse({ title: 'New Title' })
    expect(result.success).toBe(true)
  })

  it('accepts empty object', () => {
    const result = updateRecipeSchema.safeParse({})
    expect(result.success).toBe(true)
  })
})

describe('recipeListQuerySchema', () => {
  it('accepts valid query', () => {
    const result = recipeListQuerySchema.safeParse({
      search: 'pasta',
      difficulty: 'EASY',
      sortBy: 'newest',
      page: '1',
      pageSize: '12',
    })
    expect(result.success).toBe(true)
  })

  it('defaults page to 1 and pageSize to 12', () => {
    const result = recipeListQuerySchema.safeParse({})
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.page).toBe(1)
      expect(result.data.pageSize).toBe(12)
      expect(result.data.sortBy).toBe('newest')
    }
  })

  it('coerces string numbers', () => {
    const result = recipeListQuerySchema.safeParse({ page: '3', maxTotalTime: '30' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.page).toBe(3)
      expect(result.data.maxTotalTime).toBe(30)
    }
  })
})

describe('recipeIngredientSchema', () => {
  it('accepts ingredient with null quantity', () => {
    const result = recipeIngredientSchema.safeParse({
      name: 'salt',
      orderIndex: 0,
      quantity: null,
    })
    expect(result.success).toBe(true)
  })

  it('rejects empty name', () => {
    const result = recipeIngredientSchema.safeParse({
      name: '',
      orderIndex: 0,
    })
    expect(result.success).toBe(false)
  })
})

describe('recipeInstructionSchema', () => {
  it('accepts instruction with optional duration', () => {
    const result = recipeInstructionSchema.safeParse({
      stepNumber: 1,
      instructionText: 'Mix ingredients',
      durationMinutes: 5,
    })
    expect(result.success).toBe(true)
  })

  it('rejects step number 0', () => {
    const result = recipeInstructionSchema.safeParse({
      stepNumber: 0,
      instructionText: 'Do something',
    })
    expect(result.success).toBe(false)
  })
})
