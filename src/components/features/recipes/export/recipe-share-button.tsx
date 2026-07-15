'use client'

import { Button } from '@/components/ui/button'
import { Share2 } from 'lucide-react'
import { toast } from 'sonner'

interface RecipeShareButtonProps {
  recipeId: string
}

export function RecipeShareButton({ recipeId }: RecipeShareButtonProps) {
  async function handleShare() {
    const url = `${window.location.origin}/recipes/${recipeId}`
    try {
      await navigator.clipboard.writeText(url)
      toast.success('Link copied to clipboard!')
    } catch {
      toast.error('Failed to copy link')
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleShare}>
      <Share2 className="mr-2 h-4 w-4" />
      Share
    </Button>
  )
}
