'use client'

import { useState, useCallback, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { ShoppingListData } from '@/types'
import { SHOPPING_LIST_STORAGE_PREFIX } from '@/lib/constants/shopping'

async function fetchShoppingList(planId: string): Promise<ShoppingListData> {
  const res = await fetch(`/api/shopping-list/${planId}`)
  if (!res.ok) throw new Error('Failed to fetch shopping list')
  const json = await res.json()
  return json.data
}

export function useShoppingList(planId: string) {
  return useQuery({
    queryKey: ['shopping-list', planId],
    queryFn: () => fetchShoppingList(planId),
    enabled: !!planId,
  })
}

export function useCheckedItems(planId: string) {
  const storageKey = `${SHOPPING_LIST_STORAGE_PREFIX}${planId}`

  const [checkedItems, setCheckedItems] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set()
    try {
      const stored = localStorage.getItem(storageKey)
      return stored ? new Set(JSON.parse(stored) as string[]) : new Set()
    } catch {
      return new Set()
    }
  })

  // Sync to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(Array.from(checkedItems)))
    } catch {
      // localStorage full or unavailable
    }
  }, [checkedItems, storageKey])

  const toggleItem = useCallback((id: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const clearAll = useCallback(() => {
    setCheckedItems(new Set())
  }, [])

  return {
    checkedItems,
    toggleItem,
    clearAll,
    checkedCount: checkedItems.size,
  }
}
