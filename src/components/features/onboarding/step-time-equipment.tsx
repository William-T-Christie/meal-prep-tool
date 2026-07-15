'use client'

import type { OnboardingData } from '@/lib/validators/profile'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { MEAL_TYPES, KITCHEN_EQUIPMENT } from '@/lib/constants/onboarding'

interface StepTimeEquipmentProps {
  cookingData: OnboardingData['cookingPreferences']
  equipmentData: OnboardingData['kitchenEquipment']
  onCookingChange: (data: OnboardingData['cookingPreferences']) => void
  onEquipmentChange: (data: OnboardingData['kitchenEquipment']) => void
}

export function StepTimeEquipment({
  cookingData,
  equipmentData,
  onCookingChange,
  onEquipmentChange,
}: StepTimeEquipmentProps) {
  const cookingMap = new Map(cookingData.map((c) => [c.mealType, c.maxTimeMinutes]))
  const equipmentSet = new Set(equipmentData.map((e) => e.equipmentName))

  type MealTypeValue = OnboardingData['cookingPreferences'][number]['mealType']

  function setTime(mealType: MealTypeValue, minutes: number) {
    const filtered = cookingData.filter((c) => c.mealType !== mealType)
    if (minutes > 0) {
      onCookingChange([...filtered, { mealType, maxTimeMinutes: minutes }])
    } else {
      onCookingChange(filtered)
    }
  }

  function toggleEquipment(name: string) {
    if (equipmentSet.has(name)) {
      onEquipmentChange(equipmentData.filter((e) => e.equipmentName !== name))
    } else {
      onEquipmentChange([...equipmentData, { equipmentName: name }])
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Time Constraints & Equipment</h2>
        <p className="text-sm text-muted-foreground">
          Set max cooking time per meal and select your kitchen equipment.
        </p>
      </div>

      <div className="space-y-4">
        <Label className="text-sm font-medium">Max cooking time per meal (minutes)</Label>
        {MEAL_TYPES.map((meal) => (
          <div key={meal.value} className="flex items-center gap-4">
            <span className="w-24 text-sm">{meal.label}</span>
            <Input
              type="number"
              min={5}
              max={480}
              step={5}
              placeholder="30"
              value={cookingMap.get(meal.value) ?? ''}
              onChange={(e) => {
                const val = parseInt(e.target.value)
                setTime(meal.value as MealTypeValue, isNaN(val) ? 0 : val)
              }}
              className="max-w-[100px]"
            />
            <span className="text-xs text-muted-foreground">min</span>
          </div>
        ))}
      </div>

      <Separator />

      <div className="space-y-3">
        <Label className="text-sm font-medium">Kitchen Equipment</Label>
        <p className="text-xs text-muted-foreground">
          Select the equipment you have. This helps us suggest appropriate recipes.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {KITCHEN_EQUIPMENT.map((item) => (
            <div key={item} className="flex items-center gap-2">
              <Checkbox
                id={`equip-${item}`}
                checked={equipmentSet.has(item)}
                onCheckedChange={() => toggleEquipment(item)}
              />
              <Label htmlFor={`equip-${item}`} className="cursor-pointer text-sm">
                {item}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
