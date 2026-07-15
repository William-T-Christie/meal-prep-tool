import { NextRequest } from 'next/server'
import { z } from 'zod/v4'
import { getAuthenticatedUserId } from '@/server/auth/get-session'
import { successResponse, errorResponse } from '@/lib/api-response'
import { prisma } from '@/lib/db'
import { replaceKitchenEquipment } from '@/server/services/user-profile-service'
import { kitchenEquipmentSchema } from '@/lib/validators/profile'

export async function GET() {
  const { userId, errorResp } = await getAuthenticatedUserId()
  if (!userId) return errorResp!

  const equipment = await prisma.kitchenEquipment.findMany({
    where: { userId },
    select: { id: true, equipmentName: true },
  })
  return successResponse(equipment)
}

export async function PUT(request: NextRequest) {
  const { userId, errorResp } = await getAuthenticatedUserId()
  if (!userId) return errorResp!

  const body = await request.json()
  const parsed = z.array(kitchenEquipmentSchema).safeParse(body)
  if (!parsed.success) {
    return errorResponse('Invalid kitchen equipment data', 400)
  }

  await replaceKitchenEquipment(userId, parsed.data)
  return successResponse({ success: true })
}
