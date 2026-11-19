# @repo/ui

shadcn/ui (Radix, `radix-nova` style) on Tailwind v4. Source only, no build: apps compile it.

## Import

```ts
import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/cn";
import { useTheme } from "@repo/ui/hooks/use-theme";
import { themeScript } from "@repo/ui/lib/theme";
```

```css
@import "@repo/ui/styles/globals.css"; /* first line of the app's src/styles/app.css */
```

## Components (`src/components`)

alert-dialog, avatar, badge, breadcrumb, button, calendar, card, chart (recharts), checkbox, command (cmdk),
context-menu, dialog, drawer (vaul), dropdown-menu, empty-state (`Empty*`), form (react-hook-form), input,
input-group, label, popover, radio-group, scroll-area, select, separator, sheet, sidebar, skeleton, slider,
sonner (`Toaster`, `toast`), spinner, switch, table, tabs, textarea, theme-toggle, tooltip.

Add more with the CLI from this folder: `pnpm dlx shadcn@4.23.0 add <name>`, then replace any
`from "cn"` import it writes with `from "#lib/cn"`.

## Theming an app

`globals.css` holds the tokens (light on `:root`, dark on `.dark`), the shadcn variants, and the utilities
`glass`, `shadow-soft`, `shadow-float`. It scans this package itself; the app's CSS adds `@source "../";` for its
own files. An app sets only its accent:

```css
@import "@repo/ui/styles/globals.css";
@source "../";

:root { --tint: oklch(0.6 0.19 255); }
.dark { --tint: oklch(0.68 0.17 255); }
```

`--tint` feeds `primary`, `ring`, `sidebar-primary` and `chart-1` (Tailwind: `bg-tint`, `bg-primary` …).
`--accent` is shadcn's neutral hover surface, not the brand colour.

Dark mode is the `.dark` class on `<html>`. Put `themeScript("system" | "light" | "dark")` inline in `<head>`
(no flash; the argument is the default until the visitor picks), then use `useTheme()` or `<ThemeToggle />`.
The choice is stored in `localStorage.theme`.
