# CLAUDE.md

Asked to turn a template into someone's own app? Start with `AGENTS.md`; this file holds the rules the code follows.

Six ready-to-use React templates in one pnpm + turbo monorepo. Someone opening this repo should see what their
app could look like, copy one `apps/<name>` folder plus `packages/ui`, and start replacing sample data.

## Apps

| App | Framework | Port | Shape | Reference (`design/references/`, local only) |
|---|---|---|---|---|
| `portfolio-desktop` | TanStack Start | 3001 | Desktop: menu bar, dock, draggable windows, widgets, Notes | `1-portfolio-ri-os.jpg` |
| `portfolio-phone` | TanStack Start | 3002 | Lock screen → home screen, app icons, widgets, apps open full-screen | `2b-…lockscreen.jpg`, `2-…desktop.jpg` |
| `portfolio-tablet` | TanStack Start | 3003 | Tablet home: widget grid, dock, apps in split view | `3-portfolio-alex-ojanen.jpg` |
| `app-workspace` | TanStack Start, static SPA | 3004 | Documents/notes workspace: sidebar, doc grid, editor, inspector | `4-webapp-craft-mobbin.jpg` |
| `app-crm` | TanStack Start, static SPA | 3005 | Business/CRM admin: grouped sidebar, home, data tables, record detail | `5-webapp-attio-mobbin.jpg` |
| `app-finance` | TanStack Start, static SPA | 3006 | Finance/analytics dashboard, dark glass: charts, lists, command palette, floating dock nav | `6-webapp-fey-mobbin.jpg` |

References set the layout and feel only. Never copy their text, logos, icons, images or brand names, and never use
Apple's logo, SF Symbols, app icons or wallpapers. All content is original placeholder data for a fictional person
or company. Icons: `lucide-react`. Fonts: the system UI stack or an open font.

## Design direction

System-style: calm, generous spacing, large radii (12–20px), translucent surfaces with backdrop blur, hairline
borders, soft layered shadows, system typography with tight tracking on headings, one accent colour per app,
light and dark themes, motion that is short and respects `prefers-reduced-motion`. Comfortable density: never
cramped, body 14–15px in apps.

## Colour — measured from real products, not invented

The neutral structure below is measured; the accents are our own. They were deliberately moved away from the
reference products' brand colours, so no template shares a signature colour, name or mark with a real product.
Product names in the templates are invented (Paperwren, Tidewell, Ledgerfinch) and must stay invented.

The palettes below were measured from screens of shipping products (Mobbin). The pattern they share is the rule:
90%+ of every screen is a PURE neutral (no warm or cool tint), text is near-black (or white on dark), and there
is exactly ONE saturated brand colour, used on 1–2% of the screen: the primary action, the active state, one
highlight. Do not tint surfaces. Do not mute the accent. Do not add a second brand colour.

| App | Light: bg / surface / border / text / muted | Dark: bg / surface / raised / border / text / muted | Accent (`--tint`) and text on it |
|---|---|---|---|
| `portfolio-desktop` | `#FFFFFF` / `#F7F7F7` / `#DDDDDD` / `#222222` / `#6A6A6A` | `#121212` / `#1E1E1E` / `#2A2A2A` / `#3A3A3A` / `#FFFFFF` / `#B0B0B0` | tomato `#E5432D`, white text (as link text on white: `#C7361F`) |
| `portfolio-phone` | `#FFFFFF` / `#F5F5F5` / `#E5E5E5` / `#121212` / `#6B6B6B` | `#121212` / `#1E1E1E` / `#2E2E2E` / `#3A3A3A` / `#FFFFFF` / `#B3B3B3` | green `#1FB85A`, `#0E0E10` text (as link text on white: `#14803C`) |
| `portfolio-tablet` | `#FFFFFF` / `#EEEEEE` / `#E0E0E0` / `#111111` / `#555555` | `#121212` / `#1E1E1E` / `#2A2A2A` / `#3A3A3A` / `#FFFFFF` / `#B3B3B3` | aqua `#7FE3D4` with deep teal `#0B3B3C` text; deep teal `#0B3B3C` is the secondary solid (aqua text); accent as text: deep teal in light, aqua in dark |
| `app-workspace` | `#FAFAFA` / `#FFFFFF` / `#EAEAEA` / `#1A1A1A` / `#6B6B6B` | `#111111` / `#1A1A1A` / `#242424` / `#2E2E2E` / `#FAFAFA` / `#A0A0A0` | primary buttons are ink (`#1A1A1A`, white text; inverted in dark); the one colour is highlighter yellow `#FFC61A`: text selection, the active-item marker, checked to-dos and switches (dark `#1A1A1A` glyph on it), highlights. Links are ink, underlined. Focus ring: ink at 40% (white at 50% in dark) |
| `app-crm` | `#FFFFFF` / `#FAFAFA` (sidebar) / `#EBEBEB` / `#141414` / `#737373` | `#0F0F0F` / `#181818` / `#222222` / `#2A2A2A` / `#F5F5F5` / `#9A9A9A` | cobalt `#2450E6`, white text (links in dark `#8FA5FF`); in this app the category "blue" IS the accent, never `#007AFF` |
| `app-finance` | `#FFFFFF` / `#F5F5F5` / `#E5E5E5` / `#0E0E10` / `#6B6B70` | `#0E0E10` / `#1C1C1F` / `#2A2A2E` / `#2A2A2E` / `#FFFFFF` / `#A0A0A6` (dark is the default) | amber `#FFB020`, black text (as text on white: `#A86400`). Gain green `#22C55E` (`#15803D` on white), loss red `#F23645` (`#D92D3A` on white): gain/loss are semantic, never the brand |

