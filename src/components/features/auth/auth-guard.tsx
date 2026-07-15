'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useUserProfile } from '@/lib/hooks/use-user-profile'
import { Skeleton } from '@/components/ui/skeleton'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const { data: profileData, isLoading: profileLoading } = useUserProfile()

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register')
  const isOnboarding = pathname.startsWith('/onboarding')

  useEffect(() => {
    if (status === 'unauthenticated' && !isAuthPage) {
      router.push('/login')
      return
    }

    if (status === 'authenticated' && isAuthPage) {
      router.push('/dashboard')
      return
    }

    // Redirect to onboarding if profile not completed
    if (
      status === 'authenticated' &&
      !profileLoading &&
      profileData &&
      !profileData.profile?.onboardingCompleted &&
      !isOnboarding &&
      !isAuthPage
    ) {
      router.push('/onboarding')
    }
  }, [status, profileData, profileLoading, isAuthPage, isOnboarding, router, pathname])

  if (status === 'loading' || (status === 'authenticated' && profileLoading && !isAuthPage && !isOnboarding)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <Skeleton className="mx-auto h-8 w-8 rounded-full" />
          <Skeleton className="mx-auto h-4 w-32" />
        </div>
      </div>
    )
  }

  return <>{children}</>
}
