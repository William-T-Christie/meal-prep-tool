'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { RecipeDetail } from '@/types'

interface CookModeState {
  recipe: RecipeDetail
  currentStep: number
  totalSteps: number
  isFirstStep: boolean
  isLastStep: boolean
  goToStep: (index: number) => void
  nextStep: () => void
  prevStep: () => void
}

const CookModeContext = createContext<CookModeState | null>(null)

export function useCookMode() {
  const ctx = useContext(CookModeContext)
  if (!ctx) throw new Error('useCookMode must be used within CookModeProvider')
  return ctx
}

interface CookModeProviderProps {
  recipe: RecipeDetail
  children: ReactNode
}

export function CookModeProvider({ recipe, children }: CookModeProviderProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const totalSteps = recipe.instructions.length

  const goToStep = useCallback((index: number) => {
    setCurrentStep(Math.max(0, Math.min(index, totalSteps - 1)))
  }, [totalSteps])

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1))
  }, [totalSteps])

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }, [])

  return (
    <CookModeContext.Provider
      value={{
        recipe,
        currentStep,
        totalSteps,
        isFirstStep: currentStep === 0,
        isLastStep: currentStep === totalSteps - 1,
        goToStep,
        nextStep,
        prevStep,
      }}
    >
      {children}
    </CookModeContext.Provider>
  )
}
