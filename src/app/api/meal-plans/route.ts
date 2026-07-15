import { getAuthenticatedUserId } from '@/server/auth/get-session'
import { successResponse } from '@/lib/api-response'
import { getUserMealPlans } from '@/server/services/meal-plan-service'

export async function GET() {
  const { userId, errorResp } = await getAuthenticatedUserId()
  if (!userId) return errorResp!

  const plans = await getUserMealPlans(userId)
  return successResponse(plans)
}
