'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUserProfile } from '@/lib/hooks/use-user-profile'
import { AppShell } from '@/components/features/layout/app-shell'
import { ErrorBoundary } from '@/components/features/layout/error-boundary'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  UtensilsCrossed,
  ShieldAlert,
  Clock,
  Target,
  ChefHat,
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const router = useRouter()
  const { data, isLoading, error } = useUserProfile()

  // Redirect to onboarding if not completed
  useEffect(() => {
    if (!isLoading && data && !data.profile?.onboardingCompleted) {
      router.push('/onboarding')
    }
  }, [data, isLoading, router])

  if (isLoading) return <DashboardSkeleton />
  if (error || !data) {
    return (
      <AppShell>
        <div className="py-12 text-center text-muted-foreground">
          Failed to load profile. Please try refreshing.
        </div>
      </AppShell>
    )
  }

  const { profile, allergies, dietaryRestrictions, macroGoals, cookingPreferences, kitchenEquipment } = data

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's your meal planning overview.
          </p>
        </div>

        <ErrorBoundary>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Profile Summary */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <ChefHat className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-medium">Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Skill Level</span>
                <Badge variant="outline">{profile?.cookingSkill?.toLowerCase() ?? 'Not set'}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Household</span>
                <span>{profile?.householdSize ?? 1} people</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Budget</span>
                <span>{profile?.budgetWeekly ? `$${profile.budgetWeekly}/week` : 'Not set'}</span>
              </div>
            </CardContent>
          </Card>

          {/* Allergies & Dietary */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <ShieldAlert className="h-4 w-4 text-destructive" />
              <CardTitle className="text-sm font-medium">Dietary & Allergies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {dietaryRestrictions.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {dietaryRestrictions.map((d) => (
                    <Badge key={d.id} variant="secondary" className="text-xs">
                      {d.type.replace(/_/g, ' ').toLowerCase()}
                    </Badge>
                  ))}
                </div>
              )}
              {allergies.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {allergies.map((a) => (
                    <Badge key={a.id} variant="destructive" className="text-xs">
                      {a.name}
                    </Badge>
                  ))}
                </div>
              )}
              {dietaryRestrictions.length === 0 && allergies.length === 0 && (
                <p className="text-sm text-muted-foreground">None set</p>
              )}
            </CardContent>
          </Card>

          {/* Cooking Time */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <Clock className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-medium">Cooking Time</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              {cookingPreferences.length > 0 ? (
                cookingPreferences.map((c) => (
                  <div key={c.id} className="flex justify-between">
                    <span className="capitalize text-muted-foreground">
                      {c.mealType.toLowerCase()}
                    </span>
                    <span>{c.maxTimeMinutes} min</span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No time limits set</p>
              )}
            </CardContent>
          </Card>

          {/* Macro Goals */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <Target className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-medium">Nutrition Goals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              {macroGoals.length > 0 ? (
                macroGoals.map((m) => (
                  <div key={m.id} className="flex justify-between">
                    <span className="capitalize text-muted-foreground">
                      {m.mealType.toLowerCase()}
                    </span>
                    <span className="text-xs">
                      {m.calories}cal | {m.proteinG}P | {m.carbsG}C | {m.fatG}F
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No goals set</p>
              )}
            </CardContent>
          </Card>

          {/* Equipment */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <UtensilsCrossed className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-medium">Kitchen Equipment</CardTitle>
            </CardHeader>
            <CardContent>
              {kitchenEquipment.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {kitchenEquipment.map((e) => (
                    <Badge key={e.id} variant="outline" className="text-xs">
                      {e.equipmentName}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">None selected</p>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link
                href="/meal-plan"
                className="block rounded-md bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Generate Meal Plan
              </Link>
              <Link
                href="/settings"
                className="block rounded-md border px-3 py-2 text-center text-sm font-medium hover:bg-muted"
              >
                Edit Preferences
              </Link>
            </CardContent>
          </Card>
        </div>
        </ErrorBoundary>
      </div>
    </AppShell>
  )
}

function DashboardSkeleton() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-2 h-4 w-72" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
