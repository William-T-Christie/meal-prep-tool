import { NextRequest } from 'next/server'
import { getAuthenticatedUserId } from '@/server/auth/get-session'
import { successResponse, errorResponse } from '@/lib/api-response'
import { getMealPlan, deleteMealPlan } from '@/server/services/meal-plan-service'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId, errorResp } = await getAuthenticatedUserId()
  if (!userId) return errorResp!

  const { id } = await params
  const plan = await getMealPlan(id, userId)
  if (!plan) {
    return errorResponse('Meal plan not found', 404)
  }

  return successResponse(plan)
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId, errorResp } = await getAuthenticatedUserId()
  if (!userId) return errorResp!

  const { id } = await params
  const deleted = await deleteMealPlan(id, userId)
  if (!deleted) {
    return errorResponse('Meal plan not found', 404)
  }

  return successResponse({ deleted: true })
}
