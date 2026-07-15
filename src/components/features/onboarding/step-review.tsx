'use client'

import type { OnboardingData } from '@/lib/validators/profile'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface StepReviewProps {
  data: OnboardingData
}

export function StepReview({ data }: StepReviewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Review Your Profile</h2>
        <p className="text-sm text-muted-foreground">
          Make sure everything looks good before completing setup.
        </p>
      </div>

      <Section title="Basics">
        <Item label="Cooking Skill" value={data.profile.cookingSkill.toLowerCase()} />
        <Item label="Household Size" value={String(data.profile.householdSize)} />
        <Item
          label="Weekly Budget"
          value={data.profile.budgetWeekly ? `$${data.profile.budgetWeekly}` : 'Not set'}
        />
      </Section>

      <Separator />

      <Section title="Dietary Restrictions">
        {data.dietaryRestrictions.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {data.dietaryRestrictions.map((d) => (
              <Badge key={d.type} variant="secondary">
                {d.type.replace(/_/g, ' ').toLowerCase()}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">None</p>
        )}
      </Section>

      <Separator />

      <Section title="Allergies">
        {data.allergies.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {data.allergies.map((a) => (
              <Badge key={a.name} variant="destructive">
                {a.name}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">None</p>
        )}
      </Section>

      <Separator />

      <Section title="Cuisine Preferences">
        {data.cuisinePreferences.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {data.cuisinePreferences.map((c) => (
              <Badge key={c.cuisine} variant="outline">
                {c.cuisine}: {c.preference.toLowerCase()}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No preferences set</p>
        )}
      </Section>

      <Separator />

      <Section title="Cooking Time">
        {data.cookingPreferences.length > 0 ? (
          <div className="space-y-1">
            {data.cookingPreferences.map((c) => (
              <Item
                key={c.mealType}
                label={c.mealType.toLowerCase()}
                value={`${c.maxTimeMinutes} min`}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No time limits set</p>
        )}
      </Section>

      <Separator />

      <Section title="Kitchen Equipment">
        {data.kitchenEquipment.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {data.kitchenEquipment.map((e) => (
              <Badge key={e.equipmentName} variant="outline">
                {e.equipmentName}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">None selected</p>
        )}
      </Section>

      <Separator />

      <Section title="Nutrition Goals">
        {data.macroGoals.length > 0 ? (
          <div className="space-y-1">
            {data.macroGoals.map((m) => (
              <Item
                key={m.mealType}
                label={m.mealType.toLowerCase()}
                value={`${m.calories} cal | ${m.proteinG}g P | ${m.carbsG}g C | ${m.fatG}g F`}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No goals set</p>
        )}
      </Section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">{title}</h3>
      {children}
    </div>
  )
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="capitalize text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>
  )
}
