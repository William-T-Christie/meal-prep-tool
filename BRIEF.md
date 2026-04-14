# Meal Prep Tool V2 -- Project Brief

## Vision

A web application that makes weekly meal planning effortless. Users define their dietary profile once (allergies, preferences, macros, budget, time constraints), and the app generates personalized meal plans with auto-scaled recipes, consolidated shopping lists, and step-by-step cooking instructions. The guiding principle is **maximum automation, minimum friction**.

---

## Core Features

### 1. User Profile & Preferences
- Dietary restrictions and allergies (e.g., gluten-free, nut allergy, vegan)
- Cuisine preferences and disliked ingredients
- Cooking skill level (beginner / intermediate / advanced)
- Time constraints per meal (e.g., "weekday dinners under 30 min")
- Weekly grocery budget cap
- Kitchen equipment available (instant pot, air fryer, etc.)

### 2. Macro & Nutrition Goals
- Per-meal macro targets (protein, carbs, fat, calories)
- Daily totals dashboard
- Visual progress toward weekly nutrition goals
- Support for common goal templates (cut, bulk, maintenance, balanced)

### 3. Recipe Library
- Central searchable/filterable recipe store
- Save recipes from AI-generated plans or add manually
- Tag and categorize recipes
- Export recipes as PDF or shareable link
- Rate and note recipes after cooking

### 4. Dynamic Serving Adjustment
- Change serving size on any recipe
- Ingredient quantities, shopping list, and instructions all scale automatically
- Fractional-unit rounding (e.g., "1/3 cup" not "0.333 cups")

### 5. Meal Plan Generation (AI-Powered)
- Generate a full week of meals from the user profile in one click
- Swap individual meals while keeping the plan balanced
- Suggest meals that reuse overlapping ingredients to reduce waste and cost
- Respect all constraints simultaneously (macros + budget + time + allergies)

### 6. Shopping List
- Auto-generated from the active meal plan
- Consolidated across all meals (no duplicate entries)
- Grouped by store aisle / category
- Checkable list for use while shopping
- Optional: estimated cost per item and total

### 7. Cooking Mode
- Step-by-step instruction view optimized for phone/tablet in the kitchen
- Large text, minimal UI, swipe-to-advance
- Built-in timers for steps that need them

---

## Assumptions

These assumptions were made in the absence of direct user clarification. They should be revisited before development begins.

| # | Assumption | Rationale |
|---|-----------|-----------|
| A1 | Single-user app (no social/sharing features in V2) | Keeps scope manageable |
| A2 | Web app (responsive, not native mobile) | Broadest reach, fastest to build |
| A3 | AI meal plan generation uses an LLM API (Claude or OpenAI) | Required for constraint-aware plan generation |
| A4 | Nutrition data sourced from a free API (e.g., USDA FoodData Central, Edamam) | Accurate macros require a real database |
| A5 | Authentication via email/password or OAuth | Needed to persist user data |
| A6 | Hosted backend with a database | User profiles, recipes, and plans must persist across sessions |
| A7 | No payment processing in V2 | Monetization deferred |
| A8 | English-only in V2 | i18n deferred |

---

## Open Questions

These require the user's input before or during early development:

1. **Deployment target** -- Self-hosted, Vercel + managed DB, or fully cloud (AWS/GCP)?
2. **Auth provider preference** -- Clerk, NextAuth, Supabase Auth, or Firebase Auth?
3. **AI provider preference** -- Claude API, OpenAI API, or allow user to bring their own key?
4. **Nutrition API** -- USDA FoodData Central (free, US-centric), Edamam (freemium, broader), or Nutritionix?
5. **Offline support** -- Is a PWA with offline recipe viewing needed, or is online-only acceptable?
6. **Recipe import** -- Should users be able to paste a URL and have the app scrape/parse the recipe?
7. **Multi-user / household support** -- Is this needed for V2, or strictly single-user?
8. **Cost estimation source** -- Should grocery prices be estimated (static averages), or integrated with a grocery API?

---

## Technical Breakdown

### Frontend
- **Framework:** Next.js 14+ (App Router) with React 18+
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS + shadcn/ui component library
- **State management:** React Context + TanStack Query for server state
- **Key pages:**
  - Onboarding wizard (profile setup)
  - Dashboard (current meal plan, nutrition summary)
  - Recipe library (search, filter, detail view)
  - Meal plan builder (weekly grid, drag-and-drop swaps)
  - Shopping list (checkable, grouped)
  - Cooking mode (step-by-step, full-screen)
  - Settings (profile, preferences, export)

