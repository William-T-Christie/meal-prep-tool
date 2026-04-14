# CLAUDE.md -- Meal Prep Tool V2

## Project Overview

A web app for automated meal planning. Users set dietary profiles and constraints; the app generates personalized weekly meal plans with scaled recipes, consolidated shopping lists, and step-by-step cooking instructions. AI-powered plan generation is the core differentiator.

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (strict mode, no `any`)
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** PostgreSQL via Prisma ORM
- **Auth:** NextAuth.js
- **AI:** Claude API (Anthropic SDK) with structured JSON output
- **Nutrition Data:** USDA FoodData Central API (TBD — Edamam as backup)
- **Deployment:** Vercel + Neon (managed PostgreSQL)
- **Server State:** TanStack Query (React Query)
- **Testing:** Vitest (unit), Playwright (E2E)
- **Package Manager:** pnpm

## Project Structure

```
/
├── prisma/              # Schema, migrations, seed data
├── src/
│   ├── app/             # Next.js App Router pages and layouts
│   │   ├── (auth)/      # Login, register, onboarding
│   │   ├── dashboard/   # Main dashboard
│   │   ├── recipes/     # Recipe library and detail pages
│   │   ├── meal-plan/   # Weekly plan view
│   │   ├── shopping/    # Shopping list
│   │   ├── cook/        # Cooking mode
│   │   └── settings/    # User preferences
│   ├── components/      # Shared UI components
│   │   ├── ui/          # shadcn/ui primitives
│   │   └── features/    # Feature-specific components
│   ├── lib/             # Utilities, helpers, constants
│   │   ├── ai/          # AI prompt templates, output validation
│   │   ├── nutrition/   # Nutrition API client and caching
│   │   ├── scaling/     # Serving size math and unit conversion
│   │   └── db.ts        # Prisma client singleton
│   ├── server/          # Server-only code (API route handlers, services)
│   └── types/           # Shared TypeScript types and interfaces
├── tests/               # Test files mirroring src/ structure
├── public/              # Static assets
└── .env.local           # Environment variables (never commit)
```

## Build Order

1. Scaffolding + DB schema + Auth
2. User profile and preferences CRUD
3. Recipe CRUD + library UI
4. Serving size scaling logic
5. AI meal plan generation (prompt engineering + validation)
6. Meal plan UI (weekly grid)
7. Nutrition API integration + macro dashboard
8. Shopping list generation + UI
9. Cooking mode UI
10. Polish, testing, accessibility

## Key Rules

- **TypeScript strict mode.** No `any` types. Define interfaces for all data shapes.
- **Server-side validation.** Never trust client input or AI output without validation.
- **AI output schema.** All AI responses must conform to a Zod schema before being stored or displayed. Always validate.
- **Prisma for all DB access.** No raw SQL unless there is a specific performance reason.
- **API routes return consistent shapes.** Use a standard `{ data, error, status }` envelope.
- **Environment variables.** All secrets in `.env.local`. Use `NEXT_PUBLIC_` prefix only for truly public values.
- **Component naming.** PascalCase for components, kebab-case for files. One component per file.
- **No default exports** except for Next.js pages/layouts (which require them).
- **Error boundaries.** Every major page section gets an error boundary.
- **Loading states.** Every async operation needs a loading indicator. Use Suspense where possible.
- **Mobile-first.** Design for mobile, enhance for desktop. Cooking mode must be thumb-friendly.

## AI Integration Guidelines

- Prompt templates live in `src/lib/ai/prompts/`.
- Every prompt includes the user's full constraint set (allergies, macros, budget, time, preferences).
- AI must return structured JSON. Use JSON mode / tool-use where the API supports it.
- Validate all AI output with Zod schemas in `src/lib/ai/schemas/`.
- If validation fails, retry once with a correction prompt. If it fails again, surface a user-friendly error.
- Cache meal plan generations keyed by constraint hash to avoid redundant API calls.
- Log all AI requests and responses (redacted of PII) for debugging.

## Database Conventions

- Table names: plural snake_case (e.g., `meal_plans`, `recipe_ingredients`)
- All tables have `id` (UUID), `created_at`, `updated_at`
- Soft delete where appropriate (add `deleted_at` column)
- Foreign keys always have `ON DELETE CASCADE` or explicit handling
- Indexes on all foreign keys and commonly filtered columns

## Testing Strategy

- **Unit tests:** Scaling logic, nutrition calculations, AI output validation, utility functions
- **Integration tests:** API routes with test database
- **E2E tests:** Critical flows (onboarding, generate plan, view shopping list)
- **Target:** 80%+ coverage on business logic, E2E for happy paths

## Environment Variables

```
DATABASE_URL=            # PostgreSQL connection string
NEXTAUTH_SECRET=         # NextAuth session secret
NEXTAUTH_URL=            # App URL (http://localhost:3000 in dev)
AI_API_KEY=              # Claude or OpenAI API key
AI_PROVIDER=             # "claude" or "openai"
NUTRITION_API_KEY=       # USDA or Edamam API key
```
