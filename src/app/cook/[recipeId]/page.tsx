'use client'

import { useParams } from 'next/navigation'
import { useRecipe } from '@/lib/hooks/use-recipes'
import { CookModeProvider } from '@/components/features/cook/cook-mode-provider'
import { CookModeShell } from '@/components/features/cook/cook-mode-shell'
import { Skeleton } from '@/components/ui/skeleton'
import { ChefHat } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function CookRecipePage() {
  const { recipeId } = useParams<{ recipeId: string }>()
  const { data: recipe, isLoading, error } = useRecipe(recipeId)

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
    )
  }

  if (error || !recipe) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <ChefHat className="h-12 w-12 text-muted-foreground/40" />
        <h2 className="text-lg font-semibold">Recipe not found</h2>
        <Link href="/cook"><Button variant="outline">Back to recipes</Button></Link>
      </div>
    )
  }

  if (recipe.instructions.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <ChefHat className="h-12 w-12 text-muted-foreground/40" />
        <h2 className="text-lg font-semibold">No instructions available</h2>
        <p className="text-sm text-muted-foreground">This recipe doesn&apos;t have cooking instructions yet.</p>
        <Link href={`/recipes/${recipe.id}`}><Button variant="outline">View recipe</Button></Link>
      </div>
    )
  }

  return (
    <CookModeProvider recipe={recipe}>
      <CookModeShell />
    </CookModeProvider>
  )
}
