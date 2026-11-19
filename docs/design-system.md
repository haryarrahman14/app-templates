# Design system

One shared package, `packages/ui`, and six apps that each set a handful of variables on top of it. This page is
the reference: where the look came from, and every value that defines it.

## Where it came from

The structure was measured, not invented. Screens of shipping products were sampled pixel by pixel (the two most
common neutrals, the text colour, and every saturated colour with its share of the screen). The products looked
at: Attio, Linear, Mercury, Amie, Fey, Wise, Airbnb, Headspace, Spotify, Cash App, Klarna and Monzo, through
their screens on Mobbin; and for the portfolio shapes, three desktop-style portfolios found on Awwwards.

What they share became the rule:

1. **90% or more of a screen is a pure neutral.** White or near-black, with no warm or cool tint.
2. **Text is near-black** (`#141414`–`#222222`), or white on dark. Never a coloured gray.
3. **One saturated brand colour, on 1–2% of the screen.** The primary action, the active state, one highlight.
4. **A second set of colours exists only to tell things apart** (app icons, tags, chart series), and it is a
   plain, solid, system-style set.

Nothing else was taken. The accent colours, product names, icons, copy and layouts are this repo's own, and the
accents were deliberately moved away from the reference products' brand colours.

## Colour

### Per app

| App | Shape | Light: background / surface / border / text / muted | Dark: background / surface / raised / border / text / muted | Accent |
|---|---|---|---|---|
| `portfolio-desktop` | Laptop desktop | `#FFFFFF` / `#F7F7F7` / `#DDDDDD` / `#222222` / `#6A6A6A` | `#121212` / `#1E1E1E` / `#2A2A2A` / `#3A3A3A` / `#FFFFFF` / `#B0B0B0` | Tomato `#E5432D` |
| `portfolio-phone` | Phone | `#FFFFFF` / `#F5F5F5` / `#E5E5E5` / `#121212` / `#6B6B6B` | `#121212` / `#1E1E1E` / `#2E2E2E` / `#3A3A3A` / `#FFFFFF` / `#B3B3B3` | Green `#1FB85A` |
| `portfolio-tablet` | Tablet home | `#FFFFFF` / `#EEEEEE` / `#E0E0E0` / `#111111` / `#555555` | `#121212` / `#1E1E1E` / `#2A2A2A` / `#3A3A3A` / `#FFFFFF` / `#B3B3B3` | Aqua `#7FE3D4` on deep teal `#0B3B3C` |
| `app-workspace` (Paperwren) | Documents | `#FAFAFA` / `#FFFFFF` / `#EAEAEA` / `#1A1A1A` / `#6B6B6B` | `#111111` / `#1A1A1A` / `#242424` / `#2E2E2E` / `#FAFAFA` / `#A0A0A0` | Ink buttons, highlighter yellow `#FFC61A` |
| `app-crm` (Tidewell) | Business admin | `#FFFFFF` / `#FAFAFA` / `#EBEBEB` / `#141414` / `#737373` | `#0F0F0F` / `#181818` / `#222222` / `#2A2A2A` / `#F5F5F5` / `#9A9A9A` | Cobalt `#2450E6` |
| `app-finance` (Ledgerfinch) | Finance, dark first | `#FFFFFF` / `#F5F5F5` / `#E5E5E5` / `#0E0E10` / `#6B6B70` | `#0E0E10` / `#1C1C1F` / `#2A2A2E` / `#2A2A2E` / `#FFFFFF` / `#A0A0A6` | Amber `#FFB020` |

### Accent on text

A bright accent is a fill, not a text colour. Where the accent has to be read as small text on white, a darker
step of the same hue is used, and bright accents carry dark text on top.

| Accent | Text on the accent | The accent as text on white |
|---|---|---|
| Tomato `#E5432D` | White | `#C7361F` |
| Green `#1FB85A` | `#0E0E10` | `#14803C` |
| Aqua `#7FE3D4` | Deep teal `#0B3B3C` | Deep teal `#0B3B3C` |
| Yellow `#FFC61A` | `#1A1A1A` | Not used as text; links are ink, underlined |
| Cobalt `#2450E6` | White | `#2450E6` (`#8FA5FF` on dark) |
| Amber `#FFB020` | Black | `#A86400` |

### Category colours

Used only where a set of things must be told apart. Solid fills, no gradients.

| Name | Value | | Name | Value |
|---|---|---|---|---|
| Red | `#FF3B30` | | Teal | `#30B0C7` |
| Orange | `#FF9500` | | Blue | `#007AFF` |
| Yellow | `#FFCC00` | | Gray | `#8E8E93` |
| Green | `#34C759` | | Graphite | `#1C1C1E` |

- Portfolio app icons: a solid fill with a white glyph (dark glyph on yellow).
- Tags, badges and status pills in the web apps: the colour at 12–16% opacity as the surface, with a darker
  text of the same hue.
- Avatars and initials: neutral gray, never coloured.
- Charts: the accent first, then neutral grays, then at most two category colours.
- Where a category colour would sit beside an accent of the same hue, the accent takes its place (the CRM has
  one blue; the workspace has one yellow).

