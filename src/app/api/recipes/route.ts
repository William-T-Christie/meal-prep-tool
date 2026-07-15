import { NextRequest } from 'next/server'
import { getAuthenticatedUserId } from '@/server/auth/get-session'
import { successResponse, errorResponse } from '@/lib/api-response'
import { createRecipe, getUserRecipes } from '@/server/services/recipe-service'
import { createRecipeSchema, recipeListQuerySchema } from '@/lib/validators/recipe'

export async function GET(request: NextRequest) {
  const { userId, errorResp } = await getAuthenticatedUserId()
  if (!userId) return errorResp!

  const params = Object.fromEntries(request.nextUrl.searchParams)
  const parsed = recipeListQuerySchema.safeParse(params)
  if (!parsed.success) {
    return errorResponse('Invalid query parameters', 400)
  }

  const data = await getUserRecipes(userId, parsed.data)
  return successResponse(data)
}

export async function POST(request: NextRequest) {
  const { userId, errorResp } = await getAuthenticatedUserId()
  if (!userId) return errorResp!

  const body = await request.json()
  const parsed = createRecipeSchema.safeParse(body)
  if (!parsed.success) {
    return errorResponse('Invalid recipe data', 400)
  }

  const recipe = await createRecipe(userId, parsed.data)
  return successResponse(recipe, 201)
}
