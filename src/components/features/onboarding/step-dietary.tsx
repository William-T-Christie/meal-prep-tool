'use client'

import type { OnboardingData } from '@/lib/validators/profile'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { DIETARY_TYPES } from '@/lib/constants/onboarding'

interface StepDietaryProps {
  data: OnboardingData['dietaryRestrictions']
  onChange: (data: OnboardingData['dietaryRestrictions']) => void
}

export function StepDietary({ data, onChange }: StepDietaryProps) {
  const selectedTypes = new Set(data.map((d) => d.type))

  function toggle(type: OnboardingData['dietaryRestrictions'][number]['type']) {
    if (selectedTypes.has(type)) {
      onChange(data.filter((d) => d.type !== type))
    } else {
      onChange([...data, { type }])
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Dietary Restrictions</h2>
        <p className="text-sm text-muted-foreground">
          Select any dietary restrictions that apply. Skip if none.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {DIETARY_TYPES.map((diet) => (
          <div key={diet.value} className="flex items-center gap-2">
            <Checkbox
              id={diet.value}
              checked={selectedTypes.has(diet.value)}
              onCheckedChange={() => toggle(diet.value as OnboardingData['dietaryRestrictions'][number]['type'])}
            />
            <Label htmlFor={diet.value} className="cursor-pointer text-sm">
              {diet.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  )
}
