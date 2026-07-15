'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { RecipeDetail, PaginatedResponse, RecipeSummary } from '@/types'
import type { RecipeListQuery, CreateRecipeInput, UpdateRecipeInput } from '@/lib/validators/recipe'
import { toast } from 'sonner'

function buildQueryString(query: RecipeListQuery): string {
  const params = new URLSearchParams()
  if (query.search) params.set('search', query.search)
  if (query.cuisineType) params.set('cuisineType', query.cuisineType)
  if (query.difficulty) params.set('difficulty', query.difficulty)
  if (query.maxTotalTime) params.set('maxTotalTime', String(query.maxTotalTime))
  if (query.tags) {
    const tagArray = Array.isArray(query.tags) ? query.tags : [query.tags]
    tagArray.forEach((t) => params.append('tags', t))
  }
  if (query.sortBy) params.set('sortBy', query.sortBy)
  if (query.page) params.set('page', String(query.page))
  if (query.pageSize) params.set('pageSize', String(query.pageSize))
  return params.toString()
}

async function fetchRecipes(query: RecipeListQuery): Promise<PaginatedResponse<RecipeSummary>> {
  const qs = buildQueryString(query)
  const res = await fetch(`/api/recipes?${qs}`)
  if (!res.ok) throw new Error('Failed to fetch recipes')
  const json = await res.json()
  return json.data
}

async function fetchRecipe(id: string): Promise<RecipeDetail> {
  const res = await fetch(`/api/recipes/${id}`)
  if (!res.ok) throw new Error('Failed to fetch recipe')
  const json = await res.json()
  return json.data
}

export function useRecipes(query: RecipeListQuery) {
  return useQuery({
    queryKey: ['recipes', query],
    queryFn: () => fetchRecipes(query),
  })
}

export function useRecipe(id: string) {
  return useQuery({
    queryKey: ['recipe', id],
    queryFn: () => fetchRecipe(id),
    enabled: !!id,
  })
}

export function useCreateRecipe() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateRecipeInput) => {
      const res = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error ?? 'Failed to create recipe')
      }
      return (await res.json()).data as RecipeDetail
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      toast.success('Recipe created!')
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}

export function useUpdateRecipe() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateRecipeInput }) => {
      const res = await fetch(`/api/recipes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error ?? 'Failed to update recipe')
      }
      return (await res.json()).data as RecipeDetail
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      queryClient.invalidateQueries({ queryKey: ['recipe', variables.id] })
      toast.success('Recipe updated!')
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}

export function useDeleteRecipe() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/recipes/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error ?? 'Failed to delete recipe')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      toast.success('Recipe deleted')
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}
