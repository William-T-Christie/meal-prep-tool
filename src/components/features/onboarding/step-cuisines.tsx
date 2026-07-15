'use client'

import type { OnboardingData } from '@/lib/validators/profile'
import { CUISINES, CUISINE_PREFERENCE_LEVELS } from '@/lib/constants/onboarding'
import { cn } from '@/lib/utils'

interface StepCuisinesProps {
  data: OnboardingData['cuisinePreferences']
  onChange: (data: OnboardingData['cuisinePreferences']) => void
}

export function StepCuisines({ data, onChange }: StepCuisinesProps) {
  const prefMap = new Map(data.map((c) => [c.cuisine, c.preference]))

  function setPreference(cuisine: string, preference: OnboardingData['cuisinePreferences'][number]['preference']) {
    const current = prefMap.get(cuisine)
    if (current === preference) {
      onChange(data.filter((c) => c.cuisine !== cuisine))
    } else {
      const filtered = data.filter((c) => c.cuisine !== cuisine)
      onChange([...filtered, { cuisine, preference }])
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Cuisine Preferences</h2>
        <p className="text-sm text-muted-foreground">
          Rate the cuisines you enjoy. Unrated cuisines will be treated as neutral.
        </p>
      </div>

      <div className="space-y-3">
        {CUISINES.map((cuisine) => (
          <div key={cuisine} className="flex items-center justify-between rounded-md border p-3">
            <span className="text-sm font-medium">{cuisine}</span>
            <div className="flex gap-1">
              {CUISINE_PREFERENCE_LEVELS.map((level) => (
                <button
                  key={level.value}
                  onClick={() => setPreference(cuisine, level.value as OnboardingData['cuisinePreferences'][number]['preference'])}
                  className={cn(
                    'rounded-md px-2 py-1 text-xs transition-colors',
                    prefMap.get(cuisine) === level.value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  )}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
