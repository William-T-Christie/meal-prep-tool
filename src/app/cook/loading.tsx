import { Skeleton } from '@/components/ui/skeleton'

export default function CookLoading() {
  return (
    <div className="space-y-4 p-4 lg:p-6">
      <Skeleton className="h-8 w-32" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>
    </div>
  )
}
