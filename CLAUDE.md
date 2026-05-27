# LandUp! — Claude Code Project Brief

> AI-powered quiz funnel & lead-gen landing page builder.
> Replaces / improves upon Perspective.co under Iconic Digital World branding.

---

## App Name & Branding

| Token | Value |
|-------|-------|
| App name | **LandUp!** |
| Domain | landup.io |
| Primary Dark | `#34386a` (navy/indigo) |
| Accent | `#a5185e` (magenta/pink) |
| Bg Light | `#f6f5ff` (lavender) |
| Bg Darker | `#ecebf7` |
| Font | Inter |

---

## Monorepo Structure

```
apps/
  web/          # Editor + Dashboard (Next.js 14 App Router, TypeScript)
  funnel/       # Published funnel renderer (Next.js 14, SSR, mobile-first)
packages/
  ui/           # shadcn/ui components + brand tokens
  db/           # Prisma schema + migrations (PostgreSQL)
  ai/           # Anthropic SDK wrapper, prompt templates
  types/        # Shared TypeScript types + routing/scoring logic
workers/
  scraper/      # Puppeteer headless browser (URL → brand profile)
```

## Key Commands

```bash
pnpm install          # Install all dependencies
pnpm dev              # Run all apps in dev mode
pnpm build            # Build all apps
pnpm db:generate      # Generate Prisma client
pnpm db:push          # Push schema to DB (dev)
pnpm db:migrate       # Run migrations (prod)
```

## Environment Setup

Copy `.env.example` files in each app:
- `apps/web/.env.example` → `apps/web/.env.local`
- `apps/funnel/.env.example` → `apps/funnel/.env.local`

## Key UX Rules (Funnel Renderer)

1. Mobile-first always: Max-width 390px, centred on desktop
2. One action per page: No scrolling menu, no sidebars
3. Quiz auto-advances on answer select (button/image types)
4. Sunk cost before gate: Quiz BEFORE opt-in form
5. Soft nurture redirect: Non-qualified → free resource, never rejection
6. Exclusivity eyebrow on opt-in gate
7. Back button on by default (toggleable per funnel)

## AI Edit Feature (Key Differentiator vs Perspective.co)

Two modes in the editor:
1. **Element AI Edit**: Click any block → "AI Edit" button appears → describe change → AI rewrites that block only
2. **Global AI Chat**: Toggle "AI Edit" in topbar → chat panel opens → describe broader changes

This is Phase 1 — block-level and page-level AI edits via streaming chat.
