import type {
  CookingSkill,
  AllergySeverity,
  DietaryType,
  CuisinePreferenceLevel,
  MealType,
  Difficulty,
} from '@/generated/prisma/client'

export type { CookingSkill, AllergySeverity, DietaryType, CuisinePreferenceLevel, MealType, Difficulty }

export interface UserProfile {
  id: string
  cookingSkill: CookingSkill
  budgetWeekly: number | null
  householdSize: number
  onboardingCompleted: boolean
}

export interface UserAllergy {
  id: string
  name: string
  severity: AllergySeverity
}

export interface UserDietaryRestriction {
  id: string
  type: DietaryType
}

export interface UserCuisinePreference {
  id: string
  cuisine: string
  preference: CuisinePreferenceLevel
}

export interface UserCookingPreference {
  id: string
  mealType: MealType
  maxTimeMinutes: number
}

export interface UserMacroGoal {
  id: string
  mealType: MealType
  calories: number
  proteinG: number
  carbsG: number
  fatG: number
}

export interface UserKitchenEquipment {
  id: string
  equipmentName: string
}

export interface FullUserProfile {
  profile: UserProfile | null
  allergies: UserAllergy[]
  dietaryRestrictions: UserDietaryRestriction[]
  cuisinePreferences: UserCuisinePreference[]
  cookingPreferences: UserCookingPreference[]
  macroGoals: UserMacroGoal[]
  kitchenEquipment: UserKitchenEquipment[]
}

// ──────────────────────────────────────────────
// Recipe types - Phase 2
// ──────────────────────────────────────────────

export interface RecipeIngredient {
  id: string
  quantity: number | null
  unit: string | null
  name: string
  notes: string | null
  orderIndex: number
}

export interface RecipeInstruction {
  id: string
  stepNumber: number
  instructionText: string
  durationMinutes: number | null
}

export interface RecipeTag {
  id: string
  tagName: string
}

export interface RecipeNutrition {
  id: string
  caloriesPerServing: number
  proteinG: number
  carbsG: number
  fatG: number
  fiberG: number | null
  sugarG: number | null
}

export interface RecipeSummary {
  id: string
  title: string
  description: string | null
  totalTimeMinutes: number
  difficulty: Difficulty
  cuisineType: string | null
  imageUrl: string | null
  baseServings: number
  tags: RecipeTag[]
  createdAt: string
}

export interface RecipeDetail {
  id: string
  userId: string
  title: string
  description: string | null
  prepTimeMinutes: number
  cookTimeMinutes: number
  totalTimeMinutes: number
  baseServings: number
  difficulty: Difficulty
  cuisineType: string | null
  imageUrl: string | null
  sourceUrl: string | null
  isAiGenerated: boolean
  createdAt: string
  updatedAt: string
  ingredients: RecipeIngredient[]
  instructions: RecipeInstruction[]
  tags: RecipeTag[]
  nutrition: RecipeNutrition | null
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ScaledIngredient extends RecipeIngredient {
  scaledQuantity: number | null
  displayQuantity: string
}

// ──────────────────────────────────────────────
// Meal Plan types - Phase 3
// ──────────────────────────────────────────────

export type MealPlanStatus = 'GENERATING' | 'READY' | 'FAILED'

export interface MealPlanSummary {
  id: string
  title: string
  weekStartDate: string
  status: MealPlanStatus
  createdAt: string
}

export interface MealPlanMealDetail {
  id: string
  dayIndex: number
  mealType: MealType
  recipe: RecipeDetail
}

export interface MealPlanDetail {
  id: string
  title: string
  weekStartDate: string
  status: MealPlanStatus
  createdAt: string
  updatedAt: string
  meals: MealPlanMealDetail[]
}

export interface DayMacroSummary {
  dayIndex: number
  calories: number
  proteinG: number
  carbsG: number
  fatG: number
}

export interface WeekMacroSummary {
  daily: DayMacroSummary[]
  weeklyAverage: Omit<DayMacroSummary, 'dayIndex'>
}

// ──────────────────────────────────────────────
// Shopping List types - Phase 4
// ──────────────────────────────────────────────

export type IngredientCategory =
  | 'produce'
  | 'dairy'
  | 'meat'
  | 'seafood'
  | 'pantry'
  | 'spices'
  | 'bakery'
  | 'frozen'
  | 'beverages'
  | 'other'

export interface ShoppingListItem {
  id: string
  name: string
  quantity: number | null
  displayQuantity: string
  unit: string | null
  category: IngredientCategory
  notes: string[]
  checked: boolean
  recipeNames: string[]
}

export interface ShoppingListCategory {
  category: IngredientCategory
  label: string
  items: ShoppingListItem[]
}

export interface ShoppingListData {
  mealPlanId: string
  mealPlanTitle: string
  categories: ShoppingListCategory[]
  totalItems: number
}
