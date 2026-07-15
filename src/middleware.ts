import NextAuth from 'next-auth'
import { edgeAuthConfig } from '@/server/auth/edge-config'

const { auth } = NextAuth(edgeAuthConfig)

export default auth

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|login|register).*)',
  ],
}
