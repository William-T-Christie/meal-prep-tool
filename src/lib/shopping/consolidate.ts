import type { MealPlanMealDetail, ShoppingListItem } from '@/types'
import { formatQuantity } from '@/lib/scaling/fractions'
import { classifyIngredient } from './categories'

interface ConsolidationEntry {
  name: string
  quantity: number | null
  unit: string | null
  notes: Set<string>
  recipeNames: Set<string>
}

function makeKey(name: string, unit: string | null): string {
  return `${name.toLowerCase().trim()}|${(unit ?? '').toLowerCase().trim()}`
}

/**
 * Consolidate ingredients from all meals in a plan.
 * Merges items with matching name+unit. Keeps null-quantity items separate.
 */
export function consolidateIngredients(meals: MealPlanMealDetail[]): ShoppingListItem[] {
  const map = new Map<string, ConsolidationEntry>()
  const nullItems: ShoppingListItem[] = []
  let idCounter = 0

  for (const meal of meals) {
    const recipeName = meal.recipe.title

    for (const ingredient of meal.recipe.ingredients) {
      // Null-quantity items (e.g., "salt to taste") are never merged
      if (ingredient.quantity === null) {
        nullItems.push({
          id: `item-${idCounter++}`,
          name: ingredient.name,
          quantity: null,
          displayQuantity: '',
          unit: ingredient.unit,
          category: classifyIngredient(ingredient.name),
          notes: ingredient.notes ? [ingredient.notes] : [],
          checked: false,
          recipeNames: [recipeName],
        })
        continue
      }

      const key = makeKey(ingredient.name, ingredient.unit)
      const existing = map.get(key)

      if (existing) {
        existing.quantity = (existing.quantity ?? 0) + ingredient.quantity
        if (ingredient.notes) existing.notes.add(ingredient.notes)
        existing.recipeNames.add(recipeName)
      } else {
        const entry: ConsolidationEntry = {
          name: ingredient.name,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
          notes: new Set(ingredient.notes ? [ingredient.notes] : []),
          recipeNames: new Set([recipeName]),
        }
        map.set(key, entry)
      }
    }
  }

  // Convert map entries to ShoppingListItem
  const mergedItems: ShoppingListItem[] = Array.from(map.values()).map((entry) => ({
    id: `item-${idCounter++}`,
    name: entry.name,
    quantity: entry.quantity,
    displayQuantity: formatQuantity(entry.quantity),
    unit: entry.unit,
    category: classifyIngredient(entry.name),
    notes: Array.from(entry.notes),
    checked: false,
    recipeNames: Array.from(entry.recipeNames),
  }))

  return [...mergedItems, ...nullItems].sort((a, b) => a.name.localeCompare(b.name))
}
