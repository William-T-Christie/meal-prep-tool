import { NextRequest } from 'next/server'
import { z } from 'zod/v4'
import { getAuthenticatedUserId } from '@/server/auth/get-session'
import { successResponse, errorResponse } from '@/lib/api-response'
import { prisma } from '@/lib/db'
import { replaceDietaryRestrictions } from '@/server/services/user-profile-service'
import { dietaryRestrictionSchema } from '@/lib/validators/profile'

export async function GET() {
  const { userId, errorResp } = await getAuthenticatedUserId()
  if (!userId) return errorResp!

  const restrictions = await prisma.dietaryRestriction.findMany({
    where: { userId },
    select: { id: true, type: true },
  })
  return successResponse(restrictions)
}

export async function PUT(request: NextRequest) {
  const { userId, errorResp } = await getAuthenticatedUserId()
  if (!userId) return errorResp!

  const body = await request.json()
  const parsed = z.array(dietaryRestrictionSchema).safeParse(body)
  if (!parsed.success) {
    return errorResponse('Invalid dietary restrictions data', 400)
  }

  await replaceDietaryRestrictions(userId, parsed.data)
  return successResponse({ success: true })
}