### Semantic colours

Success `#34C759`, warning `#FF9500`, danger `#FF3B30`. The finance app keeps its own pair, gain `#22C55E` and
loss `#F23645` (`#15803D` and `#D92D3A` on white), and they are never the brand colour. A change is never shown
by colour alone; the arrow or sign stays.

### Never

Violet, purple, indigo or pink. Tinted "cream", "sand" or "slate" surfaces. Muted earthy sets. Two-colour or
mesh gradients, glows, neon blur.

## Typography

One typeface: the system UI font (`ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, …`), so every
platform shows its own interface font and nothing is downloaded. Monospace is `ui-monospace, Menlo, Consolas`.

| Role | Size | Weight | Notes |
|---|---|---|---|
| Hero / page greeting | 30–36px | 600 | Tight tracking |
| Page title | 24px | 600 | Tight tracking |
| Section title | 20px | 600 | Tight tracking |
| Card title, large label | 16–17px | 500–600 | |
| Body (default) | 15px | 400 | Line height 1.625 |
| Interface text (lists, tables, menus, buttons) | 14px | 400–500 | The most used size |
| Secondary text | 13px | 400 | Muted colour |
| Caption, metadata, badges | 12px | 400–500 | |
| Micro labels (overlines, key hints) | 11px | 500 | Uppercase only for overlines |

Two weights carry almost everything: 500 for emphasis in the interface and 600 for titles. Headings use tight
letter spacing and balanced wrapping. Numbers in the finance app use tabular figures.

## Spacing

A 4px grid. The values that recur:

| Use | Value |
|---|---|
| Between an icon and its label | 6–8px |
| Between items in a list or toolbar | 8–12px |
| Between cards in a grid | 12–16px |
| Control padding (buttons, inputs, rows) | 12–16px horizontal, 8–12px vertical |
| Card padding | 16–20px |
| Page gutter | 16px on phones, 24–32px on desktop |

Density is deliberately comfortable: table rows and list rows are never tighter than 8px of vertical padding.

## Shape

The base radius is 14px (`--radius: 0.875rem`), and every other radius is a multiple of it.

| Token | Value | Used for |
|---|---|---|
| `rounded-sm` | 7px | Checkboxes, small chips |
| `rounded-md` | 10.5px | Inputs, small buttons, menu items |
| `rounded-lg` | 14px | Buttons, list rows |
| `rounded-xl` | 17.5px | Cards, tiles, popovers |
| `rounded-2xl` | 21px | Large cards, dialogs, widgets |
| `rounded-3xl` | 28px | Sheets, device frames |
| `rounded-full` | — | Pills, avatars, dots |

Borders are hairlines: 1px in the app's border colour, or the text colour at 8–12% opacity.

## Elevation

Two shadows and one translucent surface, all neutral black.

| Utility | What it is | Used for |
|---|---|---|
| `shadow-soft` | A 0.5px ring, a 1px contact shadow and a soft 12px drop | Cards and tiles at rest |
| `shadow-float` | A 0.5px ring, an 8px drop and a wide 40px drop | Popovers, windows, docks, sheets |
| `glass` | The surface colour at about 65–72% opacity, a 20px backdrop blur with 180% saturation, and a hairline edge | Menu bars, docks, sidebars, floating bars |

## Motion

Short and quiet. Sheets, windows and docks use one curve, `cubic-bezier(0.32, 0.72, 0, 1)`: fast out, soft
landing. Hover and press changes are 100–150ms. Everything collapses to near-zero duration when the visitor asks
for reduced motion, and each portfolio has its own switch for it.

## Themes

Light and dark are both designed, switched by a `.dark` class on `<html>`. A small inline script applies the
saved choice before the first paint, so there is no flash. The finance app defaults to dark; the others follow
the system.

## Components

`packages/ui` holds the shared components (shadcn/ui on Radix, Tailwind v4), imported as
`@repo/ui/components/<name>`:

alert-dialog, avatar, badge, breadcrumb, button, calendar, card, chart, checkbox, command, context-menu, dialog,
drawer, dropdown-menu, empty-state, form, input, input-group, label, popover, radio-group, scroll-area, select,
separator, sheet, sidebar, skeleton, slider, sonner (toasts), spinner, switch, table, tabs, textarea,
theme-toggle, tooltip.

Each app adds its own small kit in `src/components/kit/` (data table, charts, window frame, app icon and so on)
built from these.

## How an app themes itself

An app imports the shared stylesheet once and overrides variables in its own `src/styles/app.css`:

```css
@import "@repo/ui/styles/globals.css";
@source "../";

:root {
	--tint: #2450e6;            /* the one accent */
	--tint-foreground: #ffffff; /* text on the accent */
	--background: #ffffff;
	--foreground: #141414;
	--border: #ebebeb;
	/* …the rest of the neutrals */
}
.dark {
	--background: #0f0f0f;
	--foreground: #f5f5f5;
}
```

`--tint` feeds the primary button, focus ring, active states and the first chart colour. shadcn's `--accent`
stays the neutral hover surface; it is not the brand colour.
