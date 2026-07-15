import { NextRequest } from 'next/server'
import { getAuthenticatedUserId } from '@/server/auth/get-session'
import { successResponse, errorResponse } from '@/lib/api-response'
import { submitOnboarding } from '@/server/services/user-profile-service'
import { onboardingSchema } from '@/lib/validators/profile'

export async function POST(request: NextRequest) {
  const { userId, errorResp } = await getAuthenticatedUserId()
  if (!userId) return errorResp!

  const body = await request.json()
  const parsed = onboardingSchema.safeParse(body)
  if (!parsed.success) {
    return errorResponse('Invalid onboarding data', 400)
  }

  await submitOnboarding(userId, parsed.data)
  return successResponse({ success: true }, 201)
}
