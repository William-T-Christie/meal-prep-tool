# Meal Prep Tool

A meal planner that turns a dietary profile into a full week of meals, scaled recipes, and a single shopping list. You set your constraints once (allergies, macros, budget, time, equipment) and it generates a plan that respects all of them at the same time. The idea is to do the annoying planning work for you.

> Status: still in active development. The core app, data model, and UI are built out across the flows below, but it isn't deployed publicly yet.

## What it does

- **Profile and preferences.** Dietary restrictions, allergies, cuisine likes and dislikes, skill level, per-meal time limits, a weekly budget, and what equipment you have.
- **Meal-plan generation.** Generates a balanced week from your profile in one pass, lets you swap a single meal while keeping the plan balanced, and tries to reuse ingredients across meals to cut waste and cost.
- **Recipe library.** Searchable, filterable store. Save generated recipes or add your own, tag them, and rate or note them after you cook.
- **Serving size adjustment.** Change a serving size and the ingredient amounts, shopping list, and instructions all scale, with sensible fraction rounding.
- **Shopping list.** Built from the active plan, merged across meals so there are no duplicates, grouped by aisle, and checkable while you shop.
- **Cooking mode.** A phone-friendly, step-by-step view with big text and timers.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router) + React, TypeScript (strict) |
| UI | Tailwind CSS + shadcn/ui |
| Server state | TanStack Query |
| Database | PostgreSQL via Prisma |
| Auth | NextAuth.js |
| AI | Claude API (Anthropic SDK), structured JSON output checked with Zod |
| Testing | Vitest (unit) + Playwright (E2E) |

## How the plan generation works

Generating a plan is the core of the app. It sends the user's full set of constraints (allergies, macros, budget, time, preferences) as context and asks the model for structured JSON: a list of meals with ingredients, macros, and instructions. Every response gets checked against a Zod schema before it's stored or shown. If the check fails it retries once with a correction prompt, then shows a clean error. Plans are cached by a hash of the constraints so the same request doesn't hit the API twice.

The parts that take the most thought are keeping all the constraints satisfied at once (macros plus budget plus time plus allergies), scaling recipes correctly (you don't double the bake time when you double the recipe), and mapping free-text ingredient names to real nutrition data (a planned integration).

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
