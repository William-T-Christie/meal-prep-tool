import type { ReactNode } from 'react'
import { SidebarNav } from './sidebar-nav'
import { TopBar } from './top-bar'
import { UtensilsCrossed } from 'lucide-react'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside data-slot="sidebar" className="hidden w-64 flex-shrink-0 border-r bg-muted/30 lg:block print:hidden">
        <div className="flex h-14 items-center gap-2 border-b px-4">
          <UtensilsCrossed className="h-5 w-5 text-primary" />
          <span className="font-semibold">MealPrep</span>
        </div>
        <SidebarNav />
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        <TopBar />
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
