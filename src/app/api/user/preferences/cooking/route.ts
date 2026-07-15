import { NextRequest } from 'next/server'
import { z } from 'zod/v4'
import { getAuthenticatedUserId } from '@/server/auth/get-session'
import { successResponse, errorResponse } from '@/lib/api-response'
import { prisma } from '@/lib/db'
import { replaceCookingPreferences } from '@/server/services/user-profile-service'
import { cookingPreferenceSchema } from '@/lib/validators/profile'

export async function GET() {
  const { userId, errorResp } = await getAuthenticatedUserId()
  if (!userId) return errorResp!

  const preferences = await prisma.cookingPreference.findMany({
    where: { userId },
    select: { id: true, mealType: true, maxTimeMinutes: true },
  })
  return successResponse(preferences)
}

export async function PUT(request: NextRequest) {
  const { userId, errorResp } = await getAuthenticatedUserId()
  if (!userId) return errorResp!

  const body = await request.json()
  const parsed = z.array(cookingPreferenceSchema).safeParse(body)
  if (!parsed.success) {
    return errorResponse('Invalid cooking preferences data', 400)
  }

  await replaceCookingPreferences(userId, parsed.data)
  return successResponse({ success: true })
}
