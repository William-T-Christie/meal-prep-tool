'use client'

import { useState } from 'react'
import { ShoppingListItemRow } from './shopping-list-item'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, ChevronRight } from 'lucide-react'
import type { ShoppingListCategory as CategoryType } from '@/types'

interface ShoppingListCategoryProps {
  category: CategoryType
  checkedItems: Set<string>
  onToggle: (id: string) => void
}

export function ShoppingListCategory({ category, checkedItems, onToggle }: ShoppingListCategoryProps) {
  const [expanded, setExpanded] = useState(true)
  const checkedCount = category.items.filter((i) => checkedItems.has(i.id)).length

  return (
    <div className="border-b last:border-b-0">
      <button
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        aria-label={`Toggle ${category.label} category`}
        className="flex w-full items-center gap-2 px-4 py-3 text-left hover:bg-muted/50 transition-colors"
      >
        {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        <span className="font-medium text-sm flex-1">{category.label}</span>
        <Badge variant="secondary" className="text-xs">
          {checkedCount}/{category.items.length}
        </Badge>
      </button>
      {expanded && (
        <div className="px-4 pb-3 pl-10">
          {category.items.map((item) => (
            <ShoppingListItemRow
              key={item.id}
              item={item}
              checked={checkedItems.has(item.id)}
              onToggle={() => onToggle(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
