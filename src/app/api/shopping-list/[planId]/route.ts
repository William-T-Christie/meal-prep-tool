import { NextRequest } from 'next/server'
import { getAuthenticatedUserId } from '@/server/auth/get-session'
import { successResponse, errorResponse } from '@/lib/api-response'
import { getMealPlan } from '@/server/services/meal-plan-service'
import { generateShoppingList } from '@/lib/shopping'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ planId: string }> }
) {
  const { userId, errorResp } = await getAuthenticatedUserId()
  if (!userId) return errorResp!

  const { planId } = await params
  const plan = await getMealPlan(planId, userId)
  if (!plan) {
    return errorResponse('Meal plan not found', 404)
  }
  if (plan.status !== 'READY') {
    return errorResponse('Meal plan is not ready', 400)
  }

  const shoppingList = generateShoppingList(plan as unknown as Parameters<typeof generateShoppingList>[0])
  return successResponse(shoppingList)
}
