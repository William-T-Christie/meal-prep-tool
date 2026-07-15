import { NextRequest } from 'next/server'
import { getAuthenticatedUserId } from '@/server/auth/get-session'
import { successResponse, errorResponse } from '@/lib/api-response'
import { generateMealPlan } from '@/server/services/meal-plan-service'
import { generateMealPlanSchema } from '@/lib/validators/meal-plan'
import { AiGenerationError } from '@/lib/ai/client'

export async function POST(request: NextRequest) {
  const { userId, errorResp } = await getAuthenticatedUserId()
  if (!userId) return errorResp!

  const body = await request.json()
  const parsed = generateMealPlanSchema.safeParse(body)
  if (!parsed.success) {
    return errorResponse('Invalid request data', 400)
  }

  try {
    const mealPlan = await generateMealPlan(userId, parsed.data.weekStartDate)
    return successResponse(mealPlan, 201)
  } catch (error) {
    if (error instanceof AiGenerationError) {
      return errorResponse(`AI generation failed: ${error.message}`, 500)
    }
    return errorResponse('Failed to generate meal plan', 500)
  }
}
