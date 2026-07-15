import { describe, it, expect } from 'vitest'
import { consolidateIngredients } from '@/lib/shopping/consolidate'
import type { MealPlanMealDetail } from '@/types'

function makeMealWithIngredients(
  recipeName: string,
  ingredients: Array<{ quantity: number | null; unit: string | null; name: string; notes?: string }>
): MealPlanMealDetail {
  return {
    id: `meal-${recipeName}`,
    dayIndex: 0,
    mealType: 'DINNER',
    recipe: {
      id: `recipe-${recipeName}`,
      userId: 'user1',
      title: recipeName,
      description: null,
      prepTimeMinutes: 10,
      cookTimeMinutes: 20,
      totalTimeMinutes: 30,
      baseServings: 4,
      difficulty: 'EASY',
      cuisineType: null,
      imageUrl: null,
      sourceUrl: null,
      isAiGenerated: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ingredients: ingredients.map((ing, i) => ({
        id: `ing-${recipeName}-${i}`,
        quantity: ing.quantity,
        unit: ing.unit,
        name: ing.name,
        notes: ing.notes ?? null,
        orderIndex: i,
      })),
      instructions: [],
      tags: [],
      nutrition: null,
    },
  }
}

describe('consolidateIngredients', () => {
  it('merges identical ingredients (same name + unit)', () => {
    const meals = [
      makeMealWithIngredients('Recipe A', [{ quantity: 1, unit: 'cup', name: 'flour' }]),
      makeMealWithIngredients('Recipe B', [{ quantity: 2, unit: 'cup', name: 'flour' }]),
    ]

    const result = consolidateIngredients(meals)
    const flour = result.find((i) => i.name === 'flour')

    expect(flour).toBeDefined()
    expect(flour!.quantity).toBe(3)
    expect(flour!.displayQuantity).toBe('3')
    expect(flour!.recipeNames).toContain('Recipe A')
    expect(flour!.recipeNames).toContain('Recipe B')
  })

  it('keeps items separate when units differ', () => {
    const meals = [
      makeMealWithIngredients('Recipe A', [{ quantity: 1, unit: 'cup', name: 'onion' }]),
      makeMealWithIngredients('Recipe B', [{ quantity: 2, unit: 'whole', name: 'onion' }]),
    ]

    const result = consolidateIngredients(meals)
    const onions = result.filter((i) => i.name.toLowerCase() === 'onion')

    expect(onions).toHaveLength(2)
  })

  it('matches names case-insensitively', () => {
    const meals = [
      makeMealWithIngredients('Recipe A', [{ quantity: 1, unit: 'cup', name: 'Flour' }]),
      makeMealWithIngredients('Recipe B', [{ quantity: 2, unit: 'cup', name: 'flour' }]),
    ]

    const result = consolidateIngredients(meals)
    const flour = result.filter((i) => i.name.toLowerCase() === 'flour')

    // Should merge into one item
    expect(flour).toHaveLength(1)
    expect(flour[0]!.quantity).toBe(3)
  })

  it('never merges null-quantity items', () => {
    const meals = [
      makeMealWithIngredients('Recipe A', [{ quantity: null, unit: null, name: 'salt' }]),
      makeMealWithIngredients('Recipe B', [{ quantity: null, unit: null, name: 'salt' }]),
    ]

    const result = consolidateIngredients(meals)
    const salts = result.filter((i) => i.name === 'salt')

    expect(salts).toHaveLength(2)
    expect(salts.every((s) => s.quantity === null)).toBe(true)
  })

  it('collects notes from multiple sources', () => {
    const meals = [
      makeMealWithIngredients('Recipe A', [{ quantity: 1, unit: 'cup', name: 'onion', notes: 'diced' }]),
      makeMealWithIngredients('Recipe B', [{ quantity: 1, unit: 'cup', name: 'onion', notes: 'sliced' }]),
    ]

    const result = consolidateIngredients(meals)
    const onion = result.find((i) => i.name === 'onion')

    expect(onion!.notes).toContain('diced')
    expect(onion!.notes).toContain('sliced')
  })

  it('tracks recipe names', () => {
    const meals = [
      makeMealWithIngredients('Pasta', [{ quantity: 1, unit: 'lb', name: 'spaghetti' }]),
      makeMealWithIngredients('Noodle Soup', [{ quantity: 0.5, unit: 'lb', name: 'spaghetti' }]),
    ]

    const result = consolidateIngredients(meals)
    const spaghetti = result.find((i) => i.name === 'spaghetti')

    expect(spaghetti!.recipeNames).toEqual(expect.arrayContaining(['Pasta', 'Noodle Soup']))
  })

  it('returns empty list for empty meals', () => {
    expect(consolidateIngredients([])).toEqual([])
  })

  it('assigns categories correctly', () => {
    const meals = [
      makeMealWithIngredients('Test', [
        { quantity: 2, unit: 'lb', name: 'chicken breast' },
        { quantity: 1, unit: 'cup', name: 'rice' },
      ]),
    ]

    const result = consolidateIngredients(meals)
    const chicken = result.find((i) => i.name === 'chicken breast')
    const rice = result.find((i) => i.name === 'rice')

    expect(chicken!.category).toBe('meat')
    expect(rice!.category).toBe('pantry')
  })
})
