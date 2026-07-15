# Meal Prep Tool

An AI-powered meal planner that turns a dietary profile into a full week of meals, scaled recipes, and a consolidated shopping list. You set your constraints once — allergies, macros, budget, time, equipment — and the app generates a plan that respects all of them at once.

The guiding principle is **maximum automation, minimum friction**.

> Status: active development. Core app, data model, and UI are built out across the flows below; not yet deployed publicly.

## What it does

- **Profile & preferences** — dietary restrictions, allergies, cuisine likes/dislikes, skill level, per-meal time limits, weekly budget, and available kitchen equipment.
- **AI meal-plan generation** — generates a balanced week from your profile in one pass, swaps individual meals while keeping the plan balanced, and favors meals that reuse ingredients to cut waste and cost.
- **Recipe library** — searchable, filterable store; save AI-generated recipes or add your own; tag, rate, and note after cooking.
- **Dynamic serving adjustment** — change a serving size and ingredient quantities, the shopping list, and instructions all scale, with sensible fractional rounding.
- **Shopping list** — auto-built from the active plan, consolidated across meals, grouped by aisle, and checkable while you shop.
- **Cooking mode** — a phone-friendly, step-by-step view with large text and built-in timers.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router) + React, TypeScript (strict) |
| UI | Tailwind CSS + shadcn/ui |
| Server state | TanStack Query |
| Database | PostgreSQL via Prisma |
| Auth | NextAuth.js |
| AI | Claude API (Anthropic SDK), structured JSON output validated with Zod |
| Testing | Vitest (unit) + Playwright (E2E) |

## How the AI layer works

Meal-plan generation is the core. The user's full constraint set (allergies, macros, budget, time, preferences) is sent as system context, and the model is asked for **structured JSON** — a meals array with ingredients, macros, and instructions. Every response is validated against a Zod schema before it's stored or shown; if validation fails it retries once with a correction prompt, then surfaces a clean error. Generations are cached by a hash of the constraints to avoid redundant API calls.

The hard parts — and why they're interesting — are reliable constraint satisfaction (macros + budget + time + allergies simultaneously), mapping free-text ingredient names to real nutrition data, and non-linear recipe scaling (you don't double the bake time when you double the recipe).

## Run it locally

```bash
pnpm install
cp .env.example .env.local   # fill in the values below
pnpm prisma migrate dev      # set up the database
pnpm dev                     # http://localhost:3000
```

Environment variables (`.env.local`):

```
DATABASE_URL=        # PostgreSQL connection string
NEXTAUTH_SECRET=     # NextAuth session secret
NEXTAUTH_URL=        # http://localhost:3000 in dev
AI_API_KEY=          # Claude API key
NUTRITION_API_KEY=   # USDA FoodData Central (or Edamam)
```

## Project layout

```
src/
├── app/            # App Router pages: auth, dashboard, recipes, meal-plan, shopping, cook, settings
├── components/     # ui/ (shadcn primitives) + features/ (feature components)
├── lib/            # ai/ (prompts, schemas, validation), nutrition/, scaling/, db.ts
├── server/         # server-only services and route handlers
└── types/          # shared TypeScript types
prisma/             # schema, migrations, seed data
tests/              # Vitest + Playwright
```

---

<sub>Built by William Christie. Personal project.</sub>
