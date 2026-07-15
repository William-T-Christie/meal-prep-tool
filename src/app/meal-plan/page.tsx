'use client'

import Link from 'next/link'
import { AppShell } from '@/components/features/layout/app-shell'
import { MealPlanGenerateButton } from '@/components/features/meal-plan/meal-plan-generate-button'
import { useMealPlans, useDeleteMealPlan } from '@/lib/hooks/use-meal-plans'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { MealPlanDeleteDialog } from '@/components/features/meal-plan/meal-plan-delete-dialog'
import { CalendarDays, Sparkles } from 'lucide-react'

const STATUS_COLORS: Record<string, 'default' | 'secondary' | 'destructive'> = {
  READY: 'default',
  GENERATING: 'secondary',
  FAILED: 'destructive',
}

export default function MealPlanListPage() {
  const { data: plans, isLoading } = useMealPlans()
  const deletePlan = useDeleteMealPlan()

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Meal Plans</h1>
            <p className="text-muted-foreground">AI-generated weekly meal plans</p>
          </div>
          <MealPlanGenerateButton />
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
        ) : plans && plans.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card key={plan.id} className="group">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <Link href={`/meal-plan/${plan.id}`} className="hover:text-primary">
                      <CardTitle className="text-base">{plan.title}</CardTitle>
                    </Link>
                    <Badge variant={STATUS_COLORS[plan.status] ?? 'secondary'}>
                      {plan.status.toLowerCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {new Date(plan.weekStartDate).toLocaleDateString()}
                  </span>
                  <MealPlanDeleteDialog
                    planTitle={plan.title}
                    onConfirm={() => deletePlan.mutateAsync(plan.id)}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-16">
            <CalendarDays className="h-12 w-12 text-muted-foreground/40" />
            <h2 className="text-lg font-semibold">No meal plans yet</h2>
            <p className="text-sm text-muted-foreground">
              Generate your first AI-powered meal plan to get started.
            </p>
            <MealPlanGenerateButton />
          </div>
        )}
      </div>
    </AppShell>
  )
}
