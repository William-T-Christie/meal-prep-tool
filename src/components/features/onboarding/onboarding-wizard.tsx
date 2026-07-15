'use client'

import { useReducer, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { OnboardingData } from '@/lib/validators/profile'
import { StepBasics } from './step-basics'
import { StepDietary } from './step-dietary'
import { StepAllergies } from './step-allergies'
import { StepCuisines } from './step-cuisines'
import { StepTimeEquipment } from './step-time-equipment'
import { StepMacros } from './step-macros'
import { StepReview } from './step-review'
import { OnboardingProgress } from './onboarding-progress'
import { OnboardingNav } from './onboarding-nav'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'

const STEPS = [
  'Basics',
  'Dietary',
  'Allergies',
  'Cuisines',
  'Time & Equipment',
  'Nutrition Goals',
  'Review',
] as const

type Action =
  | { type: 'SET_PROFILE'; payload: OnboardingData['profile'] }
  | { type: 'SET_DIETARY'; payload: OnboardingData['dietaryRestrictions'] }
  | { type: 'SET_ALLERGIES'; payload: OnboardingData['allergies'] }
  | { type: 'SET_CUISINES'; payload: OnboardingData['cuisinePreferences'] }
  | { type: 'SET_COOKING'; payload: OnboardingData['cookingPreferences'] }
  | { type: 'SET_EQUIPMENT'; payload: OnboardingData['kitchenEquipment'] }
  | { type: 'SET_MACROS'; payload: OnboardingData['macroGoals'] }

const initialState: OnboardingData = {
  profile: { cookingSkill: 'BEGINNER', householdSize: 1, budgetWeekly: undefined },
  dietaryRestrictions: [],
  allergies: [],
  cuisinePreferences: [],
  cookingPreferences: [],
  kitchenEquipment: [],
  macroGoals: [],
}

function reducer(state: OnboardingData, action: Action): OnboardingData {
  switch (action.type) {
    case 'SET_PROFILE':
      return { ...state, profile: action.payload }
    case 'SET_DIETARY':
      return { ...state, dietaryRestrictions: action.payload }
    case 'SET_ALLERGIES':
      return { ...state, allergies: action.payload }
    case 'SET_CUISINES':
      return { ...state, cuisinePreferences: action.payload }
    case 'SET_COOKING':
      return { ...state, cookingPreferences: action.payload }
    case 'SET_EQUIPMENT':
      return { ...state, kitchenEquipment: action.payload }
    case 'SET_MACROS':
      return { ...state, macroGoals: action.payload }
  }
}

export function OnboardingWizard() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [data, dispatch] = useReducer(reducer, initialState)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const canGoBack = step > 0
  const canGoNext = step < STEPS.length - 1
  const isReview = step === STEPS.length - 1

  async function handleSubmit() {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error ?? 'Failed to save')
      }
      toast.success('Profile setup complete!')
      router.push('/dashboard')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-2xl">
      <OnboardingProgress currentStep={step} steps={STEPS} />

      <Card className="mt-6">
        <CardContent className="pt-6">
          {step === 0 && (
            <StepBasics
              data={data.profile}
              onChange={(profile) => dispatch({ type: 'SET_PROFILE', payload: profile })}
            />
          )}
          {step === 1 && (
            <StepDietary
              data={data.dietaryRestrictions}
              onChange={(dietary) => dispatch({ type: 'SET_DIETARY', payload: dietary })}
            />
          )}
          {step === 2 && (
            <StepAllergies
              data={data.allergies}
              onChange={(allergies) => dispatch({ type: 'SET_ALLERGIES', payload: allergies })}
            />
          )}
          {step === 3 && (
            <StepCuisines
              data={data.cuisinePreferences}
              onChange={(cuisines) => dispatch({ type: 'SET_CUISINES', payload: cuisines })}
            />
          )}
          {step === 4 && (
            <StepTimeEquipment
              cookingData={data.cookingPreferences}
              equipmentData={data.kitchenEquipment}
              onCookingChange={(cooking) => dispatch({ type: 'SET_COOKING', payload: cooking })}
              onEquipmentChange={(equipment) => dispatch({ type: 'SET_EQUIPMENT', payload: equipment })}
            />
          )}
          {step === 5 && (
            <StepMacros
              data={data.macroGoals}
              onChange={(macros) => dispatch({ type: 'SET_MACROS', payload: macros })}
            />
          )}
          {step === 6 && <StepReview data={data} />}
        </CardContent>
      </Card>

      <OnboardingNav
        canGoBack={canGoBack}
        canGoNext={canGoNext}
        isReview={isReview}
        isSubmitting={isSubmitting}
        onBack={() => setStep((s) => s - 1)}
        onNext={() => setStep((s) => s + 1)}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
