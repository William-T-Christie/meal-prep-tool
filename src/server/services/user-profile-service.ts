import { prisma } from '@/lib/db'
import type {
  OnboardingData,
  ProfileInput,
  AllergyInput,
  DietaryRestrictionInput,
  CuisinePreferenceInput,
  CookingPreferenceInput,
  MacroGoalInput,
  KitchenEquipmentInput,
} from '@/lib/validators/profile'
import type { CookingSkill, DietaryType, CuisinePreferenceLevel, MealType, AllergySeverity, Prisma } from '@/generated/prisma/client'

export async function getUserFullProfile(userId: string) {
  const [profile, allergies, dietaryRestrictions, cuisinePreferences, cookingPreferences, macroGoals, kitchenEquipment] =
    await Promise.all([
      prisma.profile.findUnique({
        where: { userId },
        select: {
          id: true,
          cookingSkill: true,
          budgetWeekly: true,
          householdSize: true,
          onboardingCompleted: true,
        },
      }),
      prisma.allergy.findMany({
        where: { userId },
        select: { id: true, name: true, severity: true },
      }),
      prisma.dietaryRestriction.findMany({
        where: { userId },
        select: { id: true, type: true },
      }),
      prisma.cuisinePreference.findMany({
        where: { userId },
        select: { id: true, cuisine: true, preference: true },
      }),
      prisma.cookingPreference.findMany({
        where: { userId },
        select: { id: true, mealType: true, maxTimeMinutes: true },
      }),
      prisma.macroGoal.findMany({
        where: { userId },
        select: { id: true, mealType: true, calories: true, proteinG: true, carbsG: true, fatG: true },
      }),
      prisma.kitchenEquipment.findMany({
        where: { userId },
        select: { id: true, equipmentName: true },
      }),
    ])

  return {
    profile,
    allergies,
    dietaryRestrictions,
    cuisinePreferences,
    cookingPreferences,
    macroGoals,
    kitchenEquipment,
  }
}

export async function upsertProfile(userId: string, data: ProfileInput) {
  return prisma.profile.upsert({
    where: { userId },
    create: {
      userId,
      cookingSkill: data.cookingSkill as CookingSkill,
      budgetWeekly: data.budgetWeekly ?? null,
      householdSize: data.householdSize,
    },
    update: {
      cookingSkill: data.cookingSkill as CookingSkill,
      budgetWeekly: data.budgetWeekly ?? null,
      householdSize: data.householdSize,
    },
  })
}

export async function submitOnboarding(userId: string, data: OnboardingData) {
  return prisma.$transaction(async (tx) => {
    // Upsert profile
    await tx.profile.upsert({
      where: { userId },
      create: {
        userId,
        cookingSkill: data.profile.cookingSkill as CookingSkill,
        budgetWeekly: data.profile.budgetWeekly ?? null,
        householdSize: data.profile.householdSize,
        onboardingCompleted: true,
      },
      update: {
        cookingSkill: data.profile.cookingSkill as CookingSkill,
        budgetWeekly: data.profile.budgetWeekly ?? null,
        householdSize: data.profile.householdSize,
        onboardingCompleted: true,
      },
    })

    // Replace allergies
    await tx.allergy.deleteMany({ where: { userId } })
    if (data.allergies.length > 0) {
      await tx.allergy.createMany({
        data: data.allergies.map((a) => ({
          userId,
          name: a.name,
          severity: a.severity as AllergySeverity,
        })),
      })
    }

    // Replace dietary restrictions
    await tx.dietaryRestriction.deleteMany({ where: { userId } })
    if (data.dietaryRestrictions.length > 0) {
      await tx.dietaryRestriction.createMany({
        data: data.dietaryRestrictions.map((d) => ({
          userId,
          type: d.type as DietaryType,
        })),
      })
    }

    // Replace cuisine preferences
    await tx.cuisinePreference.deleteMany({ where: { userId } })
    if (data.cuisinePreferences.length > 0) {
      await tx.cuisinePreference.createMany({
        data: data.cuisinePreferences.map((c) => ({
          userId,
          cuisine: c.cuisine,
          preference: c.preference as CuisinePreferenceLevel,
        })),
      })
    }

    // Replace cooking preferences
    await tx.cookingPreference.deleteMany({ where: { userId } })
    if (data.cookingPreferences.length > 0) {
      await tx.cookingPreference.createMany({
        data: data.cookingPreferences.map((c) => ({
          userId,
          mealType: c.mealType as MealType,
          maxTimeMinutes: c.maxTimeMinutes,
        })),
      })
    }

    // Replace macro goals
    await tx.macroGoal.deleteMany({ where: { userId } })
    if (data.macroGoals.length > 0) {
      await tx.macroGoal.createMany({
        data: data.macroGoals.map((m) => ({
          userId,
          mealType: m.mealType as MealType,
          calories: m.calories,
          proteinG: m.proteinG,
          carbsG: m.carbsG,
          fatG: m.fatG,
        })),
      })
    }

    // Replace kitchen equipment
    await tx.kitchenEquipment.deleteMany({ where: { userId } })
    if (data.kitchenEquipment.length > 0) {
      await tx.kitchenEquipment.createMany({
        data: data.kitchenEquipment.map((e) => ({
          userId,
          equipmentName: e.equipmentName,
        })),
      })
    }
  })
}

