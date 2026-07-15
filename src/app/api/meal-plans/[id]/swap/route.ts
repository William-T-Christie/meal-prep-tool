import { NextRequest } from 'next/server'
import { getAuthenticatedUserId } from '@/server/auth/get-session'
import { successResponse, errorResponse } from '@/lib/api-response'
import { swapMeal } from '@/server/services/meal-plan-service'
import { swapMealSchema } from '@/lib/validators/meal-plan'
import { AiGenerationError } from '@/lib/ai/client'
import type { MealType } from '@/generated/prisma/client'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId, errorResp } = await getAuthenticatedUserId()
  if (!userId) return errorResp!

  const { id } = await params
  const body = await request.json()
  const parsed = swapMealSchema.safeParse(body)
  if (!parsed.success) {
    return errorResponse('Invalid swap data', 400)
  }

  try {
    const result = await swapMeal(id, userId, parsed.data.dayIndex, parsed.data.mealType as MealType)
    if (!result) {
      return errorResponse('Meal plan not found', 404)
    }
    return successResponse(result)
  } catch (error) {
    if (error instanceof AiGenerationError) {
      return errorResponse(`AI swap failed: ${error.message}`, 500)
    }
    return errorResponse('Failed to swap meal', 500)
  }
}
