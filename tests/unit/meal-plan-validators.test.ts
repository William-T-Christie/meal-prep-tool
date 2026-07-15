import { describe, it, expect } from 'vitest'
import { generateMealPlanSchema, swapMealSchema } from '@/lib/validators/meal-plan'

describe('generateMealPlanSchema', () => {
  it('accepts valid date string', () => {
    const result = generateMealPlanSchema.safeParse({ weekStartDate: '2026-04-20' })
    expect(result.success).toBe(true)
  })

  it('accepts ISO date string', () => {
    const result = generateMealPlanSchema.safeParse({ weekStartDate: '2026-04-20T00:00:00.000Z' })
    expect(result.success).toBe(true)
  })

  it('coerces string to Date', () => {
    const result = generateMealPlanSchema.safeParse({ weekStartDate: '2026-04-20' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.weekStartDate).toBeInstanceOf(Date)
    }
  })

  it('rejects missing weekStartDate', () => {
    const result = generateMealPlanSchema.safeParse({})
    expect(result.success).toBe(false)
  })
})

describe('swapMealSchema', () => {
  it('accepts valid swap input', () => {
    const result = swapMealSchema.safeParse({ dayIndex: 0, mealType: 'BREAKFAST' })
    expect(result.success).toBe(true)
  })

  it('accepts all meal types', () => {
    for (const type of ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK']) {
      const result = swapMealSchema.safeParse({ dayIndex: 3, mealType: type })
      expect(result.success).toBe(true)
    }
  })

  it('rejects dayIndex 7', () => {
    const result = swapMealSchema.safeParse({ dayIndex: 7, mealType: 'LUNCH' })
    expect(result.success).toBe(false)
  })

  it('rejects negative dayIndex', () => {
    const result = swapMealSchema.safeParse({ dayIndex: -1, mealType: 'LUNCH' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid mealType', () => {
    const result = swapMealSchema.safeParse({ dayIndex: 0, mealType: 'BRUNCH' })
    expect(result.success).toBe(false)
  })
})
