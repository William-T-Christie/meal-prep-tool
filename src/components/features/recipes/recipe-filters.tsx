'use client'

import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DIFFICULTY_LEVELS, SORT_OPTIONS } from '@/lib/constants/recipe'
import { CUISINES } from '@/lib/constants/onboarding'
import { Search } from 'lucide-react'

interface RecipeFiltersProps {
  search: string
  cuisineType: string
  difficulty: string
  maxTotalTime: string
  sortBy: string
  onSearchChange: (value: string) => void
  onCuisineChange: (value: string | null) => void
  onDifficultyChange: (value: string | null) => void
  onMaxTimeChange: (value: string) => void
  onSortChange: (value: string | null) => void
}

export function RecipeFilters({
  search, cuisineType, difficulty, maxTotalTime, sortBy,
  onSearchChange, onCuisineChange, onDifficultyChange, onMaxTimeChange, onSortChange,
}: RecipeFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search recipes..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <Select value={cuisineType} onValueChange={onCuisineChange}>
        <SelectTrigger className="w-[150px]"><SelectValue placeholder="Cuisine" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Cuisines</SelectItem>
          {CUISINES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={difficulty} onValueChange={onDifficultyChange}>
        <SelectTrigger className="w-[130px]"><SelectValue placeholder="Difficulty" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {DIFFICULTY_LEVELS.map((d) => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
        </SelectContent>
      </Select>
      <Input
        type="number"
        placeholder="Max min"
        value={maxTotalTime}
        onChange={(e) => onMaxTimeChange(e.target.value)}
        className="w-[100px]"
      />
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  )
}