// Generic replace function for individual preference updates
export async function replaceAllergies(userId: string, allergies: AllergyInput[]) {
  return prisma.$transaction(async (tx) => {
    await tx.allergy.deleteMany({ where: { userId } })
    if (allergies.length > 0) {
      await tx.allergy.createMany({
        data: allergies.map((a) => ({ userId, name: a.name, severity: a.severity as AllergySeverity })),
      })
    }
  })
}

export async function replaceDietaryRestrictions(userId: string, restrictions: DietaryRestrictionInput[]) {
  return prisma.$transaction(async (tx) => {
    await tx.dietaryRestriction.deleteMany({ where: { userId } })
    if (restrictions.length > 0) {
      await tx.dietaryRestriction.createMany({
        data: restrictions.map((d) => ({ userId, type: d.type as DietaryType })),
      })
    }
  })
}

export async function replaceCuisinePreferences(userId: string, preferences: CuisinePreferenceInput[]) {
  return prisma.$transaction(async (tx) => {
    await tx.cuisinePreference.deleteMany({ where: { userId } })
    if (preferences.length > 0) {
      await tx.cuisinePreference.createMany({
        data: preferences.map((c) => ({ userId, cuisine: c.cuisine, preference: c.preference as CuisinePreferenceLevel })),
      })
    }
  })
}

export async function replaceCookingPreferences(userId: string, preferences: CookingPreferenceInput[]) {
  return prisma.$transaction(async (tx) => {
    await tx.cookingPreference.deleteMany({ where: { userId } })
    if (preferences.length > 0) {
      await tx.cookingPreference.createMany({
        data: preferences.map((c) => ({ userId, mealType: c.mealType as MealType, maxTimeMinutes: c.maxTimeMinutes })),
      })
    }
  })
}

export async function replaceMacroGoals(userId: string, goals: MacroGoalInput[]) {
  return prisma.$transaction(async (tx) => {
    await tx.macroGoal.deleteMany({ where: { userId } })
    if (goals.length > 0) {
      await tx.macroGoal.createMany({
        data: goals.map((m) => ({
          userId,
          mealType: m.mealType as MealType,
          calories: m.calories,
          proteinG: m.proteinG,
          carbsG: m.carbsG,
          fatG: m.fatG,
        })),
      })
    }
  })
}

export async function replaceKitchenEquipment(userId: string, equipment: KitchenEquipmentInput[]) {
  return prisma.$transaction(async (tx) => {
    await tx.kitchenEquipment.deleteMany({ where: { userId } })
    if (equipment.length > 0) {
      await tx.kitchenEquipment.createMany({
        data: equipment.map((e) => ({ userId, equipmentName: e.equipmentName })),
      })
    }
  })
}
