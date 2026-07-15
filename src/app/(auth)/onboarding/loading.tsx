import { Skeleton } from '@/components/ui/skeleton'

export default function OnboardingLoading() {
  return (
    <div className="w-full max-w-2xl space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-2 w-full" />
      </div>
      <Skeleton className="h-64 w-full rounded-lg" />
      <div className="flex justify-between">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
  )
}
