import type { RecipeIngredient, ScaledIngredient } from '@/types'
import { formatQuantity } from './fractions'
import { normalizeUnit } from './unit-conversion'

/**
 * Scale a list of recipe ingredients from baseServings to targetServings.
 * Returns new ScaledIngredient[] with computed scaledQuantity and displayQuantity.
 */
export function scaleIngredients(
  ingredients: RecipeIngredient[],
  baseServings: number,
  targetServings: number
): ScaledIngredient[] {
  const scaleFactor = targetServings / baseServings

  return ingredients.map((ingredient) => {
    if (ingredient.quantity === null) {
      return {
        ...ingredient,
        scaledQuantity: null,
        displayQuantity: '',
      }
    }

    let scaledQty = ingredient.quantity * scaleFactor
    let unit = ingredient.unit ?? ''

    // Normalize unit if applicable
    if (unit) {
      const normalized = normalizeUnit(scaledQty, unit)
      scaledQty = normalized.quantity
      unit = normalized.unit
    }

    const displayQuantity = formatQuantity(scaledQty)

    return {
      ...ingredient,
      unit,
      scaledQuantity: scaledQty,
      displayQuantity,
    }
  })
}

export { toFraction, formatQuantity } from './fractions'
export { normalizeUnit } from './unit-conversion'
