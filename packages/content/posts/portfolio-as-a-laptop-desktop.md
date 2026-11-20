---
title: How do you build a portfolio that looks like a laptop desktop?
excerpt: Each part of the portfolio opens as a window, links still work, and only one colour marks the main button.
tags: Design System, React, Tailwind CSS, Portfolio, TanStack
stack: React, TypeScript, TanStack Start, TanStack Router, React Query, Tailwind CSS, shadcn/ui, Radix UI, Zod, React Hook Form, Motion, Lucide, Vite, Turborepo, pnpm, Biome, Cloudflare Workers
publishedAt: 2026-11-19
lang: en
cover: https://haryarrahman.tech/posts/portfolio-as-a-laptop-desktop/desktop-light-v2.jpg
share: https://haryarrahman.tech/og/portfolio-as-a-laptop-desktop.png
---

*Template series, part 1 of 6. The code is in the repo.*

Short answer: make each part of the portfolio a window, not one long page. The window in front is written in the address, so links can still be shared. The colours are white and gray, and only one colour, tomato, is for the main button.

## What I built

A sample portfolio shaped like a laptop desktop. There is a menu bar at the top, a dock at the bottom and widgets on the side. About, Projects, Notes, Experience and Contact each have their own window.

Try it: [desktop.blog.haryarrahman.tech](https://desktop.blog.haryarrahman.tech)

![The desktop in light mode with the Welcome and Projects windows open, widgets on the right and the dock at the bottom](https://haryarrahman.tech/posts/portfolio-as-a-laptop-desktop/desktop-light-v2.jpg)

*Two windows open. The one in front has the deeper shadow.*

## Windows, not one long page

A normal portfolio is one long page. To see Projects, you scroll first.

Here each part opens as a window. Click its icon in the dock, and the window comes to the front. You can drag windows, resize them and stack them. The menu bar and the terminal inside open the same windows too.

![Left: one long page, with Projects far down. Right: the Projects window in front of the Welcome window, with the dock below](https://haryarrahman.tech/posts/portfolio-as-a-laptop-desktop/windows-en.png)

*The part you want is right in front.*

## But a link still has to work

A portfolio usually gets shared as a link. But a window has no address of its own.

That is why the window in front is written in the address. Send a link ending in `?app=projects`, and Projects opens in front.

![Left: an address ending in ?app=projects. Right: the desktop that opens, with Projects in front](https://haryarrahman.tech/posts/portfolio-as-a-laptop-desktop/link-en.png)

*The same link always opens the same window.*

## One colour for the main button

A desktop shows a lot at once: windows, icons, widgets, a dock. If everything has a colour, nothing stands out.

So the surface is only white and gray. Tomato is for the main button, links and whatever is selected. Your eye knows where to go at once.

![Left: a contact form in many colours. Right: the same form in white and gray, with one tomato button](https://haryarrahman.tech/posts/portfolio-as-a-laptop-desktop/accent-en.png)

*The same form. On the right you see the button at once.*

## The rest stays simple

- **On a phone, windows become full sheets.** There is no room to drag windows. So each window is as wide as the screen, and the dock becomes a bar at the bottom.
- **Icons get solid colours.** Each app has its own colour, so you can tell them apart at a glance. Only Welcome uses tomato, because that is where you start.
- **It stays one static page.** The page is already a file after the build. So it opens like a plain file, with no code running on a server.

![Notes open as a full-width sheet on a phone, with the dock as a bar at the bottom](https://haryarrahman.tech/posts/portfolio-as-a-laptop-desktop/phone-notes-light-v2.jpg)

*On a phone, the Notes window is as wide as the screen.*

The idea came from a desktop-style portfolio on Awwwards, Roberto Izquierdo's "RI/OS". I took only the idea, not the name, the look or the icons.

## Conclusion

A desktop portfolio is not about looking like a laptop. It comes down to three things:

- Each part is a window, not a slice of one long page.
- The window in front is in the address, so links still work.
- One colour for the main button, and white and gray for the rest.

## The numbers

| | Light | Dark |
|---|---|---|
| Background | `#FFFFFF` | `#121212` |
| Card | `#FFFFFF` | `#1E1E1E` |
| Gray | `#F7F7F7` | `#2A2A2A` |
| Border | `#DDDDDD` | `#3A3A3A` |
| Text | `#222222` | `#FFFFFF` |
| Label | `#6A6A6A` | `#B0B0B0` |
| Tomato | `#E5432D` | `#E5432D` |

The font is the system font. Body text is 15px, menus and buttons 14px, headings 20 to 24px.

## Use it yourself

The code is in [app-templates/apps/portfolio-desktop](https://github.com/haryarrahman14/app-templates/tree/main/apps/portfolio-desktop).

### Hand it to your AI

Want it as your own right away? Paste this into Claude Code, Cursor or any other agent in an empty folder:

```text
Set up a project from a template for me.

1. Clone https://github.com/haryarrahman14/app-templates
2. Read AGENTS.md at the repo root: it says where every change goes.
   docs/design-system.md has the colours, type and spacing.
3. I want the template in apps/portfolio-desktop
   (live preview: https://desktop.blog.haryarrahman.tech).
   Keep that folder and packages/ui and packages/content; remove the other apps.
4. Turn it into my portfolio.
   I am <your name>, <your role>. My projects and links: <paste them>. Accent colour: <a colour>.

Ask me for anything you need before you start. Then run it locally and show me.
```

[Part 2](https://haryarrahman.tech/blog/portfolio-as-a-phone) is the same portfolio shaped like a phone.
