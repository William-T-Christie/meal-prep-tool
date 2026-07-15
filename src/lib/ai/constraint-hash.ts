import type { FullUserProfile } from '@/types'

/**
 * Compute a deterministic hash of user constraints for caching meal plans.
 * Same constraints → same hash, regardless of array order.
 */
export async function computeConstraintHash(profile: FullUserProfile): Promise<string> {
  // Sort all arrays deterministically
  const normalized = {
    profile: profile.profile ? {
      cookingSkill: profile.profile.cookingSkill,
      budgetWeekly: profile.profile.budgetWeekly,
      householdSize: profile.profile.householdSize,
    } : null,
    allergies: [...profile.allergies].sort((a, b) => a.name.localeCompare(b.name)),
    dietaryRestrictions: [...profile.dietaryRestrictions].sort((a, b) => a.type.localeCompare(b.type)),
    cuisinePreferences: [...profile.cuisinePreferences].sort((a, b) => a.cuisine.localeCompare(b.cuisine)),
    cookingPreferences: [...profile.cookingPreferences].sort((a, b) => a.mealType.localeCompare(b.mealType)),
    macroGoals: [...profile.macroGoals].sort((a, b) => a.mealType.localeCompare(b.mealType)),
    kitchenEquipment: [...profile.kitchenEquipment].sort((a, b) => a.equipmentName.localeCompare(b.equipmentName)),
  }

  const json = JSON.stringify(normalized)
  const encoder = new TextEncoder()
  const data = encoder.encode(json)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}
