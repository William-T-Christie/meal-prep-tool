'use client'

import { useQuery } from '@tanstack/react-query'
import type { FullUserProfile } from '@/types'

async function fetchUserProfile(): Promise<FullUserProfile> {
  const res = await fetch('/api/user/profile')
  if (!res.ok) throw new Error('Failed to fetch profile')
  const json = await res.json()
  return json.data
}

export function useUserProfile() {
  return useQuery({
    queryKey: ['user-profile'],
    queryFn: fetchUserProfile,
  })
}
