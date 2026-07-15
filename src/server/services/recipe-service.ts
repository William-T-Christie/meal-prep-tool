import { prisma } from '@/lib/db'
import type { CreateRecipeInput, UpdateRecipeInput, RecipeListQuery } from '@/lib/validators/recipe'
import type { Difficulty } from '@/generated/prisma/client'

const recipeInclude = {
  ingredients: { orderBy: { orderIndex: 'asc' as const } },
  instructions: { orderBy: { stepNumber: 'asc' as const } },
  tags: true,
  nutrition: true,
}

export async function createRecipe(userId: string, data: CreateRecipeInput) {
  const totalTimeMinutes = data.prepTimeMinutes + data.cookTimeMinutes

  return prisma.$transaction(async (tx) => {
    const recipe = await tx.recipe.create({
      data: {
        userId,
        title: data.title,
        description: data.description ?? null,
        prepTimeMinutes: data.prepTimeMinutes,
        cookTimeMinutes: data.cookTimeMinutes,
        totalTimeMinutes,
        baseServings: data.baseServings,
        difficulty: data.difficulty as Difficulty,
        cuisineType: data.cuisineType ?? null,
        imageUrl: data.imageUrl ?? null,
        sourceUrl: data.sourceUrl ?? null,
        isAiGenerated: data.isAiGenerated ?? false,
      },
    })

    await tx.recipeIngredient.createMany({
      data: data.ingredients.map((ing) => ({
        recipeId: recipe.id,
        quantity: ing.quantity ?? null,
        unit: ing.unit ?? null,
        name: ing.name,
        notes: ing.notes ?? null,
        orderIndex: ing.orderIndex,
      })),
    })

    await tx.recipeInstruction.createMany({
      data: data.instructions.map((inst) => ({
        recipeId: recipe.id,
        stepNumber: inst.stepNumber,
        instructionText: inst.instructionText,
        durationMinutes: inst.durationMinutes ?? null,
      })),
    })

    if (data.tags && data.tags.length > 0) {
      await tx.recipeTag.createMany({
        data: data.tags.map((tag) => ({
          recipeId: recipe.id,
          tagName: tag.tagName,
        })),
      })
    }

    if (data.nutrition) {
      await tx.recipeNutrition.create({
        data: {
          recipeId: recipe.id,
          caloriesPerServing: data.nutrition.caloriesPerServing,
          proteinG: data.nutrition.proteinG,
          carbsG: data.nutrition.carbsG,
          fatG: data.nutrition.fatG,
          fiberG: data.nutrition.fiberG ?? null,
          sugarG: data.nutrition.sugarG ?? null,
        },
      })
    }

    return tx.recipe.findUniqueOrThrow({
      where: { id: recipe.id },
      include: recipeInclude,
    })
  })
}

export async function getRecipeById(recipeId: string, userId: string) {
  return prisma.recipe.findFirst({
    where: { id: recipeId, userId },
    include: recipeInclude,
  })
}

export async function getUserRecipes(userId: string, query: RecipeListQuery) {
  const { search, cuisineType, difficulty, maxTotalTime, tags, sortBy, page, pageSize } = query

  const where: Record<string, unknown> = { userId }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { ingredients: { some: { name: { contains: search, mode: 'insensitive' } } } },
    ]
  }

  if (cuisineType) {
    where.cuisineType = cuisineType
  }

  if (difficulty) {
    where.difficulty = difficulty
  }

  if (maxTotalTime) {
    where.totalTimeMinutes = { lte: maxTotalTime }
  }

  if (tags) {
    const tagArray = Array.isArray(tags) ? tags : [tags]
    where.tags = { some: { tagName: { in: tagArray } } }
  }

  const orderBy = sortBy === 'alphabetical'
    ? { title: 'asc' as const }
    : sortBy === 'cook_time'
      ? { totalTimeMinutes: 'asc' as const }
      : { createdAt: 'desc' as const }

  const [items, total] = await Promise.all([
    prisma.recipe.findMany({
      where,
      include: { tags: true },
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.recipe.count({ where }),
  ])

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  }
}

export async function updateRecipe(recipeId: string, userId: string, data: UpdateRecipeInput) {
  // Verify ownership
  const existing = await prisma.recipe.findFirst({ where: { id: recipeId, userId } })
  if (!existing) return null

  return prisma.$transaction(async (tx) => {
    // Update scalar fields
    const totalTimeMinutes =
      (data.prepTimeMinutes ?? existing.prepTimeMinutes) +
      (data.cookTimeMinutes ?? existing.cookTimeMinutes)

    await tx.recipe.update({
      where: { id: recipeId },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description ?? null }),
        ...(data.prepTimeMinutes !== undefined && { prepTimeMinutes: data.prepTimeMinutes }),
        ...(data.cookTimeMinutes !== undefined && { cookTimeMinutes: data.cookTimeMinutes }),
        totalTimeMinutes,
        ...(data.baseServings !== undefined && { baseServings: data.baseServings }),
        ...(data.difficulty !== undefined && { difficulty: data.difficulty as Difficulty }),
        ...(data.cuisineType !== undefined && { cuisineType: data.cuisineType ?? null }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl ?? null }),
        ...(data.sourceUrl !== undefined && { sourceUrl: data.sourceUrl ?? null }),
      },
    })

    // Replace ingredients if provided
    if (data.ingredients) {
      await tx.recipeIngredient.deleteMany({ where: { recipeId } })
      await tx.recipeIngredient.createMany({
        data: data.ingredients.map((ing) => ({
          recipeId,
          quantity: ing.quantity ?? null,
          unit: ing.unit ?? null,
          name: ing.name,
          notes: ing.notes ?? null,
          orderIndex: ing.orderIndex,
        })),
      })
    }

    // Replace instructions if provided
    if (data.instructions) {
      await tx.recipeInstruction.deleteMany({ where: { recipeId } })
      await tx.recipeInstruction.createMany({
        data: data.instructions.map((inst) => ({
          recipeId,
          stepNumber: inst.stepNumber,
          instructionText: inst.instructionText,
          durationMinutes: inst.durationMinutes ?? null,
        })),
      })
    }

    // Replace tags if provided
    if (data.tags) {
      await tx.recipeTag.deleteMany({ where: { recipeId } })
      if (data.tags.length > 0) {
        await tx.recipeTag.createMany({
          data: data.tags.map((tag) => ({ recipeId, tagName: tag.tagName })),
        })
      }
    }

    // Replace nutrition if provided
    if (data.nutrition !== undefined) {
      await tx.recipeNutrition.deleteMany({ where: { recipeId } })
      if (data.nutrition) {
        await tx.recipeNutrition.create({
          data: {
            recipeId,
            caloriesPerServing: data.nutrition.caloriesPerServing,
            proteinG: data.nutrition.proteinG,
            carbsG: data.nutrition.carbsG,
            fatG: data.nutrition.fatG,
            fiberG: data.nutrition.fiberG ?? null,
            sugarG: data.nutrition.sugarG ?? null,
          },
        })
      }
    }

    return tx.recipe.findUniqueOrThrow({
      where: { id: recipeId },
      include: recipeInclude,
    })
  })
}

export async function deleteRecipe(recipeId: string, userId: string) {
  const existing = await prisma.recipe.findFirst({ where: { id: recipeId, userId } })
  if (!existing) return false

  await prisma.recipe.delete({ where: { id: recipeId } })
  return true
}
