'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { AppShell } from '@/components/features/layout/app-shell'
import { useRecipe, useDeleteRecipe } from '@/lib/hooks/use-recipes'
import { RecipeServingAdjuster } from '@/components/features/recipes/recipe-serving-adjuster'
import { RecipeIngredientsList } from '@/components/features/recipes/recipe-ingredients-list'
import { RecipeInstructionsList } from '@/components/features/recipes/recipe-instructions-list'
import { RecipeNutritionCard } from '@/components/features/recipes/recipe-nutrition-card'
import { RecipeDeleteDialog } from '@/components/features/recipes/recipe-delete-dialog'
import { RecipeShareButton } from '@/components/features/recipes/export/recipe-share-button'
import { RecipePrintButton } from '@/components/features/recipes/export/recipe-print-button'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Clock, ChefHat, Users, Pencil, Globe, UtensilsCrossed } from 'lucide-react'

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { data: recipe, isLoading } = useRecipe(id)
  const deleteRecipe = useDeleteRecipe()
  const [servings, setServings] = useState<number | null>(null)

  if (isLoading) {
    return (
      <AppShell>
        <div className="mx-auto max-w-3xl space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
          <Skeleton className="h-64 w-full" />
        </div>
      </AppShell>
    )
  }

  if (!recipe) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center gap-4 py-16">
          <UtensilsCrossed className="h-12 w-12 text-muted-foreground/40" />
          <h2 className="text-lg font-semibold">Recipe not found</h2>
          <Link href="/recipes"><Button variant="outline">Back to recipes</Button></Link>
        </div>
      </AppShell>
    )
  }

  const currentServings = servings ?? recipe.baseServings

  async function handleDelete() {
    await deleteRecipe.mutateAsync(recipe!.id)
    router.push('/recipes')
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h1 className="text-2xl font-bold">{recipe.title}</h1>
            <div className="flex gap-2 print:hidden">
              <RecipeShareButton recipeId={recipe.id} />
              <RecipePrintButton />
              <Link href={`/recipes/${recipe.id}/edit`}>
                <Button variant="outline" size="sm">
                  <Pencil className="mr-2 h-4 w-4" /> Edit
                </Button>
              </Link>
              <RecipeDeleteDialog recipeName={recipe.title} onConfirm={handleDelete} />
            </div>
          </div>
          {recipe.description && (
            <p className="text-muted-foreground">{recipe.description}</p>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline" className="gap-1">
              <Clock className="h-3 w-3" /> {recipe.prepTimeMinutes} prep + {recipe.cookTimeMinutes} cook
            </Badge>
            <Badge variant="outline" className="gap-1">
              <ChefHat className="h-3 w-3" /> {recipe.difficulty.toLowerCase()}
            </Badge>
            {recipe.cuisineType && (
              <Badge variant="outline" className="gap-1">
                <Globe className="h-3 w-3" /> {recipe.cuisineType}
              </Badge>
            )}
            <Badge variant="outline" className="gap-1">
              <Users className="h-3 w-3" /> {recipe.baseServings} servings
            </Badge>
          </div>
          {recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {recipe.tags.map((tag) => (
                <Badge key={tag.id} variant="secondary">{tag.tagName}</Badge>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Serving Adjuster + Ingredients */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Ingredients</CardTitle>
            <RecipeServingAdjuster servings={currentServings} onChange={setServings} />
          </CardHeader>
          <CardContent>
            <RecipeIngredientsList
              ingredients={recipe.ingredients}
              baseServings={recipe.baseServings}
              currentServings={currentServings}
            />
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <RecipeInstructionsList instructions={recipe.instructions} />
          </CardContent>
        </Card>

        {/* Nutrition */}
        {recipe.nutrition && (
          <RecipeNutritionCard
            nutrition={recipe.nutrition}
            baseServings={recipe.baseServings}
            currentServings={currentServings}
          />
        )}

        {recipe.sourceUrl && (
          <p className="text-sm text-muted-foreground">
            Source: <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline">{recipe.sourceUrl}</a>
          </p>
        )}
      </div>
    </AppShell>
  )
}
