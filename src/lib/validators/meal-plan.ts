import { z } from 'zod/v4'

export const generateMealPlanSchema = z.object({
  weekStartDate: z.coerce.date(),
})

export const swapMealSchema = z.object({
  dayIndex: z.number().int().min(0).max(6),
  mealType: z.enum(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK']),
})

export type GenerateMealPlanInput = z.infer<typeof generateMealPlanSchema>
export type SwapMealInput = z.infer<typeof swapMealSchema>
