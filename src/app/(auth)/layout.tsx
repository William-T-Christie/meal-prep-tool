import type { ReactNode } from 'react'
import { UtensilsCrossed } from 'lucide-react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4">
      <div className="mb-8 flex items-center gap-2">
        <UtensilsCrossed className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold">MealPrep</h1>
      </div>
      {children}
    </div>
  )
}
