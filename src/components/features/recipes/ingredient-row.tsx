'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X } from 'lucide-react'
import { COMMON_UNITS } from '@/lib/constants/recipe'
import type { RecipeIngredientInput } from '@/lib/validators/recipe'

interface IngredientRowProps {
  ingredient: RecipeIngredientInput
  onChange: (ingredient: RecipeIngredientInput) => void
  onRemove: () => void
  canRemove: boolean
}

export function IngredientRow({ ingredient, onChange, onRemove, canRemove }: IngredientRowProps) {
  return (
    <div className="flex items-start gap-2">
      <Input
        type="number"
        placeholder="Qty"
        value={ingredient.quantity ?? ''}
        onChange={(e) => {
          const val = e.target.value
          onChange({ ...ingredient, quantity: val ? parseFloat(val) : null })
        }}
        className="w-20"
      />
      <Select
        value={ingredient.unit ?? ''}
        onValueChange={(value) => onChange({ ...ingredient, unit: value || null })}
      >
        <SelectTrigger className="w-24">
          <SelectValue placeholder="Unit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">None</SelectItem>
          {COMMON_UNITS.map((unit) => (
            <SelectItem key={unit} value={unit}>{unit}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        placeholder="Ingredient name *"
        value={ingredient.name}
        onChange={(e) => onChange({ ...ingredient, name: e.target.value })}
        className="flex-1"
      />
      <Input
        placeholder="Notes"
        value={ingredient.notes ?? ''}
        onChange={(e) => onChange({ ...ingredient, notes: e.target.value || null })}
        className="w-32 hidden sm:block"
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={onRemove}
        disabled={!canRemove}
        className="shrink-0"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}
