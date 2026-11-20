---
title: What goes into a CRM admin template?
excerpt: Mostly tables, ones you can narrow, act on many rows at once, and open a page from every row.
tags: Design System, React, Tailwind CSS, TanStack, Web App
stack: React, TypeScript, TanStack Start, TanStack Router, React Query, TanStack Table, Recharts, Tailwind CSS, shadcn/ui, Radix UI, Zod, React Hook Form, Motion, Lucide, Vite, Turborepo, pnpm, Biome, Cloudflare Workers
publishedAt: 2026-11-19
lang: en
cover: https://haryarrahman.tech/posts/crm-admin-template/companies-v2.jpg
share: https://haryarrahman.tech/og/crm-admin-template.png
---

*Template series, part 5 of 6. The code is in the repo.*

Short answer: mostly tables. You can narrow them, act on many rows at once, and open a page from any row. Deals are a board, and almost everything is white and gray.

## What I built

Tidewell, a sample CRM admin. It has companies, people, a deals board, tasks, notes and reports. All the names are made up.

Try it: [tidewell.blog.haryarrahman.tech](https://tidewell.blog.haryarrahman.tech)

![The Tidewell companies table with views, columns, filters, status pills and owners](https://haryarrahman.tech/posts/crm-admin-template/companies-v2.jpg)

*The list of companies. Almost the only blue is the New company button.*

## A long table has to be narrowed

A list of companies gets long fast, and scrolling for one name is tiring.

So the table has a search box, views like My companies, and filters. Each filter is a chip that reads like a sentence, for example "Status is Customer". Each column can be sorted too.

![Left: a long list of companies with no filter. Right: the same list with the chip Status is Customer, down to three rows](https://haryarrahman.tech/posts/crm-admin-template/narrow-en.png)

*One chip, and only the customers are left.*

## Many rows can be handled at once

Sometimes many rows need the same change. One by one is slow.

So every row has a checkbox. Tick one and a bar appears with Assign, Add to list, Email and Delete. What you pick applies to every ticked row.

![Left: the owner changed on a single row. Right: three rows ticked and the action bar below them](https://haryarrahman.tech/posts/crm-admin-template/bulk-en.png)

*Three rows ticked, one bar for all three.*

## Deals are stages, not a list

A deal moves from Lead to Won or Lost. In a table, that stage is just a word in a column.

So deals sit on a board. Each stage is a column with its total, and you move a deal by dragging its card. The table view is still there.

![Left: deals as a list with a stage column. Right: deals as a board with Lead, Qualified and Proposal columns, one card being dragged](https://haryarrahman.tech/posts/crm-admin-template/board-en.png)

*The dragged card changes stage, and the column totals change with it.*

## Colour only where it means something

A CRM table is full of names, numbers and statuses. If buttons and avatars are coloured too, your eye does not know where to look.

So almost everything is white and gray. One blue marks what you can click, like the main button and links. Avatars stay gray. Other colours only tell things apart, like the small status pills.

![Left: buttons and avatars in many colours. Right: the same table with one blue button and gray avatars](https://haryarrahman.tech/posts/crm-admin-template/colour-en.png)

*The same table. On the right, what matters stands out.*

## The rest follows the table

- **The table is built once.** Companies, people and the deals table use it, so they all work the same way.
- **Every row opens its own page**, with the notes, tasks, deals and activity for that company or person.
- **The rest sits around it**: home, tasks, notes, reports, settings, and search with ⌘K.

![The deals board with Lead, Qualified and Proposal columns, each card showing value, date and owner](https://haryarrahman.tech/posts/crm-admin-template/deals-board-v2.jpg)

*The real deals board. Each stage has its own dot colour; the New deal button is blue.*

The layout came from Attio, through its screens on Mobbin: a grouped sidebar, wide tables, and a page for each company and person. I only took the idea, not the name, logo, icons or colours.

## Conclusion

A CRM admin template is mostly tables, made easy in three ways:

- Tables you can narrow, and act on many rows at once.
- A board for deals, because deals move between stages.
- One blue for actions, and other colours only to tell things apart.

## The numbers

| | Light | Dark |
|---|---|---|
| Background | `#FFFFFF` | `#0F0F0F` |
| Sidebar | `#FAFAFA` | `#141414` |
| Border | `#EBEBEB` | `#2A2A2A` |
| Text | `#141414` | `#F5F5F5` |
| Label | `#737373` | `#9A9A9A` |
| Action | `#2450E6` | `#2450E6` |
| Link | `#2450E6` | `#8FA5FF` |
| Avatar | `#EAEAEA` | `#2A2A2A` |
| Status | `#34C759` `#FF9500` `#FF3B30` `#8E8E93` | same |

The font is the system's built-in font. Body text is 15px, tables and buttons 14px, titles 20 to 24px.

## Use it yourself

The code is in [app-templates/apps/app-crm](https://github.com/haryarrahman14/app-templates/tree/main/apps/app-crm).

### Hand it to your AI

Want it as your own right away? Paste this into Claude Code, Cursor or any other agent in an empty folder:

```text
Set up a project from a template for me.

1. Clone https://github.com/haryarrahman14/app-templates
2. Read AGENTS.md at the repo root: it says where every change goes.
   docs/design-system.md has the colours, type and spacing.
3. I want the template in apps/app-crm
   (live preview: https://tidewell.blog.haryarrahman.tech).
   Keep that folder and packages/ui; remove the other apps.
4. Turn it into my app.
   Name: <your product>. What it does: <one line>. Accent colour: <a colour>.

Ask me for anything you need before you start. Then run it locally and show me.
```

[Part 6](https://haryarrahman.tech/blog/dark-finance-dashboard-template) is Ledgerfinch, a finance dashboard that starts in dark mode.
