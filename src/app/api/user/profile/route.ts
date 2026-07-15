import { NextRequest } from 'next/server'
import { getAuthenticatedUserId } from '@/server/auth/get-session'
import { successResponse, errorResponse } from '@/lib/api-response'
import { getUserFullProfile, upsertProfile } from '@/server/services/user-profile-service'
import { profileSchema } from '@/lib/validators/profile'

export async function GET() {
  const { userId, errorResp } = await getAuthenticatedUserId()
  if (!userId) return errorResp!

  const data = await getUserFullProfile(userId)
  return successResponse(data)
}

export async function PUT(request: NextRequest) {
  const { userId, errorResp } = await getAuthenticatedUserId()
  if (!userId) return errorResp!

  const body = await request.json()
  const parsed = profileSchema.safeParse(body)
  if (!parsed.success) {
    return errorResponse('Invalid profile data', 400)
  }

  const profile = await upsertProfile(userId, parsed.data)
  return successResponse(profile)
}
