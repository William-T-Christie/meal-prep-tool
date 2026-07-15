'use client'

import { UserButton } from '@/components/features/auth/user-button'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { SidebarNav } from './sidebar-nav'
import { Menu, UtensilsCrossed } from 'lucide-react'

export function TopBar() {
  return (
    <header data-slot="topbar" className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6 print:hidden">
      <Sheet>
        <SheetTrigger className="lg:hidden inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation</span>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-14 items-center gap-2 border-b px-4">
            <UtensilsCrossed className="h-5 w-5 text-primary" />
            <span className="font-semibold">MealPrep</span>
          </div>
          <SidebarNav />
        </SheetContent>
      </Sheet>

      <div className="flex-1" />

      <UserButton />
    </header>
  )
}
