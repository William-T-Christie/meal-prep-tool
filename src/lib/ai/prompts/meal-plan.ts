import type { FullUserProfile, MealType } from '@/types'

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const MEAL_TYPE_ORDER: MealType[] = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK']

const SYSTEM_PROMPT = `You are a professional meal planner and chef. Your job is to create personalized weekly meal plans.

Rules:
- Generate exactly 28 meals: 4 meals per day (Breakfast, Lunch, Dinner, Snack) for 7 days (Monday through Sunday)
- Every recipe MUST include accurate nutrition information (calories, protein, carbs, fat per serving)
- Recipes should be practical, realistic, and use commonly available ingredients
- Respect ALL dietary restrictions and allergies strictly — never include allergens
- Prefer cuisines the user loves/likes, avoid cuisines they dislike
- Stay within time constraints for each meal type
- Aim to meet macro goals when specified
- Suggest ingredient overlap between meals to reduce waste and shopping cost
- Vary recipes throughout the week — avoid repeating the same dish
- Match recipe difficulty to the user's cooking skill level
- Set baseServings to the household size

For each recipe, provide:
- A descriptive title
- Brief description
- Prep and cook times in minutes
- Difficulty level (EASY, MEDIUM, HARD)
- Complete ingredient list with quantities and units
- Step-by-step cooking instructions
- Per-serving nutrition (calories, protein grams, carbs grams, fat grams)
- Relevant tags (Quick, Meal Prep, High Protein, etc.)

Each ingredient needs: name (required), quantity (number or null for "to taste"), unit (tsp, tbsp, cup, oz, lb, g, etc. or null), notes (optional, e.g., "diced"), and orderIndex (starting from 0).
Each instruction needs: stepNumber (starting from 1), instructionText, and optional durationMinutes for timed steps.`

function formatConstraints(profile: FullUserProfile): string {
  const lines: string[] = []

  if (profile.profile) {
    lines.push(`## Cooking Skill: ${profile.profile.cookingSkill}`)
    lines.push(`## Household Size: ${profile.profile.householdSize} people`)
    if (profile.profile.budgetWeekly) {
      lines.push(`## Weekly Budget: $${profile.profile.budgetWeekly}`)
    }
  }

  if (profile.allergies.length > 0) {
    lines.push('\n## Allergies (MUST AVOID):')
    profile.allergies.forEach((a) => {
      lines.push(`- ${a.name} (${a.severity === 'STRICT' ? 'STRICT — absolute avoidance' : 'MILD — minimize'})`)
    })
  }

  if (profile.dietaryRestrictions.length > 0) {
    lines.push('\n## Dietary Restrictions:')
    profile.dietaryRestrictions.forEach((d) => {
      lines.push(`- ${d.type.replace(/_/g, ' ')}`)
    })
  }

  if (profile.cuisinePreferences.length > 0) {
    lines.push('\n## Cuisine Preferences:')
    const grouped = {
      LOVE: profile.cuisinePreferences.filter((c) => c.preference === 'LOVE'),
      LIKE: profile.cuisinePreferences.filter((c) => c.preference === 'LIKE'),
      DISLIKE: profile.cuisinePreferences.filter((c) => c.preference === 'DISLIKE'),
    }
    if (grouped.LOVE.length > 0) lines.push(`- Love: ${grouped.LOVE.map((c) => c.cuisine).join(', ')}`)
    if (grouped.LIKE.length > 0) lines.push(`- Like: ${grouped.LIKE.map((c) => c.cuisine).join(', ')}`)
    if (grouped.DISLIKE.length > 0) lines.push(`- Dislike (avoid): ${grouped.DISLIKE.map((c) => c.cuisine).join(', ')}`)
  }

  if (profile.cookingPreferences.length > 0) {
    lines.push('\n## Time Constraints (max cooking time per meal):')
    profile.cookingPreferences.forEach((c) => {
      lines.push(`- ${c.mealType}: ${c.maxTimeMinutes} minutes`)
    })
  }

  if (profile.macroGoals.length > 0) {
    lines.push('\n## Macro Goals (per meal targets):')
    profile.macroGoals.forEach((m) => {
      lines.push(`- ${m.mealType}: ${m.calories} cal, ${m.proteinG}g protein, ${m.carbsG}g carbs, ${m.fatG}g fat`)
    })
  }

  if (profile.kitchenEquipment.length > 0) {
    lines.push('\n## Available Equipment:')
    lines.push(profile.kitchenEquipment.map((e) => e.equipmentName).join(', '))
  }

  return lines.join('\n')
}

export function buildMealPlanPrompt(profile: FullUserProfile): { system: string; user: string } {
  const constraints = formatConstraints(profile)

  const user = `Generate a complete weekly meal plan (Monday through Sunday) with 4 meals per day (Breakfast, Lunch, Dinner, Snack) — 28 meals total.

Here are my dietary profile and constraints:

${constraints}

Create varied, practical meals that satisfy all constraints. For dayIndex: 0=Monday, 1=Tuesday, ..., 6=Sunday.`

  return { system: SYSTEM_PROMPT, user }
}

export function buildSwapMealPrompt(
  profile: FullUserProfile,
  dayIndex: number,
  mealType: MealType,
  existingRecipeTitles: string[]
): { system: string; user: string } {
  const constraints = formatConstraints(profile)

  const user = `Generate a single replacement ${mealType.toLowerCase()} recipe for ${DAY_NAMES[dayIndex] ?? `Day ${dayIndex}`}.

My constraints:
${constraints}

IMPORTANT: Do NOT suggest any of these recipes that are already in my plan:
${existingRecipeTitles.map((t) => `- ${t}`).join('\n')}

Generate one new, different recipe that fits my constraints for this meal type.`

  return { system: SYSTEM_PROMPT, user }
}
