import { describe, it, expect } from 'vitest'
import { toFraction, formatQuantity } from '@/lib/scaling/fractions'
import { normalizeUnit } from '@/lib/scaling/unit-conversion'
import { scaleIngredients } from '@/lib/scaling'
import type { RecipeIngredient } from '@/types'

describe('toFraction', () => {
  it('converts 0.5 to "1/2"', () => {
    expect(toFraction(0.5)).toBe('1/2')
  })

  it('converts 0.25 to "1/4"', () => {
    expect(toFraction(0.25)).toBe('1/4')
  })

  it('converts 0.75 to "3/4"', () => {
    expect(toFraction(0.75)).toBe('3/4')
  })

  it('converts 1/3 to "1/3"', () => {
    expect(toFraction(1 / 3)).toBe('1/3')
  })

  it('converts 2/3 to "2/3"', () => {
    expect(toFraction(2 / 3)).toBe('2/3')
  })

  it('converts 1.5 to "1 1/2"', () => {
    expect(toFraction(1.5)).toBe('1 1/2')
  })

  it('converts 2.333 to "2 1/3"', () => {
    expect(toFraction(2 + 1 / 3)).toBe('2 1/3')
  })

  it('converts 3.0 to "3"', () => {
    expect(toFraction(3.0)).toBe('3')
  })

  it('converts 0 to "0"', () => {
    expect(toFraction(0)).toBe('0')
  })

  it('converts 1.0 to "1"', () => {
    expect(toFraction(1.0)).toBe('1')
  })

  it('handles 0.125 as "1/8"', () => {
    expect(toFraction(0.125)).toBe('1/8')
  })
})

describe('formatQuantity', () => {
  it('returns empty string for null', () => {
    expect(formatQuantity(null)).toBe('')
  })

  it('formats a number', () => {
    expect(formatQuantity(1.5)).toBe('1 1/2')
  })
})

describe('normalizeUnit', () => {
  it('converts 3 tsp to 1 tbsp', () => {
    const result = normalizeUnit(3, 'tsp')
    expect(result.quantity).toBeCloseTo(1)
    expect(result.unit).toBe('tbsp')
  })

  it('converts 6 tsp to 2 tbsp', () => {
    const result = normalizeUnit(6, 'tsp')
    expect(result.quantity).toBeCloseTo(2)
    expect(result.unit).toBe('tbsp')
  })

  it('keeps small tsp values as tsp', () => {
    const result = normalizeUnit(1, 'tsp')
    expect(result.unit).toBe('tsp')
  })

  it('converts 1000 g to 1 kg', () => {
    const result = normalizeUnit(1000, 'g')
    expect(result.quantity).toBeCloseTo(1)
    expect(result.unit).toBe('kg')
  })

  it('keeps 500 g as g', () => {
    const result = normalizeUnit(500, 'g')
    expect(result.unit).toBe('g')
  })

  it('converts 16 oz to 1 lb', () => {
    const result = normalizeUnit(16, 'oz')
    expect(result.quantity).toBeCloseTo(1)
    expect(result.unit).toBe('lb')
  })

  it('preserves unknown units', () => {
    const result = normalizeUnit(5, 'clove')
    expect(result.quantity).toBe(5)
    expect(result.unit).toBe('clove')
  })
})

describe('scaleIngredients', () => {
  const baseIngredients: RecipeIngredient[] = [
    { id: '1', quantity: 1, unit: 'cup', name: 'flour', notes: null, orderIndex: 0 },
    { id: '2', quantity: 2, unit: 'tbsp', name: 'butter', notes: 'melted', orderIndex: 1 },
    { id: '3', quantity: null, unit: null, name: 'salt', notes: 'to taste', orderIndex: 2 },
  ]

  it('returns original quantities with scale factor 1', () => {
    const result = scaleIngredients(baseIngredients, 4, 4)
    expect(result[0]?.scaledQuantity).toBeCloseTo(1)
    expect(result[0]?.displayQuantity).toBe('1')
  })

  it('doubles quantities with scale factor 2', () => {
    const result = scaleIngredients(baseIngredients, 4, 8)
    expect(result[0]?.scaledQuantity).toBeCloseTo(2)
    expect(result[0]?.displayQuantity).toBe('2')
    // 4 tbsp gets normalized to 1/4 cup
    expect(result[1]?.scaledQuantity).toBeCloseTo(0.25)
    expect(result[1]?.unit).toBe('cup')
  })

  it('halves quantities with scale factor 0.5', () => {
    const result = scaleIngredients(baseIngredients, 4, 2)
    expect(result[0]?.scaledQuantity).toBeCloseTo(0.5)
    expect(result[0]?.displayQuantity).toBe('1/2')
  })

  it('handles null quantity ingredients', () => {
    const result = scaleIngredients(baseIngredients, 4, 8)
    expect(result[2]?.scaledQuantity).toBeNull()
    expect(result[2]?.displayQuantity).toBe('')
  })

  it('preserves notes', () => {
    const result = scaleIngredients(baseIngredients, 4, 8)
    expect(result[1]?.notes).toBe('melted')
    expect(result[2]?.notes).toBe('to taste')
  })

  it('produces fractional display for 1.5x scaling', () => {
    const result = scaleIngredients(baseIngredients, 4, 6)
    expect(result[0]?.displayQuantity).toBe('1 1/2')
  })
})
