'use client'

import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/features/layout/app-shell'
import { RecipeForm } from '@/components/features/recipes/recipe-form'
import { useCreateRecipe } from '@/lib/hooks/use-recipes'
import type { CreateRecipeInput } from '@/lib/validators/recipe'

export default function NewRecipePage() {
  const router = useRouter()
  const createRecipe = useCreateRecipe()

  async function handleSubmit(data: CreateRecipeInput) {
    const recipe = await createRecipe.mutateAsync(data)
    router.push(`/recipes/${recipe.id}`)
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-2xl font-bold">Create Recipe</h1>
        <RecipeForm onSubmit={handleSubmit} isSubmitting={createRecipe.isPending} />
      </div>
    </AppShell>
  )
}