### Backend
- **Framework:** Next.js API routes (or separate Express/Fastify server if complexity grows)
- **Language:** TypeScript
- **Database:** PostgreSQL via Prisma ORM
- **Auth:** NextAuth.js (or Clerk for faster setup)
- **Key endpoints:**
  - CRUD for user profiles, preferences
  - CRUD for recipes
  - CRUD for meal plans
  - POST /generate-meal-plan (calls AI)
  - GET /nutrition-lookup (proxies to nutrition API)
  - GET /shopping-list/:planId (computed from plan)

### AI Integration
- **Purpose:** Meal plan generation, recipe suggestion, serving adjustment text
- **Approach:** Structured prompts to an LLM API with JSON-mode output
- **Key design decisions:**
  - Send user profile + constraints as system context
  - Request structured JSON (meals array with ingredients, macros, instructions)
  - Validate AI output server-side before storing
  - Cache common queries to reduce API cost
  - Fallback: if AI output fails validation, retry once then surface error to user

### Data & Storage
- **PostgreSQL tables:** users, preferences, allergies, recipes, ingredients, meal_plans, meal_plan_items, shopping_lists
- **Nutrition cache:** Store looked-up nutrition data to avoid redundant API calls
- **File storage:** Recipe images (Cloudflare R2, S3, or Supabase Storage)
- **Seed data:** Common allergens list, cuisine types, unit conversions, macro templates

---

## Build Order

### Phase 1 -- Foundation (Weeks 1-2)
1. Project scaffolding (Next.js + TypeScript + Tailwind + shadcn/ui)
2. Database schema design and Prisma setup
3. Authentication (sign up, sign in, session management)
4. User profile and preferences CRUD (onboarding wizard)

### Phase 2 -- Recipe System (Weeks 3-4)
5. Recipe data model and CRUD API
6. Recipe library UI (list, search, filter, detail view)
7. Dynamic serving size adjustment logic
8. Manual recipe creation form

### Phase 3 -- AI Meal Planning (Weeks 5-6)
9. AI integration layer (prompt engineering, structured output, validation)
10. Meal plan generation endpoint
11. Meal plan UI (weekly grid view, swap meals)
12. Nutrition API integration and macro tracking dashboard

### Phase 4 -- Shopping & Cooking (Weeks 7-8)
13. Shopping list generation from meal plan
14. Shopping list UI (grouped, checkable)
15. Cooking mode UI (step-by-step, timers)
16. Recipe export (PDF, shareable link)

### Phase 5 -- Polish (Weeks 9-10)
17. Responsive design pass (mobile-first cooking mode)
18. Error handling and loading states
19. Performance optimization (caching, lazy loading)
20. Accessibility audit and fixes
21. Testing (unit, integration, E2E)

---

## Hardest Parts

1. **AI output reliability** -- Getting an LLM to consistently produce valid, balanced meal plans that satisfy all constraints (macros + budget + time + allergies) simultaneously is non-trivial. Requires careful prompt engineering, output validation, and graceful fallback.

2. **Nutrition accuracy** -- Mapping free-text ingredient names from AI output to structured nutrition database entries is fuzzy. "chicken breast" vs "boneless skinless chicken breast" vs "chicken thigh" all have different macros.

3. **Serving size scaling** -- Scaling ingredients is easy math, but scaling cooking instructions ("bake for 25 minutes") and handling non-linear scaling (you do not double baking time when doubling a recipe) requires careful logic.

4. **Shopping list consolidation** -- Merging "1 cup diced onion" from recipe A with "1/2 onion, sliced" from recipe B into a single shopping item requires ingredient normalization.

5. **Constraint satisfaction** -- Balancing macros, budget, time, and preferences across a full week of meals is essentially an optimization problem. The AI handles the heavy lifting, but validation and re-generation loops add complexity.

---

## Scoped-Down MVP

If the full scope is too ambitious for the first release, here is a viable MVP:

- **Include:** User profile, recipe library (manual add only), serving size scaling, basic meal plan generation (AI), shopping list, simple macro display
- **Defer:** Cooking mode, recipe export, budget tracking, recipe import from URL, advanced nutrition dashboard, recipe rating/notes
- **Estimate:** 4-6 weeks for a solo developer, 2-3 weeks for a small team
