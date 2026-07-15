import type { IngredientCategory } from '@/types'
import { CATEGORY_KEYWORDS } from '@/lib/constants/shopping'

// Check categories in this order to handle overlapping keywords correctly.
// Spices before produce (so "black pepper" → spices, not produce).
// Bakery before pantry (so "flour tortilla" → bakery, not pantry).
const CATEGORY_CHECK_ORDER: IngredientCategory[] = [
  'spices', 'bakery', 'dairy', 'seafood', 'meat',
  'produce', 'pantry', 'frozen', 'beverages', 'other',
]

/**
 * Classify an ingredient name into a store category.
 * Uses longest-keyword-first matching for accuracy.
 */
export function classifyIngredient(name: string): IngredientCategory {
  const lower = name.toLowerCase()

  // Build a flat list of (keyword, category) sorted by keyword length descending
  // so longer/more specific keywords match first
  const allEntries: Array<{ keyword: string; category: IngredientCategory }> = []

  for (const category of CATEGORY_CHECK_ORDER) {
    const keywords = CATEGORY_KEYWORDS[category]
    if (keywords) {
      for (const keyword of keywords) {
        allEntries.push({ keyword, category })
      }
    }
  }

  // Sort by keyword length descending (longer = more specific = higher priority)
  allEntries.sort((a, b) => b.keyword.length - a.keyword.length)

  for (const { keyword, category } of allEntries) {
    if (lower.includes(keyword)) {
      return category
    }
  }

  return 'other'
}
