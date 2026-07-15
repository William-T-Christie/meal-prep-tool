/**
 * Common fractions and their decimal equivalents.
 * Ordered by denominator size for best-match priority.
 */
const COMMON_FRACTIONS: Array<{ decimal: number; display: string }> = [
  { decimal: 0.125, display: '1/8' },
  { decimal: 0.25, display: '1/4' },
  { decimal: 1 / 3, display: '1/3' },
  { decimal: 0.375, display: '3/8' },
  { decimal: 0.5, display: '1/2' },
  { decimal: 2 / 3, display: '2/3' },
  { decimal: 0.75, display: '3/4' },
  { decimal: 0.875, display: '7/8' },
]

const FRACTION_TOLERANCE = 0.04

/**
 * Convert a positive decimal to a human-readable fraction string.
 * Examples: 0.5 → "1/2", 1.333 → "1 1/3", 3.0 → "3"
 */
export function toFraction(value: number): string {
  if (value < 0) return toFraction(-value)
  if (value === 0) return '0'

  const whole = Math.floor(value)
  const fractional = value - whole

  // If essentially a whole number
  if (fractional < FRACTION_TOLERANCE) {
    return String(whole)
  }

  // If fractional part is close to 1
  if (fractional > 1 - FRACTION_TOLERANCE) {
    return String(whole + 1)
  }

  // Find closest common fraction
  let bestMatch: string | null = null
  let bestDelta = Infinity

  for (const frac of COMMON_FRACTIONS) {
    const delta = Math.abs(fractional - frac.decimal)
    if (delta < bestDelta) {
      bestDelta = delta
      bestMatch = frac.display
    }
  }

  if (bestMatch && bestDelta <= FRACTION_TOLERANCE) {
    return whole > 0 ? `${whole} ${bestMatch}` : bestMatch
  }

  // No close fraction match - round to 1 decimal
  const rounded = Math.round(value * 10) / 10
  return whole > 0 ? String(rounded) : String(rounded)
}

/**
 * Format a quantity for display. Returns empty string for null.
 */
export function formatQuantity(quantity: number | null): string {
  if (quantity === null || quantity === undefined) return ''
  return toFraction(quantity)
}
