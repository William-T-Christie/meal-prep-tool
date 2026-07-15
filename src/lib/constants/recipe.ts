export const DIFFICULTY_LEVELS = [
  { value: 'EASY', label: 'Easy' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HARD', label: 'Hard' },
] as const

export const COMMON_TAGS = [
  'Quick', 'Meal Prep', 'One Pot', 'Budget', 'High Protein',
  'Low Carb', 'Comfort Food', 'Weeknight', 'Batch Cooking',
  'Freezer Friendly', 'Healthy', 'Vegetarian', 'Vegan', 'Keto',
] as const

export const COMMON_UNITS = [
  'tsp', 'tbsp', 'cup', 'oz', 'lb', 'g', 'kg', 'ml', 'l',
  'pinch', 'whole', 'clove', 'slice', 'piece', 'can', 'bunch',
] as const

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'alphabetical', label: 'A-Z' },
  { value: 'cook_time', label: 'Fastest' },
] as const

export const PAGE_SIZE_DEFAULT = 12
