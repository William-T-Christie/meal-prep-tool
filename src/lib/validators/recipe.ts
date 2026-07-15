import { z } from 'zod/v4'

export const recipeIngredientSchema = z.object({
  quantity: z.number().positive().nullable().optional(),
  unit: z.string().max(30).nullable().optional(),
  name: z.string().min(1).max(200),
  notes: z.string().max(500).nullable().optional(),
  orderIndex: z.number().int().min(0),
})

export const recipeInstructionSchema = z.object({
  stepNumber: z.number().int().min(1),
  instructionText: z.string().min(1).max(2000),
  durationMinutes: z.number().int().min(1).max(480).nullable().optional(),
})

export const recipeTagSchema = z.object({
  tagName: z.string().min(1).max(50),
})

export const recipeNutritionSchema = z.object({
  caloriesPerServing: z.number().int().min(0),
  proteinG: z.number().min(0),
  carbsG: z.number().min(0),
  fatG: z.number().min(0),
  fiberG: z.number().min(0).nullable().optional(),
  sugarG: z.number().min(0).nullable().optional(),
})

export const createRecipeSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).nullable().optional(),
  prepTimeMinutes: z.number().int().min(0).max(1440),
  cookTimeMinutes: z.number().int().min(0).max(1440),
  baseServings: z.number().int().min(1).max(100),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
  cuisineType: z.string().max(50).nullable().optional(),
  imageUrl: z.string().url().nullable().optional(),
  sourceUrl: z.string().url().nullable().optional(),
  isAiGenerated: z.boolean().optional().default(false),
  ingredients: z.array(recipeIngredientSchema).min(1),
  instructions: z.array(recipeInstructionSchema).min(1),
  tags: z.array(recipeTagSchema).optional().default([]),
  nutrition: recipeNutritionSchema.nullable().optional(),
})

export const updateRecipeSchema = createRecipeSchema.partial()

export const recipeListQuerySchema = z.object({
  search: z.string().optional(),
  cuisineType: z.string().optional(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).optional(),
  maxTotalTime: z.coerce.number().int().positive().optional(),
  tags: z.union([z.string(), z.array(z.string())]).optional(),
  sortBy: z.enum(['newest', 'alphabetical', 'cook_time']).optional().default('newest'),
  page: z.coerce.number().int().min(1).optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(50).optional().default(12),
})

export type RecipeIngredientInput = z.infer<typeof recipeIngredientSchema>
export type RecipeInstructionInput = z.infer<typeof recipeInstructionSchema>
export type RecipeTagInput = z.infer<typeof recipeTagSchema>
export type RecipeNutritionInput = z.infer<typeof recipeNutritionSchema>
export type CreateRecipeInput = z.infer<typeof createRecipeSchema>
export type UpdateRecipeInput = z.infer<typeof updateRecipeSchema>
export type RecipeListQuery = z.infer<typeof recipeListQuerySchema>
