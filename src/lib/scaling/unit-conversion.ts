interface ConversionRule {
  fromUnit: string
  toUnit: string
  factor: number // multiply fromUnit quantity by this to get toUnit
  upThreshold: number // convert up if quantity >= this in fromUnit
  downThreshold: number // convert down if quantity <= this in toUnit
}

const CONVERSIONS: ConversionRule[] = [
  // Volume: tsp → tbsp → cup
  { fromUnit: 'tsp', toUnit: 'tbsp', factor: 1 / 3, upThreshold: 3, downThreshold: 0.5 },
  { fromUnit: 'tbsp', toUnit: 'cup', factor: 1 / 16, upThreshold: 4, downThreshold: 0.125 },
  // Weight
  { fromUnit: 'g', toUnit: 'kg', factor: 1 / 1000, upThreshold: 1000, downThreshold: 0.25 },
  { fromUnit: 'oz', toUnit: 'lb', factor: 1 / 16, upThreshold: 16, downThreshold: 0.25 },
  // Liquid
  { fromUnit: 'ml', toUnit: 'l', factor: 1 / 1000, upThreshold: 1000, downThreshold: 0.25 },
]

/**
 * Normalize a quantity+unit to avoid awkward values.
 * E.g., 6 tsp → 2 tbsp, 0.25 tbsp → 3/4 tsp
 */
export function normalizeUnit(quantity: number, unit: string): { quantity: number; unit: string } {
  const lowerUnit = unit.toLowerCase()

  // Try converting UP (small unit → larger)
  for (const rule of CONVERSIONS) {
    if (lowerUnit === rule.fromUnit && quantity >= rule.upThreshold) {
      const converted = quantity * rule.factor
      return normalizeUnit(converted, rule.toUnit) // recurse for chained conversions
    }
  }

  // Try converting DOWN (large unit → smaller)
  for (const rule of CONVERSIONS) {
    if (lowerUnit === rule.toUnit && quantity > 0 && quantity < rule.downThreshold) {
      const converted = quantity / rule.factor
      return { quantity: converted, unit: rule.fromUnit }
    }
  }

  return { quantity, unit }
}
