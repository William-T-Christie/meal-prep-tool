import { auth } from '@/server/auth'
import { errorResponse } from '@/lib/api-response'

export async function getAuthenticatedUserId() {
  const session = await auth()
  if (!session?.user?.id) {
    return { userId: null, errorResp: errorResponse('Unauthorized', 401) }
  }
  return { userId: session.user.id, errorResp: null }
}
