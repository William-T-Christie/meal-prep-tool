'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import type { ShoppingListItem } from '@/types'

interface ShoppingListItemRowProps {
  item: ShoppingListItem
  checked: boolean
  onToggle: () => void
}

export function ShoppingListItemRow({ item, checked, onToggle }: ShoppingListItemRowProps) {
  return (
    <div className="flex items-start gap-3 py-2">
      <Checkbox
        id={`shop-${item.id}`}
        checked={checked}
        onCheckedChange={onToggle}
        className="mt-0.5"
      />
      <label
        htmlFor={`shop-${item.id}`}
        className={cn(
          'flex-1 cursor-pointer text-sm leading-relaxed',
          checked && 'line-through text-muted-foreground'
        )}
      >
        {item.displayQuantity && (
          <span className="font-medium">{item.displayQuantity}</span>
        )}{' '}
        {item.unit && <span>{item.unit}</span>}{' '}
        <span>{item.name}</span>
        {item.notes.length > 0 && (
          <span className="text-muted-foreground"> ({item.notes.join(', ')})</span>
        )}
      </label>
      {item.recipeNames.length > 0 && (
        <span className="hidden text-xs text-muted-foreground sm:block">
          {item.recipeNames.length > 1
            ? `${item.recipeNames.length} recipes`
            : item.recipeNames[0]}
        </span>
      )}
    </div>
  )
}
