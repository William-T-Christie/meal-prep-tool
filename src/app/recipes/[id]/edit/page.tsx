'use client'

import { useParams, useRouter } from 'next/navigation'
import { AppShell } from '@/components/features/layout/app-shell'
import { RecipeForm } from '@/components/features/recipes/recipe-form'
import { useRecipe, useUpdateRecipe } from '@/lib/hooks/use-recipes'
import { Skeleton } from '@/components/ui/skeleton'
import type { CreateRecipeInput } from '@/lib/validators/recipe'

export default function EditRecipePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { data: recipe, isLoading } = useRecipe(id)
  const updateRecipe = useUpdateRecipe()

  async function handleSubmit(data: CreateRecipeInput) {
    await updateRecipe.mutateAsync({ id, data })
    router.push(`/recipes/${id}`)
  }

  if (isLoading) {
    return (
      <AppShell>
        <div className="mx-auto max-w-3xl space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      </AppShell>
    )
  }

  if (!recipe) {
    return (
      <AppShell>
        <div className="py-16 text-center text-muted-foreground">Recipe not found</div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-2xl font-bold">Edit Recipe</h1>
        <RecipeForm
          initialData={recipe}
          onSubmit={handleSubmit}
          isSubmitting={updateRecipe.isPending}
        />
      </div>
    </AppShell>
  )
}
