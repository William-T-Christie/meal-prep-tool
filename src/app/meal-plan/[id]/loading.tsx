import { Skeleton } from '@/components/ui/skeleton'

export default function MealPlanDetailLoading() {
  return (
    <div className="space-y-6 p-4 lg:p-6">
      <Skeleton className="h-8 w-64" />
      <div className="hidden lg:grid lg:grid-cols-7 lg:gap-3">
        {Array.from({ length: 28 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-48 w-full" />
    </div>
  )
}
