import { NextRequest } from 'next/server'
import { z } from 'zod/v4'
import { getAuthenticatedUserId } from '@/server/auth/get-session'
import { successResponse, errorResponse } from '@/lib/api-response'
import { prisma } from '@/lib/db'
import { replaceCuisinePreferences } from '@/server/services/user-profile-service'
import { cuisinePreferenceSchema } from '@/lib/validators/profile'

export async function GET() {
  const { userId, errorResp } = await getAuthenticatedUserId()
  if (!userId) return errorResp!

  const preferences = await prisma.cuisinePreference.findMany({
    where: { userId },
    select: { id: true, cuisine: true, preference: true },
  })
  return successResponse(preferences)
}

export async function PUT(request: NextRequest) {
  const { userId, errorResp } = await getAuthenticatedUserId()
  if (!userId) return errorResp!

  const body = await request.json()
  const parsed = z.array(cuisinePreferenceSchema).safeParse(body)
  if (!parsed.success) {
    return errorResponse('Invalid cuisine preferences data', 400)
  }

  await replaceCuisinePreferences(userId, parsed.data)
  return successResponse({ success: true })
}
