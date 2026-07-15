import type { MealPlanDetail, ShoppingListData, ShoppingListCategory } from '@/types'
import { INGREDIENT_CATEGORIES } from '@/lib/constants/shopping'
import { consolidateIngredients } from './consolidate'

/**
 * Generate a complete shopping list from a meal plan.
 * Consolidates ingredients across all recipes and groups by store category.
 */
export function generateShoppingList(plan: MealPlanDetail): ShoppingListData {
  const allItems = consolidateIngredients(plan.meals)

  // Group by category
  const categoryMap = new Map<string, typeof allItems>()
  for (const item of allItems) {
    const existing = categoryMap.get(item.category) ?? []
    existing.push(item)
    categoryMap.set(item.category, existing)
  }

  // Build ordered category list (only include categories that have items)
  const categories: ShoppingListCategory[] = INGREDIENT_CATEGORIES
    .filter((cat) => categoryMap.has(cat.value))
    .map((cat) => ({
      category: cat.value,
      label: cat.label,
      items: categoryMap.get(cat.value) ?? [],
    }))

  return {
    mealPlanId: plan.id,
    mealPlanTitle: plan.title,
    categories,
    totalItems: allItems.length,
  }
}

export { consolidateIngredients } from './consolidate'
export { classifyIngredient } from './categories'
