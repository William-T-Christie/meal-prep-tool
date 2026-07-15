'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AppShell } from '@/components/features/layout/app-shell'
import { RecipeCard } from '@/components/features/recipes/recipe-card'
import { RecipeFilters } from '@/components/features/recipes/recipe-filters'
import { RecipePagination } from '@/components/features/recipes/recipe-pagination'
import { useRecipes } from '@/lib/hooks/use-recipes'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, UtensilsCrossed } from 'lucide-react'
import type { RecipeListQuery } from '@/lib/validators/recipe'

export default function RecipesPage() {
  const [search, setSearch] = useState('')
  const [cuisineType, setCuisineType] = useState('all')
  const [difficulty, setDifficulty] = useState('all')
  const [maxTotalTime, setMaxTotalTime] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [page, setPage] = useState(1)

  const query: RecipeListQuery = {
    search: search || undefined,
    cuisineType: cuisineType !== 'all' ? cuisineType : undefined,
    difficulty: difficulty !== 'all' ? difficulty as 'EASY' | 'MEDIUM' | 'HARD' : undefined,
    maxTotalTime: maxTotalTime ? parseInt(maxTotalTime) : undefined,
    sortBy: sortBy as 'newest' | 'alphabetical' | 'cook_time',
    page,
    pageSize: 12,
  }

  const { data, isLoading } = useRecipes(query)

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Recipes</h1>
            <p className="text-muted-foreground">Your recipe library</p>
          </div>
          <Link href="/recipes/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> New Recipe
            </Button>
          </Link>
        </div>

        <RecipeFilters
          search={search}
          cuisineType={cuisineType}
          difficulty={difficulty}
          maxTotalTime={maxTotalTime}
          sortBy={sortBy}
          onSearchChange={(v) => { setSearch(v); setPage(1) }}
          onCuisineChange={(v) => { setCuisineType(v ?? 'all'); setPage(1) }}
          onDifficultyChange={(v) => { setDifficulty(v ?? 'all'); setPage(1) }}
          onMaxTimeChange={(v) => { setMaxTotalTime(v); setPage(1) }}
          onSortChange={(v) => setSortBy(v ?? 'newest')}
        />

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-lg" />
            ))}
          </div>
        ) : data && data.items.length > 0 ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.items.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
            <RecipePagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-16">
            <UtensilsCrossed className="h-12 w-12 text-muted-foreground/40" />
            <h2 className="text-lg font-semibold">No recipes yet</h2>
            <p className="text-sm text-muted-foreground">Create your first recipe to get started.</p>
            <Link href="/recipes/new">
              <Button><Plus className="mr-2 h-4 w-4" /> Create Recipe</Button>
            </Link>
          </div>
        )}
      </div>
    </AppShell>
  )
}
