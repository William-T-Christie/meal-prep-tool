import type { IngredientCategory } from '@/types'

export const INGREDIENT_CATEGORIES: Array<{ value: IngredientCategory; label: string }> = [
  { value: 'produce', label: 'Produce' },
  { value: 'dairy', label: 'Dairy & Eggs' },
  { value: 'meat', label: 'Meat & Poultry' },
  { value: 'seafood', label: 'Seafood' },
  { value: 'pantry', label: 'Pantry' },
  { value: 'spices', label: 'Spices & Seasonings' },
  { value: 'bakery', label: 'Bakery' },
  { value: 'frozen', label: 'Frozen' },
  { value: 'beverages', label: 'Beverages' },
  { value: 'other', label: 'Other' },
]

export const CATEGORY_KEYWORDS: Record<IngredientCategory, string[]> = {
  produce: [
    'onion', 'garlic', 'tomato', 'pepper', 'lettuce', 'spinach', 'kale', 'carrot',
    'potato', 'sweet potato', 'celery', 'broccoli', 'cauliflower', 'mushroom',
    'avocado', 'lemon', 'lime', 'orange', 'apple', 'banana', 'berry', 'blueberry',
    'strawberry', 'raspberry', 'cilantro', 'basil', 'parsley', 'mint', 'dill',
    'ginger', 'cucumber', 'zucchini', 'squash', 'eggplant', 'corn', 'peas',
    'green bean', 'asparagus', 'cabbage', 'beet', 'radish', 'scallion', 'shallot',
    'jalapeño', 'serrano', 'mango', 'pineapple', 'peach', 'pear', 'grape',
    'arugula', 'romaine', 'bok choy', 'bean sprout',
  ],
  dairy: [
    'milk', 'cheese', 'yogurt', 'cream', 'butter', 'sour cream', 'cottage cheese',
    'mozzarella', 'parmesan', 'cheddar', 'feta', 'ricotta', 'cream cheese',
    'half and half', 'whipping cream', 'egg', 'eggs',
  ],
  meat: [
    'chicken', 'beef', 'pork', 'turkey', 'lamb', 'bacon', 'sausage', 'ham',
    'ground beef', 'ground turkey', 'ground pork', 'steak', 'roast', 'ribs',
    'drumstick', 'thigh', 'breast', 'tenderloin', 'chop',
  ],
  seafood: [
    'salmon', 'shrimp', 'tuna', 'cod', 'tilapia', 'fish', 'crab', 'lobster',
    'scallop', 'clam', 'mussel', 'oyster', 'anchovy', 'sardine', 'halibut',
    'mahi', 'swordfish', 'trout', 'bass',
  ],
  spices: [
    'salt', 'pepper', 'cumin', 'paprika', 'cinnamon', 'oregano', 'thyme',
    'turmeric', 'chili powder', 'cayenne', 'nutmeg', 'whole cloves', 'coriander',
    'cardamom', 'bay leaf', 'rosemary', 'sage', 'allspice', 'curry powder',
    'garlic powder', 'onion powder', 'red pepper flakes', 'black pepper',
    'white pepper', 'smoked paprika', 'italian seasoning',
  ],
  pantry: [
    'flour', 'sugar', 'rice', 'pasta', 'noodle', 'oil', 'olive oil', 'vegetable oil',
    'coconut oil', 'sesame oil', 'vinegar', 'soy sauce', 'broth', 'stock',
    'beans', 'lentils', 'chickpeas', 'oats', 'oatmeal', 'honey', 'maple syrup',
    'peanut butter', 'almond butter', 'tahini', 'tomato sauce', 'tomato paste',
    'coconut milk', 'cornstarch', 'baking powder', 'baking soda', 'vanilla',
    'chocolate', 'cocoa', 'nuts', 'almond', 'walnut', 'pecan', 'cashew',
    'seeds', 'chia', 'flax', 'quinoa', 'couscous', 'tortilla chips',
    'breadcrumbs', 'panko', 'worcestershire',
  ],
  bakery: [
    'bread', 'tortilla', 'bun', 'roll', 'pita', 'naan', 'bagel', 'croissant',
    'english muffin', 'wrap', 'flatbread', 'ciabatta', 'sourdough',
  ],
  frozen: [
    'frozen', 'ice cream', 'frozen vegetable', 'frozen fruit', 'frozen pizza',
  ],
  beverages: [
    'juice', 'wine', 'beer', 'coffee', 'tea', 'sparkling water', 'soda',
    'almond milk', 'oat milk', 'soy milk',
  ],
  other: [],
}

export const SHOPPING_LIST_STORAGE_PREFIX = 'shopping-checked-'
