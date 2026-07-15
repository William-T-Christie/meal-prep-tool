import { Skeleton } from '@/components/ui/skeleton'

export default function ShoppingLoading() {
  return (
    <div className="space-y-4 p-4 lg:p-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-10 w-full" />
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  )
}
