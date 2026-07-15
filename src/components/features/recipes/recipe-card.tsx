'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Users, UtensilsCrossed } from 'lucide-react'
import type { RecipeSummary } from '@/types'

interface RecipeCardProps {
  recipe: RecipeSummary
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link href={`/recipes/${recipe.id}`}>
      <Card className="group h-full transition-shadow hover:shadow-md">
        <div className="aspect-video bg-muted flex items-center justify-center rounded-t-lg">
          {recipe.imageUrl ? (
            <img src={recipe.imageUrl} alt={recipe.title} className="h-full w-full rounded-t-lg object-cover" />
          ) : (
            <UtensilsCrossed className="h-10 w-10 text-muted-foreground/40" />
          )}
        </div>
        <CardContent className="p-4 space-y-2">
          <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
            {recipe.title}
          </h3>
          {recipe.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{recipe.description}</p>
          )}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> {recipe.totalTimeMinutes} min
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" /> {recipe.baseServings}
            </span>
            <Badge variant="outline" className="text-xs">{recipe.difficulty.toLowerCase()}</Badge>
          </div>
          {recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {recipe.tags.slice(0, 3).map((tag) => (
                <Badge key={tag.id} variant="secondary" className="text-xs">{tag.tagName}</Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
