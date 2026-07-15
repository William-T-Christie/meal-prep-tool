'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Trash2, Loader2 } from 'lucide-react'

interface MealPlanDeleteDialogProps {
  planTitle: string
  onConfirm: () => Promise<void>
}

export function MealPlanDeleteDialog({ planTitle, onConfirm }: MealPlanDeleteDialogProps) {
  const [open, setOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    try {
      await onConfirm()
      setOpen(false)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-3 py-1 text-sm font-medium text-destructive ring-offset-background transition-colors hover:bg-accent hover:text-destructive">
        <Trash2 className="h-4 w-4" /> Delete
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Meal Plan</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &ldquo;{planTitle}&rdquo;? The generated recipes will remain in your library.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
            {deleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
