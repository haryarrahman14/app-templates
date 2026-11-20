---
title: How do you turn a tablet home screen into a portfolio?
excerpt: The first screen already shows everything as widgets, and each widget opens an app with the full story.
tags: Design System, React, Tailwind CSS, Portfolio, TanStack
stack: React, TypeScript, TanStack Start, TanStack Router, React Query, Tailwind CSS, shadcn/ui, Radix UI, Zod, React Hook Form, Motion, Lucide, Vite, Turborepo, pnpm, Biome, Cloudflare Workers
publishedAt: 2026-11-19
lang: en
cover: https://haryarrahman.tech/posts/portfolio-as-a-tablet-home-screen/home-light-v2.jpg
share: https://haryarrahman.tech/og/portfolio-as-a-tablet-home-screen.png
---

*Template series, part 3 of 6. The code is in the repo.*

Short answer: make the first screen a summary of everything. Each thing about you becomes one small widget. Tap a widget, and an app with the full story opens.

## What I built

A portfolio shaped like a tablet home screen. Widgets on top, a dock of apps below. The content is my own portfolio.

Try it: [tablet.blog.haryarrahman.tech](https://tablet.blog.haryarrahman.tech)

![The tablet home in light mode: profile, featured project, availability, clock, notes, skills, experience, numbers and gallery widgets above the dock](https://haryarrahman.tech/posts/portfolio-as-a-tablet-home-screen/home-light-v2.jpg)

*The home. The featured project is the deep teal widget.*

## A portfolio doesn't have to be a long page

A portfolio is usually one long page. Visitors see only the top, then have to scroll to find out what else is there.

Here the first screen already holds everything: who I am, the featured project, experience, numbers, notes and the gallery. So in one look, visitors know what there is.

![Left: a long page where only the top shows. Right: one screen holding every widget](https://haryarrahman.tech/posts/portfolio-as-a-tablet-home-screen/scroll-en.png)

*The same content. On the right it all shows without scrolling.*

## A widget only needs to be a summary

But a widget is small. A whole page doesn't fit inside it.

So each widget holds just one short thing, and the whole widget can be tapped. Tap the featured project, and the Projects app opens on that project. Tap notes, and the latest note opens. The home is for a quick look, the apps are for reading.

![Left: the featured project widget. Right: the Projects app it opens, with a list of projects and the details](https://haryarrahman.tech/posts/portfolio-as-a-tablet-home-screen/widget-en.png)

*The widget is short. The story is in the app.*

## The important ones are bigger

If every widget is the same size, nothing stands out. Visitors don't know where to start.

So widgets come in four sizes: small, medium, wide and large. They all sit on one grid. The profile and the featured project get the largest size, so they are seen first.

![Left: a grid of widgets all the same size. Right: the same grid with large, small, medium and wide widgets](https://haryarrahman.tech/posts/portfolio-as-a-tablet-home-screen/sizes-en.png)

*The same widgets. The sizes show the reading order.*

## The rest follows the visitor

- **The order can change.** Visitors can move widgets into their own order, and it is remembered when they come back.
- **Two apps can sit side by side.** For example a project on the left and a note on the right, in split view.
- **On a phone, one at a time.** The grid narrows, and only one app opens.

![Projects and Notes open side by side in split view, the dock below](https://haryarrahman.tech/posts/portfolio-as-a-tablet-home-screen/split-view-light-v2.jpg)

*Split view: Projects on the left, Notes on the right.*

The light, calm home came from a desktop-style portfolio by Alex Ojanen that I found on Awwwards. I took only the idea, not the name, the look or the icons.

## Conclusion

A tablet home screen works as a portfolio when its first screen works as a summary:

- Everything important shows without scrolling.
- Each widget is short, and opens an app with the story.
- Widget size shows what to look at first.

## The numbers

| | Light | Dark |
|---|---|---|
| Background | `#FFFFFF` | `#121212` |
| Widget | `#FFFFFF` | `#1E1E1E` |
| Wallpaper | `#EEEEEE` | `#121212` |
| Border | `#E0E0E0` | `#3A3A3A` |
| Text | `#111111` | `#FFFFFF` |
| Label | `#555555` | `#B3B3B3` |
| Accent | `#7FE3D4` | `#7FE3D4` |
| Text on the accent | `#0B3B3C` | `#0B3B3C` |

The font is the system font. Body text 15px, buttons and menus 14px, titles 24px.

## Use it yourself

The code is in [app-templates/apps/portfolio-tablet](https://github.com/haryarrahman14/app-templates/tree/main/apps/portfolio-tablet).

### Hand it to your AI

Want it as your own right away? Paste this into Claude Code, Cursor or any other agent in an empty folder:

```text
Set up a project from a template for me.

1. Clone https://github.com/haryarrahman14/app-templates
2. Read AGENTS.md at the repo root: it says where every change goes.
   docs/design-system.md has the colours, type and spacing.
3. I want the template in apps/portfolio-tablet
   (live preview: https://tablet.blog.haryarrahman.tech).
   Keep that folder and packages/ui and packages/content; remove the other apps.
4. Turn it into my portfolio.
   I am <your name>, <your role>. My projects and links: <paste them>. Accent colour: <a colour>.

Ask me for anything you need before you start. Then run it locally and show me.
```

[Part 4](https://haryarrahman.tech/blog/documents-workspace-template) leaves the portfolios: a documents workspace called Paperwren.
