'use client'

import { useState } from 'react'
import type { OnboardingData } from '@/lib/validators/profile'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { COMMON_ALLERGENS } from '@/lib/constants/onboarding'
import { X, Plus } from 'lucide-react'

interface StepAllergiesProps {
  data: OnboardingData['allergies']
  onChange: (data: OnboardingData['allergies']) => void
}

export function StepAllergies({ data, onChange }: StepAllergiesProps) {
  const [customAllergen, setCustomAllergen] = useState('')
  const selectedNames = new Set(data.map((a) => a.name))

  function toggleAllergen(name: string) {
    if (selectedNames.has(name)) {
      onChange(data.filter((a) => a.name !== name))
    } else {
      onChange([...data, { name, severity: 'STRICT' }])
    }
  }

  function addCustom() {
    const trimmed = customAllergen.trim()
    if (trimmed && !selectedNames.has(trimmed)) {
      onChange([...data, { name: trimmed, severity: 'STRICT' }])
      setCustomAllergen('')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Allergies</h2>
        <p className="text-sm text-muted-foreground">
          Select common allergens or add your own. Skip if you have no allergies.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {COMMON_ALLERGENS.map((allergen) => (
          <Badge
            key={allergen}
            variant={selectedNames.has(allergen) ? 'default' : 'outline'}
            className="cursor-pointer select-none"
            onClick={() => toggleAllergen(allergen)}
          >
            {allergen}
            {selectedNames.has(allergen) && <X className="ml-1 h-3 w-3" />}
          </Badge>
        ))}
      </div>

      <div className="space-y-2">
        <Label>Add a custom allergen</Label>
        <div className="flex gap-2">
          <Input
            placeholder="e.g., Corn"
            value={customAllergen}
            onChange={(e) => setCustomAllergen(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addCustom()
              }
            }}
            className="max-w-[200px]"
          />
          <Button variant="outline" size="icon" onClick={addCustom}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {data.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Selected allergies:</Label>
          <div className="flex flex-wrap gap-2">
            {data.map((a) => (
              <Badge key={a.name} variant="secondary" className="gap-1">
                {a.name}
                <button onClick={() => toggleAllergen(a.name)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
