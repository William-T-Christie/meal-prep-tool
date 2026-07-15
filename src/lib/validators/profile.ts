import { z } from 'zod/v4'

export const profileSchema = z.object({
  cookingSkill: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  budgetWeekly: z.number().positive().optional(),
  householdSize: z.number().int().min(1).max(20),
})

export const allergySchema = z.object({
  name: z.string().min(1).max(100),
  severity: z.enum(['STRICT', 'MILD']),
})

export const dietaryRestrictionSchema = z.object({
  type: z.enum([
    'VEGAN', 'VEGETARIAN', 'PESCATARIAN', 'KETO', 'PALEO',
    'GLUTEN_FREE', 'DAIRY_FREE', 'LOW_SODIUM', 'HALAL', 'KOSHER',
  ]),
})

export const cuisinePreferenceSchema = z.object({
  cuisine: z.string().min(1).max(50),
  preference: z.enum(['LOVE', 'LIKE', 'NEUTRAL', 'DISLIKE']),
})

export const cookingPreferenceSchema = z.object({
  mealType: z.enum(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK']),
  maxTimeMinutes: z.number().int().min(5).max(480),
})

export const macroGoalSchema = z.object({
  mealType: z.enum(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK']),
  calories: z.number().int().min(0).max(5000),
  proteinG: z.number().min(0).max(500),
  carbsG: z.number().min(0).max(1000),
  fatG: z.number().min(0).max(500),
})

export const kitchenEquipmentSchema = z.object({
  equipmentName: z.string().min(1).max(100),
})

export const onboardingSchema = z.object({
  profile: profileSchema,
  allergies: z.array(allergySchema),
  dietaryRestrictions: z.array(dietaryRestrictionSchema),
  cuisinePreferences: z.array(cuisinePreferenceSchema),
  cookingPreferences: z.array(cookingPreferenceSchema),
  macroGoals: z.array(macroGoalSchema),
  kitchenEquipment: z.array(kitchenEquipmentSchema),
})

export type ProfileInput = z.infer<typeof profileSchema>
export type AllergyInput = z.infer<typeof allergySchema>
export type DietaryRestrictionInput = z.infer<typeof dietaryRestrictionSchema>
export type CuisinePreferenceInput = z.infer<typeof cuisinePreferenceSchema>
export type CookingPreferenceInput = z.infer<typeof cookingPreferenceSchema>
export type MacroGoalInput = z.infer<typeof macroGoalSchema>
export type KitchenEquipmentInput = z.infer<typeof kitchenEquipmentSchema>
export type OnboardingData = z.infer<typeof onboardingSchema>
