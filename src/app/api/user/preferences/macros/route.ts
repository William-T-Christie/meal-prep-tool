import { NextRequest } from 'next/server'
import { z } from 'zod/v4'
import { getAuthenticatedUserId } from '@/server/auth/get-session'
import { successResponse, errorResponse } from '@/lib/api-response'
import { prisma } from '@/lib/db'
import { replaceMacroGoals } from '@/server/services/user-profile-service'
import { macroGoalSchema } from '@/lib/validators/profile'

export async function GET() {
  const { userId, errorResp } = await getAuthenticatedUserId()
  if (!userId) return errorResp!

  const goals = await prisma.macroGoal.findMany({
    where: { userId },
    select: { id: true, mealType: true, calories: true, proteinG: true, carbsG: true, fatG: true },
  })
  return successResponse(goals)
}

export async function PUT(request: NextRequest) {
  const { userId, errorResp } = await getAuthenticatedUserId()
  if (!userId) return errorResp!

  const body = await request.json()
  const parsed = z.array(macroGoalSchema).safeParse(body)
  if (!parsed.success) {
    return errorResponse('Invalid macro goals data', 400)
  }

  await replaceMacroGoals(userId, parsed.data)
  return successResponse({ success: true })
}
