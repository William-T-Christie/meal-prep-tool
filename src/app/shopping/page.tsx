'use client'

import { useState, useEffect } from 'react'
import { AppShell } from '@/components/features/layout/app-shell'
import { ErrorBoundary } from '@/components/features/layout/error-boundary'
import { ShoppingListCategory } from '@/components/features/shopping/shopping-list-category'
import { useMealPlans } from '@/lib/hooks/use-meal-plans'
import { useShoppingList, useCheckedItems } from '@/lib/hooks/use-shopping-list'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Printer, RotateCcw } from 'lucide-react'
import Link from 'next/link'

export default function ShoppingPage() {
  const { data: plans, isLoading: plansLoading } = useMealPlans()
  const readyPlans = plans?.filter((p) => p.status === 'READY') ?? []

  const [selectedPlanId, setSelectedPlanId] = useState<string>('')

  // Auto-select the most recent ready plan
  useEffect(() => {
    if (readyPlans.length > 0 && !selectedPlanId) {
      setSelectedPlanId(readyPlans[0]!.id)
    }
  }, [readyPlans, selectedPlanId])

  const { data: shoppingList, isLoading: listLoading } = useShoppingList(selectedPlanId)
  const { checkedItems, toggleItem, clearAll, checkedCount } = useCheckedItems(selectedPlanId)

  if (plansLoading) {
    return (
      <AppShell>
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      </AppShell>
    )
  }

  if (readyPlans.length === 0) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center gap-4 py-16">
          <ShoppingCart className="h-12 w-12 text-muted-foreground/40" />
          <h2 className="text-lg font-semibold">No meal plans available</h2>
          <p className="text-sm text-muted-foreground">
            Generate a meal plan first to create a shopping list.
          </p>
          <Link href="/meal-plan">
            <Button>Go to Meal Plans</Button>
          </Link>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="space-y-6 print-shopping">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Shopping List</h1>
            {shoppingList && (
              <p className="text-sm text-muted-foreground">
                {checkedCount} of {shoppingList.totalItems} items checked
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={selectedPlanId}
              onValueChange={(v) => { if (v) setSelectedPlanId(v) }}
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Select meal plan" />
              </SelectTrigger>
              <SelectContent>
                {readyPlans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={clearAll} title="Clear all checks">
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => window.print()} title="Print">
              <Printer className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Shopping List */}
        {listLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : shoppingList ? (
          <ErrorBoundary>
            <Card>
              {shoppingList.categories.map((cat) => (
                <ShoppingListCategory
                  key={cat.category}
                  category={cat}
                  checkedItems={checkedItems}
                  onToggle={toggleItem}
                />
              ))}
            </Card>
          </ErrorBoundary>
        ) : null}
      </div>
    </AppShell>
  )
}
