import type { NextAuthConfig } from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'

/**
 * Edge-safe auth config - no Prisma adapter, no Node.js modules.
 * Used by middleware for route protection.
 */
export const edgeAuthConfig: NextAuthConfig = {
  session: { strategy: 'jwt' },
  providers: [GitHub, Google],
  pages: {
    signIn: '/login',
    newUser: '/onboarding',
  },
  callbacks: {
    session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub
      }
      return session
    },
    jwt({ token, user }) {
      if (user) {
        token.sub = user.id
      }
      return token
    },
  },
}
