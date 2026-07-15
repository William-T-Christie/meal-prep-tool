import { Skeleton } from '@/components/ui/skeleton'

export default function NewRecipeLoading() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 lg:p-6">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  )
}
