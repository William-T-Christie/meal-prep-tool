import { prisma } from '@/lib/db'
import { getUserFullProfile } from './user-profile-service'
import { generateStructuredOutput, AiGenerationError } from '@/lib/ai/client'
import { buildMealPlanPrompt, buildSwapMealPrompt } from '@/lib/ai/prompts/meal-plan'
import { aiMealPlanOutputSchema, aiSingleMealOutputSchema } from '@/lib/ai/schemas/meal-plan'
import type { AiRecipeOutput } from '@/lib/ai/schemas/meal-plan'
import { computeConstraintHash } from '@/lib/ai/constraint-hash'
import type { Difficulty, MealType } from '@/generated/prisma/client'

const mealPlanInclude = {
  meals: {
    include: {
      recipe: {
        include: {
          ingredients: { orderBy: { orderIndex: 'asc' as const } },
          instructions: { orderBy: { stepNumber: 'asc' as const } },
          tags: true,
          nutrition: true,
        },
      },
    },
    orderBy: [
      { dayIndex: 'asc' as const },
      { mealType: 'asc' as const },
    ],
  },
}

/**
 * Create a recipe from AI output, handling title collisions.
 */
async function createRecipeFromAi(
  tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0],
  userId: string,
  recipeData: AiRecipeOutput,
  dateSuffix: string
) {
  const totalTimeMinutes = recipeData.prepTimeMinutes + recipeData.cookTimeMinutes

  // Try with original title first, append suffix if collision
  let title = recipeData.title
  const existing = await tx.recipe.findFirst({
    where: { userId, title },
    select: { id: true },
  })
  if (existing) {
    title = `${recipeData.title} (${dateSuffix})`
  }

  const recipe = await tx.recipe.create({
    data: {
      userId,
      title,
      description: recipeData.description ?? null,
      prepTimeMinutes: recipeData.prepTimeMinutes,
      cookTimeMinutes: recipeData.cookTimeMinutes,
      totalTimeMinutes,
      baseServings: recipeData.baseServings,
      difficulty: recipeData.difficulty as Difficulty,
      cuisineType: recipeData.cuisineType ?? null,
      isAiGenerated: true,
    },
  })

  await tx.recipeIngredient.createMany({
    data: recipeData.ingredients.map((ing) => ({
      recipeId: recipe.id,
      quantity: ing.quantity ?? null,
      unit: ing.unit ?? null,
      name: ing.name,
      notes: ing.notes ?? null,
      orderIndex: ing.orderIndex,
    })),
  })

  await tx.recipeInstruction.createMany({
    data: recipeData.instructions.map((inst) => ({
      recipeId: recipe.id,
      stepNumber: inst.stepNumber,
      instructionText: inst.instructionText,
      durationMinutes: inst.durationMinutes ?? null,
    })),
  })

  if (recipeData.tags && recipeData.tags.length > 0) {
    await tx.recipeTag.createMany({
      data: recipeData.tags.map((tag) => ({
        recipeId: recipe.id,
        tagName: tag.tagName,
      })),
    })
  }

  if (recipeData.nutrition) {
    await tx.recipeNutrition.create({
      data: {
        recipeId: recipe.id,
        caloriesPerServing: recipeData.nutrition.caloriesPerServing,
        proteinG: recipeData.nutrition.proteinG,
        carbsG: recipeData.nutrition.carbsG,
        fatG: recipeData.nutrition.fatG,
      },
    })
  }

  return recipe
}

