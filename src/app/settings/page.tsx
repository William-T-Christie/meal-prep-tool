'use client'

import { useState } from 'react'
import { useUserProfile } from '@/lib/hooks/use-user-profile'
import { useQueryClient } from '@tanstack/react-query'
import { AppShell } from '@/components/features/layout/app-shell'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { Loader2, Save } from 'lucide-react'

import { StepBasics } from '@/components/features/onboarding/step-basics'
import { StepDietary } from '@/components/features/onboarding/step-dietary'
import { StepAllergies } from '@/components/features/onboarding/step-allergies'
import { StepCuisines } from '@/components/features/onboarding/step-cuisines'
import { StepTimeEquipment } from '@/components/features/onboarding/step-time-equipment'
import { StepMacros } from '@/components/features/onboarding/step-macros'
import type { OnboardingData } from '@/lib/validators/profile'

export default function SettingsPage() {
  const { data, isLoading } = useUserProfile()
  const queryClient = useQueryClient()
  const [saving, setSaving] = useState<string | null>(null)

  const [profile, setProfile] = useState<OnboardingData['profile']>({
    cookingSkill: 'BEGINNER',
    householdSize: 1,
    budgetWeekly: undefined,
  })
  const [dietary, setDietary] = useState<OnboardingData['dietaryRestrictions']>([])
  const [allergies, setAllergies] = useState<OnboardingData['allergies']>([])
  const [cuisines, setCuisines] = useState<OnboardingData['cuisinePreferences']>([])
  const [cooking, setCooking] = useState<OnboardingData['cookingPreferences']>([])
  const [equipment, setEquipment] = useState<OnboardingData['kitchenEquipment']>([])
  const [macros, setMacros] = useState<OnboardingData['macroGoals']>([])
  const [initialized, setInitialized] = useState(false)

  // Initialize state from fetched data once
  if (data && !initialized) {
    if (data.profile) {
      setProfile({
        cookingSkill: data.profile.cookingSkill,
        householdSize: data.profile.householdSize,
        budgetWeekly: data.profile.budgetWeekly ?? undefined,
      })
    }
    setDietary(data.dietaryRestrictions.map((d) => ({ type: d.type })))
    setAllergies(data.allergies.map((a) => ({ name: a.name, severity: a.severity })))
    setCuisines(data.cuisinePreferences.map((c) => ({ cuisine: c.cuisine, preference: c.preference })))
    setCooking(data.cookingPreferences.map((c) => ({ mealType: c.mealType, maxTimeMinutes: c.maxTimeMinutes })))
    setEquipment(data.kitchenEquipment.map((e) => ({ equipmentName: e.equipmentName })))
    setMacros(data.macroGoals.map((m) => ({
      mealType: m.mealType,
      calories: m.calories,
      proteinG: m.proteinG,
      carbsG: m.carbsG,
      fatG: m.fatG,
    })))
    setInitialized(true)
  }

  async function saveSection(endpoint: string, body: unknown, label: string) {
    setSaving(label)
    try {
      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Failed to save')
      await queryClient.invalidateQueries({ queryKey: ['user-profile'] })
      toast.success(`${label} saved!`)
    } catch {
      toast.error(`Failed to save ${label.toLowerCase()}`)
    } finally {
      setSaving(null)
    }
  }

  if (isLoading) {
    return (
      <AppShell>
        <div className="space-y-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-64 w-full" />
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your preferences and dietary profile.</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="dietary">Dietary</TabsTrigger>
            <TabsTrigger value="allergies">Allergies</TabsTrigger>
            <TabsTrigger value="cuisines">Cuisines</TabsTrigger>
            <TabsTrigger value="time">Time</TabsTrigger>
            <TabsTrigger value="macros">Macros</TabsTrigger>
            <TabsTrigger value="equipment">Equipment</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <SettingsCard
              title="Profile"
              description="Your cooking skill, household size, and budget."
              saving={saving === 'Profile'}
              onSave={() => saveSection('/api/user/profile', profile, 'Profile')}
            >
              <StepBasics data={profile} onChange={setProfile} />
            </SettingsCard>
          </TabsContent>

          <TabsContent value="dietary">
            <SettingsCard
              title="Dietary Restrictions"
              description="Select any dietary restrictions that apply."
              saving={saving === 'Dietary restrictions'}
              onSave={() => saveSection('/api/user/preferences/dietary', dietary, 'Dietary restrictions')}
            >
              <StepDietary data={dietary} onChange={setDietary} />
            </SettingsCard>
          </TabsContent>

          <TabsContent value="allergies">
            <SettingsCard
              title="Allergies"
              description="Manage your food allergies."
              saving={saving === 'Allergies'}
              onSave={() => saveSection('/api/user/preferences/allergies', allergies, 'Allergies')}
            >
              <StepAllergies data={allergies} onChange={setAllergies} />
            </SettingsCard>
          </TabsContent>

          <TabsContent value="cuisines">
            <SettingsCard
              title="Cuisine Preferences"
              description="Rate the cuisines you enjoy."
              saving={saving === 'Cuisine preferences'}
              onSave={() => saveSection('/api/user/preferences/cuisines', cuisines, 'Cuisine preferences')}
            >
              <StepCuisines data={cuisines} onChange={setCuisines} />
            </SettingsCard>
          </TabsContent>

          <TabsContent value="time">
            <SettingsCard
              title="Time & Equipment"
              description="Cooking time limits and kitchen equipment."
              saving={saving === 'Cooking preferences'}
              onSave={async () => {
                await saveSection('/api/user/preferences/cooking', cooking, 'Cooking preferences')
                await saveSection('/api/user/preferences/equipment', equipment, 'Equipment')
              }}
            >
              <StepTimeEquipment
                cookingData={cooking}
                equipmentData={equipment}
                onCookingChange={setCooking}
                onEquipmentChange={setEquipment}
              />
            </SettingsCard>
          </TabsContent>

          <TabsContent value="macros">
            <SettingsCard
              title="Nutrition Goals"
              description="Set macro targets per meal."
              saving={saving === 'Nutrition goals'}
              onSave={() => saveSection('/api/user/preferences/macros', macros, 'Nutrition goals')}
            >
              <StepMacros data={macros} onChange={setMacros} />
            </SettingsCard>
          </TabsContent>

          <TabsContent value="equipment">
            <SettingsCard
              title="Kitchen Equipment"
              description="Select the equipment you have available."
              saving={saving === 'Equipment'}
              onSave={() => saveSection('/api/user/preferences/equipment', equipment, 'Equipment')}
            >
              <StepTimeEquipment
                cookingData={cooking}
                equipmentData={equipment}
                onCookingChange={setCooking}
                onEquipmentChange={setEquipment}
              />
            </SettingsCard>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  )
}

function SettingsCard({
  title,
  description,
  saving,
  onSave,
  children,
}: {
  title: string
  description: string
  saving: boolean
  onSave: () => void
  children: React.ReactNode
}) {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
        <div className="flex justify-end pt-4">
          <Button onClick={onSave} disabled={saving}>
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
