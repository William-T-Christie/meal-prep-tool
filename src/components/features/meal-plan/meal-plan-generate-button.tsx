'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useGenerateMealPlan } from '@/lib/hooks/use-meal-plans'
import { Sparkles, Loader2 } from 'lucide-react'

function getNextMonday(): string {
  const now = new Date()
  const day = now.getDay()
  const diff = day === 0 ? 1 : 8 - day
  const monday = new Date(now)
  monday.setDate(now.getDate() + diff)
  return monday.toISOString().split('T')[0] ?? ''
}

export function MealPlanGenerateButton() {
  const router = useRouter()
  const generatePlan = useGenerateMealPlan()
  const [open, setOpen] = useState(false)
  const [weekStart, setWeekStart] = useState(getNextMonday())

  async function handleGenerate() {
    const date = new Date(weekStart)
    const plan = await generatePlan.mutateAsync(date)
    setOpen(false)
    router.push(`/meal-plan/${plan.id}`)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90">
        <Sparkles className="h-4 w-4" />
        Generate Meal Plan
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Meal Plan</DialogTitle>
          <DialogDescription>
            AI will create a full week of personalized meals based on your dietary profile.
            This may take 15-30 seconds.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="weekStart">Week starting</Label>
          <Input
            id="weekStart"
            type="date"
            value={weekStart}
            onChange={(e) => setWeekStart(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleGenerate} disabled={generatePlan.isPending}>
            {generatePlan.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
