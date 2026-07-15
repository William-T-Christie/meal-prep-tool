import { NextRequest } from 'next/server'
import { z } from 'zod/v4'
import { getAuthenticatedUserId } from '@/server/auth/get-session'
import { successResponse, errorResponse } from '@/lib/api-response'
import { prisma } from '@/lib/db'
import { replaceAllergies } from '@/server/services/user-profile-service'
import { allergySchema } from '@/lib/validators/profile'

export async function GET() {
  const { userId, errorResp } = await getAuthenticatedUserId()
  if (!userId) return errorResp!

  const allergies = await prisma.allergy.findMany({
    where: { userId },
    select: { id: true, name: true, severity: true },
  })
  return successResponse(allergies)
}

export async function PUT(request: NextRequest) {
  const { userId, errorResp } = await getAuthenticatedUserId()
  if (!userId) return errorResp!

  const body = await request.json()
  const parsed = z.array(allergySchema).safeParse(body)
  if (!parsed.success) {
    return errorResponse('Invalid allergies data', 400)
  }

  await replaceAllergies(userId, parsed.data)
  return successResponse({ success: true })
}
