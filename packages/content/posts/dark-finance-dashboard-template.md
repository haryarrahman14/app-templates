---
title: How do you design a finance dashboard that starts in dark mode?
excerpt: Not pure black, but a near-black background, white text, and one job for each colour.
tags: Design System, React, Tailwind CSS, TanStack, Web App
stack: React, TypeScript, TanStack Start, TanStack Router, React Query, TanStack Table, Recharts, Tailwind CSS, shadcn/ui, Radix UI, Zod, React Hook Form, Motion, Lucide, Vite, Turborepo, pnpm, Biome, Cloudflare Workers
publishedAt: 2026-11-19
lang: en
cover: https://haryarrahman.tech/posts/dark-finance-dashboard-template/overview-dark-v2.jpg
share: https://haryarrahman.tech/og/dark-finance-dashboard-template.png
---

*Template series, part 6 of 6. The code is in the repo.*

Short answer: not with a pure black background. The background is near-black, the text is white, and each colour has only one job. The brand colour is for buttons, green and red are for up and down.

## What I built

Ledgerfinch, a sample finance dashboard. It has a portfolio chart, a list of stocks, and a page for each stock. All the names and prices are made up.

Try it: [ledgerfinch.blog.haryarrahman.tech](https://ledgerfinch.blog.haryarrahman.tech)

![The Ledgerfinch overview in dark mode: an amber portfolio chart, the daily brief and upcoming events, with the dock at the bottom](https://haryarrahman.tech/posts/dark-finance-dashboard-template/overview-dark-v2.jpg)

*The main page. Almost all of it is black, white and gray.*

## Dark mode does not mean pure black

A card has to look different from the background. On a light page that is easy: add a shadow. On a dark page, a shadow does not show.

Here it works the other way round: the card is a little lighter than the background. On pure black, that jump feels harsh. So I start from near-black and go up a little at a time.

![Left: a pure black background with dark gray cards. Right: a near-black background with cards that step up evenly](https://haryarrahman.tech/posts/dark-finance-dashboard-template/layers-en.png)

*Three levels: the background, the card, and a layer on top of the card.*

## Green cannot be the brand colour

In a finance app, green means up and red means down.

A green "Buy" button would look like good news. So I picked amber as the brand colour. Now it is clear: amber you can click, green is up, red is down.

![Left: a green Buy button under a gain that is also green. Right: an amber Buy button](https://haryarrahman.tech/posts/dark-finance-dashboard-template/brand-en.png)

*The same button in two colours. The left one makes you hesitate.*

## Colour alone is not enough

Some people find red and green hard to tell apart. So every change always has an arrow and a plus or minus sign.

Try taking the colour away. The numbers still read.

![Left: two values told apart only by colour look the same once the colour is gone. Right: with arrows and signs they still read](https://haryarrahman.tech/posts/dark-finance-dashboard-template/signs-en.png)

*The bottom row is the same numbers without colour.*

## The rest stays quiet

- **Text has only two colours.** White for numbers, gray for labels.
- **Only one chart is amber**, the portfolio chart. Stock charts are green or red, depending on whether the price went up or down.
- **The menu is at the bottom**, not on the side. So charts and tables get the full width of the screen.

![An instrument page in dark mode: the price, a green one-month chart, and your position with an amber Buy button](https://haryarrahman.tech/posts/dark-finance-dashboard-template/instrument-detail-dark-v2.jpg)

*The page for one stock. The chart is green because the price went up.*

The ideas came from two real products: the bottom menu from Fey, and near-black with one bright colour from Spotify. I only took the ideas, not their names, logos or colours.

## Conclusion

An easy-to-read dark dashboard is not about black. It comes down to three things:

- Cards a little lighter than the background.
- One brand colour that does not clash with up and down.
- Signs that still read without colour.

## The numbers

| | Dark | Light |
|---|---|---|
| Background | `#0E0E10` | `#FFFFFF` |
| Card | `#1C1C1F` | `#F5F5F5` |
| Text | `#FFFFFF` | `#0E0E10` |
| Label | `#A0A0A6` | `#6B6B70` |
| Brand | `#FFB020` | `#FFB020` |
| Up | `#22C55E` | `#15803D` |
| Down | `#F23645` | `#D92D3A` |

The font is the system's built-in font. Body text is 15px, tables and buttons 14px, titles 20 to 24px.

## Use it yourself

The code is in [app-templates/apps/app-finance](https://github.com/haryarrahman14/app-templates/tree/main/apps/app-finance).

### Hand it to your AI

Want it as your own right away? Paste this into Claude Code, Cursor or any other agent in an empty folder:

```text
Set up a project from a template for me.

1. Clone https://github.com/haryarrahman14/app-templates
2. Read AGENTS.md at the repo root: it says where every change goes.
   docs/design-system.md has the colours, type and spacing.
3. I want the template in apps/app-finance
   (live preview: https://ledgerfinch.blog.haryarrahman.tech).
   Keep that folder and packages/ui; remove the other apps.
4. Turn it into my app.
   Name: <your product>. What it does: <one line>. Accent colour: <a colour>.

Ask me for anything you need before you start. Then run it locally and show me.
```

That is the last of the six. [Part 1](https://haryarrahman.tech/blog/portfolio-as-a-laptop-desktop) starts again at the laptop desktop.
