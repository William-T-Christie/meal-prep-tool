import { NextRequest } from 'next/server'
import { getAuthenticatedUserId } from '@/server/auth/get-session'
import { successResponse, errorResponse } from '@/lib/api-response'
import { getRecipeById, updateRecipe, deleteRecipe } from '@/server/services/recipe-service'
import { updateRecipeSchema } from '@/lib/validators/recipe'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId, errorResp } = await getAuthenticatedUserId()
  if (!userId) return errorResp!

  const { id } = await params
  const recipe = await getRecipeById(id, userId)
  if (!recipe) {
    return errorResponse('Recipe not found', 404)
  }

  return successResponse(recipe)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId, errorResp } = await getAuthenticatedUserId()
  if (!userId) return errorResp!

  const { id } = await params
  const body = await request.json()
  const parsed = updateRecipeSchema.safeParse(body)
  if (!parsed.success) {
    return errorResponse('Invalid recipe data', 400)
  }

  const recipe = await updateRecipe(id, userId, parsed.data)
  if (!recipe) {
    return errorResponse('Recipe not found', 404)
  }

  return successResponse(recipe)
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId, errorResp } = await getAuthenticatedUserId()
  if (!userId) return errorResp!

  const { id } = await params
  const deleted = await deleteRecipe(id, userId)
  if (!deleted) {
    return errorResponse('Recipe not found', 404)
  }

  return successResponse({ deleted: true })
}
