import { PrismaAdapter } from '@auth/prisma-adapter'
import type { NextAuthConfig } from 'next-auth'
import { prisma } from '@/lib/db'
import { edgeAuthConfig } from './edge-config'

/**
 * Full auth config with Prisma adapter — used by API routes (Node.js runtime).
 */
export const authConfig: NextAuthConfig = {
  ...edgeAuthConfig,
  adapter: PrismaAdapter(prisma),
}