Hover/pressed/selected neutrals are steps of the same pure gray (e.g. `#F4F4F4`, `#EBEBEB` in light; +6–8%
lightness in dark). Hairlines may be the text colour at 8–12% alpha.

Category colours — only where a set of things must be told apart (app tiles, tags, list dots, stages, chart
series). One shared system-style set, clear and solid, never gradients:
red `#FF3B30`, orange `#FF9500`, yellow `#FFCC00`, green `#34C759`, teal `#30B0C7`, blue `#007AFF`,
gray `#8E8E93`, graphite `#1C1C1E`.
- Portfolio app tiles: a SOLID fill from this set with a white glyph (dark glyph on yellow). Flat; at most a
  barely visible top-to-bottom shade of the same colour. Use the app's accent for its primary tile.
- Web-app tags, badges, stage dots: the colour at 12–16% alpha as the surface with a darker text of the same
  hue, or a small solid dot + neutral text. Avatars and initials: neutral gray (`#EAEAEA` with dark initials;
  `#2A2A2A` with light initials in dark), not coloured.
- Charts: the accent first, then neutral grays, then at most two category colours. Semantic: success green
  `#34C759`, warning orange `#FF9500`, danger red `#FF3B30` (finance uses its own green/red above). Change is
  never colour-only (keep the arrow or sign).

Never: violet/purple/indigo/pink, tinted "cream/sand/slate" surfaces, earthy muted sets (terracotta, sage,
ochre), two-hue or mesh gradients, glows, neon blur. Wallpapers and backdrops are a flat neutral (optionally a
very faint neutral vignette); wallpaper options may add a flat accent field and flat black/white. Any accent or
wallpaper picker offers only: the app accent plus colours from the category set. Light and dark are both
designed; text contrast at least WCAG AA.

## Stack (fixed)

- React 19, TypeScript strict, Tailwind v4, `@repo/ui` (shadcn/ui components on Radix, source-only package).
- Data: TanStack Query. Tables: TanStack Table. Forms: react-hook-form + `@hookform/resolvers`. Schemas: zod, always.
- Lint/format: biome (tabs, double quotes, width 100). Package manager: pnpm only. Node 24
  (`source ~/.nvm/nvm.sh && nvm use 24` before any pnpm command; the default shell node is too old).

## Structure — feature-based, strict

```
apps/<app>/src/
  routes/               thin route files: beforeLoad/loader/head + one page component, nothing else
  features/<feature>/   one folder per feature; sub-folders only from this fixed vocabulary:
    api/                data access — queryOptions in api/queries.ts, mutations in api/mutations.ts
    components/         React components; route pages are <name>-page.tsx
    hooks/  utils/  types/  schemas/  constants/
  components/kit/       app-specific design kit built on @repo/ui
  components/layout/    the app shell (sidebar, header, dock, window frame …)
  lib/                  cross-feature helpers
packages/ui/src/
  components/           shadcn/ui components (kebab-case files)
  styles/               tokens + base CSS
  lib/                  cn and friends
```

- A feature only gets the sub-folders it needs, but the names never change.
- Features do not import from other features' internals; share through `lib/` or `components/`.
- Sample data lives behind `features/<feature>/api/queries.ts` (`queryOptions` returning in-memory data through an
  async function). Swapping in a real API later means changing only those `queryFn`s. zod schemas in
  `schemas/` define the shapes; types are `z.infer` of them.
- File names kebab-case. Named exports. No barrel files. Import alias `@/*` → `src/*`.

## Done means

From the repo root: `pnpm typecheck`, `pnpm build` and `pnpm check` pass for the app, and the app was opened in
a browser and looked at in light and dark, desktop and phone width.
