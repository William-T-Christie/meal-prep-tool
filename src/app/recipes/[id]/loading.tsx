import { Skeleton } from '@/components/ui/skeleton'

export default function RecipeDetailLoading() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 lg:p-6">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-96" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-28" />
      </div>
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  )
}
