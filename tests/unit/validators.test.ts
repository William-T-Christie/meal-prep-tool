import { describe, it, expect } from 'vitest'
import {
  profileSchema,
  allergySchema,
  dietaryRestrictionSchema,
  cuisinePreferenceSchema,
  cookingPreferenceSchema,
  macroGoalSchema,
  kitchenEquipmentSchema,
  onboardingSchema,
} from '@/lib/validators/profile'

describe('profileSchema', () => {
  it('accepts valid profile data', () => {
    const result = profileSchema.safeParse({
      cookingSkill: 'BEGINNER',
      householdSize: 2,
      budgetWeekly: 150,
    })
    expect(result.success).toBe(true)
  })

  it('accepts optional budgetWeekly', () => {
    const result = profileSchema.safeParse({
      cookingSkill: 'ADVANCED',
      householdSize: 1,
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid cooking skill', () => {
    const result = profileSchema.safeParse({
      cookingSkill: 'EXPERT',
      householdSize: 1,
    })
    expect(result.success).toBe(false)
  })

  it('rejects householdSize of 0', () => {
    const result = profileSchema.safeParse({
      cookingSkill: 'BEGINNER',
      householdSize: 0,
    })
    expect(result.success).toBe(false)
  })

  it('rejects householdSize over 20', () => {
    const result = profileSchema.safeParse({
      cookingSkill: 'BEGINNER',
      householdSize: 21,
    })
    expect(result.success).toBe(false)
  })

  it('rejects negative budget', () => {
    const result = profileSchema.safeParse({
      cookingSkill: 'BEGINNER',
      householdSize: 1,
      budgetWeekly: -50,
    })
    expect(result.success).toBe(false)
  })
})

describe('allergySchema', () => {
  it('accepts valid allergy', () => {
    const result = allergySchema.safeParse({ name: 'Peanuts', severity: 'STRICT' })
    expect(result.success).toBe(true)
  })

  it('rejects empty name', () => {
    const result = allergySchema.safeParse({ name: '', severity: 'STRICT' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid severity', () => {
    const result = allergySchema.safeParse({ name: 'Peanuts', severity: 'HIGH' })
    expect(result.success).toBe(false)
  })
})

describe('dietaryRestrictionSchema', () => {
  it('accepts valid restriction', () => {
    const result = dietaryRestrictionSchema.safeParse({ type: 'VEGAN' })
    expect(result.success).toBe(true)
  })

  it('rejects invalid type', () => {
    const result = dietaryRestrictionSchema.safeParse({ type: 'CARNIVORE' })
    expect(result.success).toBe(false)
  })
})

describe('cuisinePreferenceSchema', () => {
  it('accepts valid preference', () => {
    const result = cuisinePreferenceSchema.safeParse({ cuisine: 'Italian', preference: 'LOVE' })
    expect(result.success).toBe(true)
  })

  it('rejects invalid preference level', () => {
    const result = cuisinePreferenceSchema.safeParse({ cuisine: 'Italian', preference: 'HATE' })
    expect(result.success).toBe(false)
  })
})

describe('cookingPreferenceSchema', () => {
  it('accepts valid cooking preference', () => {
    const result = cookingPreferenceSchema.safeParse({
      mealType: 'DINNER',
      maxTimeMinutes: 45,
    })
    expect(result.success).toBe(true)
  })

  it('rejects maxTimeMinutes below 5', () => {
    const result = cookingPreferenceSchema.safeParse({
      mealType: 'DINNER',
      maxTimeMinutes: 3,
    })
    expect(result.success).toBe(false)
  })

  it('rejects maxTimeMinutes above 480', () => {
    const result = cookingPreferenceSchema.safeParse({
      mealType: 'DINNER',
      maxTimeMinutes: 500,
    })
    expect(result.success).toBe(false)
  })
})

describe('macroGoalSchema', () => {
  it('accepts valid macro goals', () => {
    const result = macroGoalSchema.safeParse({
      mealType: 'BREAKFAST',
      calories: 500,
      proteinG: 30,
      carbsG: 60,
      fatG: 15,
    })
    expect(result.success).toBe(true)
  })

  it('rejects negative calories', () => {
    const result = macroGoalSchema.safeParse({
      mealType: 'BREAKFAST',
      calories: -100,
      proteinG: 30,
      carbsG: 60,
      fatG: 15,
    })
    expect(result.success).toBe(false)
  })

  it('rejects calories above 5000', () => {
    const result = macroGoalSchema.safeParse({
      mealType: 'BREAKFAST',
      calories: 6000,
      proteinG: 30,
      carbsG: 60,
      fatG: 15,
    })
    expect(result.success).toBe(false)
  })
})

describe('kitchenEquipmentSchema', () => {
  it('accepts valid equipment', () => {
    const result = kitchenEquipmentSchema.safeParse({ equipmentName: 'Air Fryer' })
    expect(result.success).toBe(true)
  })

  it('rejects empty name', () => {
    const result = kitchenEquipmentSchema.safeParse({ equipmentName: '' })
    expect(result.success).toBe(false)
  })
})

describe('onboardingSchema', () => {
  it('accepts valid full onboarding data', () => {
    const result = onboardingSchema.safeParse({
      profile: { cookingSkill: 'INTERMEDIATE', householdSize: 4, budgetWeekly: 200 },
      allergies: [{ name: 'Peanuts', severity: 'STRICT' }],
      dietaryRestrictions: [{ type: 'GLUTEN_FREE' }],
      cuisinePreferences: [{ cuisine: 'Italian', preference: 'LOVE' }],
      cookingPreferences: [{ mealType: 'DINNER', maxTimeMinutes: 60 }],
      macroGoals: [{ mealType: 'DINNER', calories: 700, proteinG: 40, carbsG: 80, fatG: 25 }],
      kitchenEquipment: [{ equipmentName: 'Oven' }],
    })
    expect(result.success).toBe(true)
  })

  it('accepts minimal onboarding data (empty arrays)', () => {
    const result = onboardingSchema.safeParse({
      profile: { cookingSkill: 'BEGINNER', householdSize: 1 },
      allergies: [],
      dietaryRestrictions: [],
      cuisinePreferences: [],
      cookingPreferences: [],
      macroGoals: [],
      kitchenEquipment: [],
    })
    expect(result.success).toBe(true)
  })

  it('rejects when profile is missing', () => {
    const result = onboardingSchema.safeParse({
      allergies: [],
      dietaryRestrictions: [],
      cuisinePreferences: [],
      cookingPreferences: [],
      macroGoals: [],
      kitchenEquipment: [],
    })
    expect(result.success).toBe(false)
  })
})
