'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { MealPlanDetail, MealPlanSummary } from '@/types'
import type { SwapMealInput } from '@/lib/validators/meal-plan'
import { toast } from 'sonner'

async function fetchMealPlans(): Promise<MealPlanSummary[]> {
  const res = await fetch('/api/meal-plans')
  if (!res.ok) throw new Error('Failed to fetch meal plans')
  const json = await res.json()
  return json.data
}

async function fetchMealPlan(id: string): Promise<MealPlanDetail> {
  const res = await fetch(`/api/meal-plans/${id}`)
  if (!res.ok) throw new Error('Failed to fetch meal plan')
  const json = await res.json()
  return json.data
}

export function useMealPlans() {
  return useQuery({
    queryKey: ['meal-plans'],
    queryFn: fetchMealPlans,
  })
}

export function useMealPlan(id: string) {
  return useQuery({
    queryKey: ['meal-plan', id],
    queryFn: () => fetchMealPlan(id),
    enabled: !!id,
  })
}

export function useGenerateMealPlan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (weekStartDate: Date) => {
      const res = await fetch('/api/meal-plans/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weekStartDate: weekStartDate.toISOString() }),
      })
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error ?? 'Failed to generate meal plan')
      }
      return (await res.json()).data as MealPlanDetail
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meal-plans'] })
      toast.success('Meal plan generated!')
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}

export function useDeleteMealPlan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/meal-plans/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error ?? 'Failed to delete meal plan')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meal-plans'] })
      toast.success('Meal plan deleted')
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}

export function useSwapMeal(mealPlanId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: SwapMealInput) => {
      const res = await fetch(`/api/meal-plans/${mealPlanId}/swap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error ?? 'Failed to swap meal')
      }
      return (await res.json()).data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meal-plan', mealPlanId] })
      toast.success('Meal swapped!')
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}
