'use client'

import type { OnboardingData } from '@/lib/validators/profile'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { MEAL_TYPES, MACRO_PRESETS } from '@/lib/constants/onboarding'

interface StepMacrosProps {
  data: OnboardingData['macroGoals']
  onChange: (data: OnboardingData['macroGoals']) => void
}

type MealTypeValue = OnboardingData['macroGoals'][number]['mealType']

export function StepMacros({ data, onChange }: StepMacrosProps) {
  const macroMap = new Map(data.map((m) => [m.mealType, m]))

  function setMacro(mealType: MealTypeValue, field: string, value: number) {
    const existing = macroMap.get(mealType) ?? {
      mealType,
      calories: 0,
      proteinG: 0,
      carbsG: 0,
      fatG: 0,
    }
    const updated = { ...existing, [field]: value }
    const filtered = data.filter((m) => m.mealType !== mealType)
    onChange([...filtered, updated])
  }

  function applyPreset(preset: keyof typeof MACRO_PRESETS) {
    const values = MACRO_PRESETS[preset]
    // Distribute across meals: 25% breakfast, 35% lunch, 35% dinner, 5% snack
    const splits = {
      BREAKFAST: 0.25,
      LUNCH: 0.35,
      DINNER: 0.35,
      SNACK: 0.05,
    }

    const newGoals = Object.entries(splits).map(([mealType, ratio]) => ({
      mealType: mealType as MealTypeValue,
      calories: Math.round(values.calories * ratio),
      proteinG: Math.round(values.proteinG * ratio),
      carbsG: Math.round(values.carbsG * ratio),
      fatG: Math.round(values.fatG * ratio),
    }))

    onChange(newGoals)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Nutrition Goals</h2>
        <p className="text-sm text-muted-foreground">
          Set macro targets per meal, or use a preset. These are optional.
        </p>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Quick presets (daily totals)</Label>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(MACRO_PRESETS) as Array<keyof typeof MACRO_PRESETS>).map((key) => (
            <Button
              key={key}
              variant="outline"
              size="sm"
              onClick={() => applyPreset(key)}
            >
              {key.charAt(0) + key.slice(1).toLowerCase()} ({MACRO_PRESETS[key].calories} cal)
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-6">
        {MEAL_TYPES.map((meal) => {
          const current = macroMap.get(meal.value)
          return (
            <div key={meal.value} className="space-y-2">
              <Label className="text-sm font-medium">{meal.label}</Label>
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <Label className="text-xs text-muted-foreground">Calories</Label>
                  <Input
                    type="number"
                    min={0}
                    placeholder="0"
                    value={current?.calories ?? ''}
                    onChange={(e) =>
                      setMacro(meal.value as MealTypeValue, 'calories', parseInt(e.target.value) || 0)
                    }
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Protein (g)</Label>
                  <Input
                    type="number"
                    min={0}
                    placeholder="0"
                    value={current?.proteinG ?? ''}
                    onChange={(e) =>
                      setMacro(meal.value as MealTypeValue, 'proteinG', parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Carbs (g)</Label>
                  <Input
                    type="number"
                    min={0}
                    placeholder="0"
                    value={current?.carbsG ?? ''}
                    onChange={(e) =>
                      setMacro(meal.value as MealTypeValue, 'carbsG', parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Fat (g)</Label>
                  <Input
                    type="number"
                    min={0}
                    placeholder="0"
                    value={current?.fatG ?? ''}
                    onChange={(e) =>
                      setMacro(meal.value as MealTypeValue, 'fatG', parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
