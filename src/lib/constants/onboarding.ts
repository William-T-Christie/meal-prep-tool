export const COMMON_ALLERGENS = [
  'Peanuts', 'Tree Nuts', 'Milk', 'Eggs', 'Wheat', 'Soy',
  'Fish', 'Shellfish', 'Sesame',
] as const

export const CUISINES = [
  'Italian', 'Mexican', 'Chinese', 'Japanese', 'Indian', 'Thai',
  'Korean', 'Mediterranean', 'French', 'American', 'Middle Eastern',
  'Vietnamese', 'Greek', 'Spanish', 'Ethiopian', 'Caribbean',
] as const

export const KITCHEN_EQUIPMENT = [
  'Oven', 'Stovetop', 'Microwave', 'Air Fryer', 'Instant Pot',
  'Slow Cooker', 'Blender', 'Food Processor', 'Stand Mixer',
  'Grill', 'Wok', 'Dutch Oven', 'Cast Iron Skillet',
] as const

export const DIETARY_TYPES = [
  { value: 'VEGAN', label: 'Vegan' },
  { value: 'VEGETARIAN', label: 'Vegetarian' },
  { value: 'PESCATARIAN', label: 'Pescatarian' },
  { value: 'KETO', label: 'Keto' },
  { value: 'PALEO', label: 'Paleo' },
  { value: 'GLUTEN_FREE', label: 'Gluten Free' },
  { value: 'DAIRY_FREE', label: 'Dairy Free' },
  { value: 'LOW_SODIUM', label: 'Low Sodium' },
  { value: 'HALAL', label: 'Halal' },
  { value: 'KOSHER', label: 'Kosher' },
] as const

export const MEAL_TYPES = [
  { value: 'BREAKFAST', label: 'Breakfast' },
  { value: 'LUNCH', label: 'Lunch' },
  { value: 'DINNER', label: 'Dinner' },
  { value: 'SNACK', label: 'Snack' },
] as const

export const MACRO_PRESETS = {
  CUT: { calories: 1800, proteinG: 150, carbsG: 150, fatG: 60 },
  BULK: { calories: 2800, proteinG: 180, carbsG: 350, fatG: 80 },
  MAINTENANCE: { calories: 2200, proteinG: 130, carbsG: 250, fatG: 75 },
  BALANCED: { calories: 2000, proteinG: 100, carbsG: 250, fatG: 70 },
} as const

export const CUISINE_PREFERENCE_LEVELS = [
  { value: 'LOVE', label: 'Love it', emoji: '❤️' },
  { value: 'LIKE', label: 'Like it', emoji: '👍' },
  { value: 'NEUTRAL', label: 'Neutral', emoji: '😐' },
  { value: 'DISLIKE', label: 'Dislike', emoji: '👎' },
] as const
