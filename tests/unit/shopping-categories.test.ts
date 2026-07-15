import { describe, it, expect } from 'vitest'
import { classifyIngredient } from '@/lib/shopping/categories'

describe('classifyIngredient', () => {
  it('classifies produce', () => {
    expect(classifyIngredient('onion')).toBe('produce')
    expect(classifyIngredient('Garlic cloves')).toBe('produce')
    expect(classifyIngredient('fresh spinach')).toBe('produce')
  })

  it('classifies dairy', () => {
    expect(classifyIngredient('cheddar cheese')).toBe('dairy')
    expect(classifyIngredient('whole milk')).toBe('dairy')
    expect(classifyIngredient('eggs')).toBe('dairy')
  })

  it('classifies meat', () => {
    expect(classifyIngredient('chicken breast')).toBe('meat')
    expect(classifyIngredient('ground beef')).toBe('meat')
    expect(classifyIngredient('bacon')).toBe('meat')
  })

  it('classifies seafood', () => {
    expect(classifyIngredient('salmon fillet')).toBe('seafood')
    expect(classifyIngredient('shrimp')).toBe('seafood')
  })

  it('classifies spices', () => {
    expect(classifyIngredient('cumin')).toBe('spices')
    expect(classifyIngredient('salt')).toBe('spices')
    expect(classifyIngredient('black pepper')).toBe('spices')
  })

  it('classifies pantry', () => {
    expect(classifyIngredient('all-purpose flour')).toBe('pantry')
    expect(classifyIngredient('olive oil')).toBe('pantry')
    expect(classifyIngredient('soy sauce')).toBe('pantry')
    expect(classifyIngredient('pasta')).toBe('pantry')
  })

  it('classifies bakery', () => {
    expect(classifyIngredient('sourdough bread')).toBe('bakery')
    expect(classifyIngredient('flour tortilla')).toBe('bakery')
  })

  it('falls back to other for unknown items', () => {
    expect(classifyIngredient('xanthan gum')).toBe('other')
    expect(classifyIngredient('nutritional yeast')).toBe('other')
  })

  it('is case-insensitive', () => {
    expect(classifyIngredient('ONION')).toBe('produce')
    expect(classifyIngredient('Chicken Breast')).toBe('meat')
  })
})
