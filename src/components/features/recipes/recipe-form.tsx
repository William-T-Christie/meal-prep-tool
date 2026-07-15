'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Plus, Loader2, Save, X } from 'lucide-react'
import { IngredientRow } from './ingredient-row'
import { InstructionRow } from './instruction-row'
import { DIFFICULTY_LEVELS, COMMON_TAGS } from '@/lib/constants/recipe'
import { CUISINES } from '@/lib/constants/onboarding'
import type { CreateRecipeInput, RecipeIngredientInput, RecipeInstructionInput } from '@/lib/validators/recipe'
import type { RecipeDetail } from '@/types'

interface RecipeFormProps {
  initialData?: RecipeDetail
  onSubmit: (data: CreateRecipeInput) => Promise<void>
  isSubmitting: boolean
}

const emptyIngredient = (orderIndex: number): RecipeIngredientInput => ({
  quantity: null,
  unit: null,
  name: '',
  notes: null,
  orderIndex,
})

const emptyInstruction = (stepNumber: number): RecipeInstructionInput => ({
  stepNumber,
  instructionText: '',
  durationMinutes: null,
})

export function RecipeForm({ initialData, onSubmit, isSubmitting }: RecipeFormProps) {
  const router = useRouter()

  // Basic info
  const [title, setTitle] = useState(initialData?.title ?? '')
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [prepTime, setPrepTime] = useState(initialData?.prepTimeMinutes ?? 0)
  const [cookTime, setCookTime] = useState(initialData?.cookTimeMinutes ?? 0)
  const [servings, setServings] = useState(initialData?.baseServings ?? 4)
  const [difficulty, setDifficulty] = useState(initialData?.difficulty ?? 'EASY')
  const [cuisineType, setCuisineType] = useState(initialData?.cuisineType ?? '')
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl ?? '')
  const [sourceUrl, setSourceUrl] = useState(initialData?.sourceUrl ?? '')

  // Ingredients
  const [ingredients, setIngredients] = useState<RecipeIngredientInput[]>(
    initialData?.ingredients.map((i, idx) => ({
      quantity: i.quantity,
      unit: i.unit,
      name: i.name,
      notes: i.notes,
      orderIndex: idx,
    })) ?? [emptyIngredient(0)]
  )

  // Instructions
  const [instructions, setInstructions] = useState<RecipeInstructionInput[]>(
    initialData?.instructions.map((i) => ({
      stepNumber: i.stepNumber,
      instructionText: i.instructionText,
      durationMinutes: i.durationMinutes,
    })) ?? [emptyInstruction(1)]
  )

  // Tags
  const [tags, setTags] = useState<string[]>(
    initialData?.tags.map((t) => t.tagName) ?? []
  )
  const [tagInput, setTagInput] = useState('')

  // Nutrition
  const [calories, setCalories] = useState(initialData?.nutrition?.caloriesPerServing ?? 0)
  const [protein, setProtein] = useState(initialData?.nutrition?.proteinG ?? 0)
  const [carbs, setCarbs] = useState(initialData?.nutrition?.carbsG ?? 0)
  const [fat, setFat] = useState(initialData?.nutrition?.fatG ?? 0)
  const [hasNutrition, setHasNutrition] = useState(!!initialData?.nutrition)

  function addIngredient() {
    setIngredients([...ingredients, emptyIngredient(ingredients.length)])
  }

  function updateIngredient(index: number, data: RecipeIngredientInput) {
    const updated = [...ingredients]
    updated[index] = data
    setIngredients(updated)
  }

  function removeIngredient(index: number) {
    const updated = ingredients.filter((_, i) => i !== index).map((ing, i) => ({ ...ing, orderIndex: i }))
    setIngredients(updated)
  }

  function addInstruction() {
    setInstructions([...instructions, emptyInstruction(instructions.length + 1)])
  }

  function updateInstruction(index: number, data: RecipeInstructionInput) {
    const updated = [...instructions]
    updated[index] = data
    setInstructions(updated)
  }

  function removeInstruction(index: number) {
    const updated = instructions.filter((_, i) => i !== index).map((inst, i) => ({ ...inst, stepNumber: i + 1 }))
    setInstructions(updated)
  }

  function addTag(tag: string) {
    const trimmed = tag.trim()
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed])
    }
    setTagInput('')
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag))
  }

  async function handleSubmit() {
    const data: CreateRecipeInput = {
      title,
      description: description || null,
      prepTimeMinutes: prepTime,
      cookTimeMinutes: cookTime,
      baseServings: servings,
      difficulty: difficulty as 'EASY' | 'MEDIUM' | 'HARD',
      cuisineType: cuisineType || null,
      imageUrl: imageUrl || null,
      sourceUrl: sourceUrl || null,
      isAiGenerated: false,
      ingredients: ingredients.filter((i) => i.name.trim()),
      instructions: instructions.filter((i) => i.instructionText.trim()),
      tags: tags.map((t) => ({ tagName: t })),
      nutrition: hasNutrition ? { caloriesPerServing: calories, proteinG: protein, carbsG: carbs, fatG: fat } : null,
    }
    await onSubmit(data)
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="basics" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basics">Basics</TabsTrigger>
          <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
          <TabsTrigger value="instructions">Steps</TabsTrigger>
          <TabsTrigger value="tags">Tags</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
        </TabsList>

        <TabsContent value="basics">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Recipe Title *</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Chicken Stir Fry" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description..." rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="space-y-2">
                  <Label>Prep Time (min)</Label>
                  <Input type="number" min={0} value={prepTime} onChange={(e) => setPrepTime(parseInt(e.target.value) || 0)} />
                </div>
                <div className="space-y-2">
                  <Label>Cook Time (min)</Label>
                  <Input type="number" min={0} value={cookTime} onChange={(e) => setCookTime(parseInt(e.target.value) || 0)} />
                </div>
                <div className="space-y-2">
                  <Label>Servings</Label>
                  <Input type="number" min={1} value={servings} onChange={(e) => setServings(parseInt(e.target.value) || 1)} />
                </div>
                <div className="space-y-2">
                  <Label>Difficulty</Label>
                  <Select value={difficulty} onValueChange={(v) => { if (v) setDifficulty(v as typeof difficulty) }}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {DIFFICULTY_LEVELS.map((d) => (
                        <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Cuisine Type</Label>
                  <Select value={cuisineType} onValueChange={(v) => setCuisineType(v ?? '')}>
                    <SelectTrigger><SelectValue placeholder="Select cuisine" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {CUISINES.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Image URL</Label>
                  <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Source URL</Label>
                <Input value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} placeholder="Original recipe link (optional)" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ingredients">
          <Card>
            <CardHeader>
              <CardTitle>Ingredients</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {ingredients.map((ing, i) => (
                <IngredientRow
                  key={i}
                  ingredient={ing}
                  onChange={(data) => updateIngredient(i, data)}
                  onRemove={() => removeIngredient(i)}
                  canRemove={ingredients.length > 1}
                />
              ))}
              <Button variant="outline" onClick={addIngredient} className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Add Ingredient
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="instructions">
          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {instructions.map((inst, i) => (
                <InstructionRow
                  key={i}
                  instruction={inst}
                  onChange={(data) => updateInstruction(i, data)}
                  onRemove={() => removeInstruction(i)}
                  canRemove={instructions.length > 1}
                />
              ))}
              <Button variant="outline" onClick={addInstruction} className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Add Step
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tags">
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(tagInput) } }}
                  className="flex-1"
                />
                <Button variant="outline" onClick={() => addTag(tagInput)}>Add</Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button onClick={() => removeTag(tag)}><X className="h-3 w-3" /></button>
                    </Badge>
                  ))}
                </div>
              )}
              <Separator />
              <div>
                <Label className="text-sm text-muted-foreground">Suggestions</Label>
                <div className="mt-2 flex flex-wrap gap-1">
                  {COMMON_TAGS.filter((t) => !tags.includes(t)).map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => addTag(tag)}
                    >
                      + {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nutrition">
          <Card>
            <CardHeader>
              <CardTitle>Nutrition (per serving)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="hasNutrition"
                  checked={hasNutrition}
                  onChange={(e) => setHasNutrition(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="hasNutrition">Add nutrition information</Label>
              </div>
              {hasNutrition && (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="space-y-2">
                    <Label>Calories</Label>
                    <Input type="number" min={0} value={calories} onChange={(e) => setCalories(parseInt(e.target.value) || 0)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Protein (g)</Label>
                    <Input type="number" min={0} value={protein} onChange={(e) => setProtein(parseFloat(e.target.value) || 0)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Carbs (g)</Label>
                    <Input type="number" min={0} value={carbs} onChange={(e) => setCarbs(parseFloat(e.target.value) || 0)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Fat (g)</Label>
                    <Input type="number" min={0} value={fat} onChange={(e) => setFat(parseFloat(e.target.value) || 0)} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={isSubmitting || !title.trim()}>
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {initialData ? 'Update Recipe' : 'Create Recipe'}
        </Button>
      </div>
    </div>
  )
}
