'use client'

import type { OnboardingData } from '@/lib/validators/profile'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface StepBasicsProps {
  data: OnboardingData['profile']
  onChange: (data: OnboardingData['profile']) => void
}

export function StepBasics({ data, onChange }: StepBasicsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Welcome! Let's get to know you</h2>
        <p className="text-sm text-muted-foreground">
          Tell us about your cooking experience and household.
        </p>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Cooking Skill Level</Label>
        <RadioGroup
          value={data.cookingSkill}
          onValueChange={(value) =>
            onChange({ ...data, cookingSkill: value as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' })
          }
          className="flex flex-col gap-2"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="BEGINNER" id="beginner" />
            <Label htmlFor="beginner" className="cursor-pointer">
              Beginner — I'm learning the basics
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="INTERMEDIATE" id="intermediate" />
            <Label htmlFor="intermediate" className="cursor-pointer">
              Intermediate — I can follow most recipes
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="ADVANCED" id="advanced" />
            <Label htmlFor="advanced" className="cursor-pointer">
              Advanced — I'm comfortable improvising
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="householdSize">Household Size</Label>
        <Input
          id="householdSize"
          type="number"
          min={1}
          max={20}
          value={data.householdSize}
          onChange={(e) =>
            onChange({ ...data, householdSize: Math.max(1, parseInt(e.target.value) || 1) })
          }
          className="max-w-[120px]"
        />
        <p className="text-xs text-muted-foreground">
          How many people are you cooking for?
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="budget">Weekly Grocery Budget (optional)</Label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">$</span>
          <Input
            id="budget"
            type="number"
            min={0}
            step={10}
            placeholder="e.g., 150"
            value={data.budgetWeekly ?? ''}
            onChange={(e) => {
              const val = e.target.value
              onChange({ ...data, budgetWeekly: val ? parseFloat(val) : undefined })
            }}
            className="max-w-[160px]"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Leave blank if you don't have a specific budget.
        </p>
      </div>
    </div>
  )
}
