'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { AppShell } from '@/components/features/layout/app-shell'
import { ErrorBoundary } from '@/components/features/layout/error-boundary'
import { WeeklyGrid } from '@/components/features/meal-plan/weekly-grid'
import { MacroSummaryPanel } from '@/components/features/meal-plan/macro-summary-panel'
import { MealPlanDeleteDialog } from '@/components/features/meal-plan/meal-plan-delete-dialog'
import { useMealPlan, useDeleteMealPlan } from '@/lib/hooks/use-meal-plans'
import { useUserProfile } from '@/lib/hooks/use-user-profile'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, CalendarDays, Loader2 } from 'lucide-react'

export default function MealPlanDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { data: plan, isLoading } = useMealPlan(id)
  const { data: userProfile } = useUserProfile()
  const deletePlan = useDeleteMealPlan()

  async function handleDelete() {
    await deletePlan.mutateAsync(plan!.id)
    router.push('/meal-plan')
  }

  if (isLoading) {
    return (
      <AppShell>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
          <div className="grid grid-cols-7 gap-3">
            {Array.from({ length: 28 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
        </div>
      </AppShell>
    )
  }

  if (!plan) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center gap-4 py-16">
          <CalendarDays className="h-12 w-12 text-muted-foreground/40" />
          <h2 className="text-lg font-semibold">Meal plan not found</h2>
          <Link href="/meal-plan"><Button variant="outline">Back to meal plans</Button></Link>
        </div>
      </AppShell>
    )
  }

  if (plan.status === 'GENERATING') {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center gap-4 py-16">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <h2 className="text-lg font-semibold">Generating your meal plan...</h2>
          <p className="text-sm text-muted-foreground">This may take 15-30 seconds.</p>
        </div>
      </AppShell>
    )
  }

  if (plan.status === 'FAILED') {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center gap-4 py-16">
          <Badge variant="destructive" className="text-lg px-4 py-1">Generation Failed</Badge>
          <p className="text-sm text-muted-foreground">Something went wrong generating your meal plan. Please try again.</p>
          <Link href="/meal-plan"><Button variant="outline">Back to meal plans</Button></Link>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link href="/meal-plan">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">{plan.title}</h1>
            </div>
            <p className="text-sm text-muted-foreground ml-10">
              Week of {new Date(plan.weekStartDate).toLocaleDateString()}
            </p>
          </div>
          <MealPlanDeleteDialog planTitle={plan.title} onConfirm={handleDelete} />
        </div>

        {/* Weekly Grid */}
        <ErrorBoundary>
          <WeeklyGrid mealPlanId={plan.id} meals={plan.meals} />
        </ErrorBoundary>

        {/* Macro Summary */}
        <ErrorBoundary>
          <MacroSummaryPanel
            meals={plan.meals}
            macroGoals={userProfile?.macroGoals ?? []}
          />
        </ErrorBoundary>
      </div>
    </AppShell>
  )
}
