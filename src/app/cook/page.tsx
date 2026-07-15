'use client'

import Link from 'next/link'
import { AppShell } from '@/components/features/layout/app-shell'
import { useMealPlans } from '@/lib/hooks/use-meal-plans'
import { useMealPlan } from '@/lib/hooks/use-meal-plans'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ChefHat, Clock, Play } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function CookPage() {
  const { data: plans, isLoading: plansLoading } = useMealPlans()
  const readyPlans = plans?.filter((p) => p.status === 'READY') ?? []
  const [selectedPlanId, setSelectedPlanId] = useState('')

  useEffect(() => {
    if (readyPlans.length > 0 && !selectedPlanId) {
      setSelectedPlanId(readyPlans[0]!.id)
    }
  }, [readyPlans, selectedPlanId])

  const { data: plan, isLoading: planLoading } = useMealPlan(selectedPlanId)

  if (plansLoading) {
    return (
      <AppShell>
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
        </div>
      </AppShell>
    )
  }

  if (readyPlans.length === 0) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center gap-4 py-16">
          <ChefHat className="h-12 w-12 text-muted-foreground/40" />
          <h2 className="text-lg font-semibold">No recipes to cook</h2>
          <p className="text-sm text-muted-foreground">Generate a meal plan first.</p>
          <Link href="/meal-plan"><Button>Go to Meal Plans</Button></Link>
        </div>
      </AppShell>
    )
  }

  // Deduplicate recipes from the plan
  const recipes = plan
    ? Array.from(
        new Map(plan.meals.map((m) => [m.recipe.id, m.recipe])).values()
      ).sort((a, b) => a.title.localeCompare(b.title))
    : []

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Cook</h1>
          <p className="text-muted-foreground">Select a recipe to start cooking</p>
        </div>

        {planLoading ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
              <Card key={recipe.id} className="group">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{recipe.title}</h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{recipe.totalTimeMinutes} min</span>
                      <Badge variant="outline" className="text-xs">{recipe.difficulty.toLowerCase()}</Badge>
                    </div>
                  </div>
                  <Link href={`/cook/${recipe.id}`}>
                    <Button size="sm" className="shrink-0">
                      <Play className="mr-1 h-3 w-3" /> Cook
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}