export async function generateMealPlan(userId: string, weekStartDate: Date) {
  // Get user constraints
  const profile = await getUserFullProfile(userId)
  const constraintHash = await computeConstraintHash(profile)

  // Check for cached plan with same constraints and week
  const cached = await prisma.mealPlan.findFirst({
    where: {
      userId,
      weekStartDate,
      constraintHash,
      status: 'READY',
    },
    include: mealPlanInclude,
  })

  if (cached) {
    return cached
  }

  // Format date for title and collision suffix
  const dateStr = weekStartDate.toISOString().split('T')[0] ?? 'plan'
  const title = `Meal Plan — Week of ${dateStr}`

  // Create plan in GENERATING status
  const mealPlan = await prisma.mealPlan.create({
    data: {
      userId,
      title,
      weekStartDate,
      status: 'GENERATING',
      constraintHash,
    },
  })

  try {
    // Call AI
    const { system, user } = buildMealPlanPrompt(profile)
    const result = await generateStructuredOutput({
      systemPrompt: system,
      userPrompt: user,
      schema: aiMealPlanOutputSchema,
      toolName: 'generate_meal_plan',
      toolDescription: 'Generate a complete weekly meal plan with 28 meals (7 days x 4 meal types)',
      maxTokens: 32000,
    })

    // Store recipes and link to plan in a transaction
    await prisma.$transaction(async (tx) => {
      for (const meal of result.data.meals) {
        const recipe = await createRecipeFromAi(tx, userId, meal.recipe, dateStr)

        await tx.mealPlanMeal.create({
          data: {
            mealPlanId: mealPlan.id,
            recipeId: recipe.id,
            dayIndex: meal.dayIndex,
            mealType: meal.mealType as MealType,
          },
        })
      }

      await tx.mealPlan.update({
        where: { id: mealPlan.id },
        data: { status: 'READY' },
      })
    })

    // Return the full plan
    return prisma.mealPlan.findUniqueOrThrow({
      where: { id: mealPlan.id },
      include: mealPlanInclude,
    })
  } catch (error) {
    // Mark as failed
    await prisma.mealPlan.update({
      where: { id: mealPlan.id },
      data: { status: 'FAILED' },
    })

    if (error instanceof AiGenerationError) {
      throw error
    }
    throw new AiGenerationError(
      `Meal plan generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'API_ERROR'
    )
  }
}

export async function getMealPlan(mealPlanId: string, userId: string) {
  return prisma.mealPlan.findFirst({
    where: { id: mealPlanId, userId },
    include: mealPlanInclude,
  })
}

export async function getUserMealPlans(userId: string) {
  return prisma.mealPlan.findMany({
    where: { userId },
    select: {
      id: true,
      title: true,
      weekStartDate: true,
      status: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function deleteMealPlan(mealPlanId: string, userId: string) {
  const existing = await prisma.mealPlan.findFirst({ where: { id: mealPlanId, userId } })
  if (!existing) return false

  await prisma.mealPlan.delete({ where: { id: mealPlanId } })
  return true
}

export async function swapMeal(
  mealPlanId: string,
  userId: string,
  dayIndex: number,
  mealType: MealType
) {
  // Verify ownership
  const mealPlan = await prisma.mealPlan.findFirst({
    where: { id: mealPlanId, userId },
    include: {
      meals: { include: { recipe: { select: { title: true } } } },
    },
  })

  if (!mealPlan) return null

  const existingTitles = mealPlan.meals.map((m) => m.recipe.title)
  const profile = await getUserFullProfile(userId)

  // Generate replacement meal
  const { system, user } = buildSwapMealPrompt(profile, dayIndex, mealType, existingTitles)
  const result = await generateStructuredOutput({
    systemPrompt: system,
    userPrompt: user,
    schema: aiSingleMealOutputSchema,
    toolName: 'generate_single_meal',
    toolDescription: 'Generate a single replacement meal recipe',
    maxTokens: 4000,
  })

  const dateStr = mealPlan.weekStartDate.toISOString().split('T')[0] ?? 'swap'

  // Create new recipe and update meal slot
  return prisma.$transaction(async (tx) => {
    const newRecipe = await createRecipeFromAi(tx, userId, result.data.recipe, dateStr)

    const updated = await tx.mealPlanMeal.update({
      where: {
        mealPlanId_dayIndex_mealType: { mealPlanId, dayIndex, mealType },
      },
      data: { recipeId: newRecipe.id },
      include: {
        recipe: {
          include: {
            ingredients: { orderBy: { orderIndex: 'asc' as const } },
            instructions: { orderBy: { stepNumber: 'asc' as const } },
            tags: true,
            nutrition: true,
          },
        },
      },
    })

    return updated
  })
}
