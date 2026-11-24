---
title: How do you turn a portfolio into a phone you can use?
excerpt: A lock screen that opens with one tap, a home screen that is the menu, and a way home from every app.
tags: Design System, React, Tailwind CSS, Portfolio, TanStack
stack: React, TypeScript, TanStack Start, TanStack Router, React Query, Tailwind CSS, shadcn/ui, Radix UI, Zod, React Hook Form, Motion, Lucide, Vite, Turborepo, pnpm, Biome, Cloudflare Workers
publishedAt: 2026-11-19
lang: en
cover: https://haryarrahman.tech/posts/portfolio-as-a-phone/desktop-home-v2.jpg
share: https://haryarrahman.tech/og/portfolio-as-a-phone.png
---

*Template series, part 1 of 6. The code is in the repo.*

Short answer: make the portfolio move like a phone, but never make the visitor wait. The lock screen opens with one tap, the home screen is the menu, and every app always has a way home.

## What I built

A one-page portfolio shaped like a phone. Inside are projects, notes, experience and contact.

Try it: [phone.blog.haryarrahman.tech](https://phone.blog.haryarrahman.tech)

![The phone home screen on a laptop, with a short intro to its right](https://haryarrahman.tech/posts/portfolio-as-a-phone/desktop-home-v2.jpg)

*On a laptop: the phone on the left, a short intro on the right.*

## The lock screen must not get in the way

A lock screen makes the first second feel like a phone. But a real lock asks for a PIN, and visitors do not have one.

So this lock opens with one tap or a swipe up. Once it is open, it stays open for that visit. A link to a project skips it, so people see that project right away.

![Left: a locked phone asking for a PIN. Right: this template's lock screen, where a swipe up or a tap is enough](https://haryarrahman.tech/posts/portfolio-as-a-phone/lock-en.png)

*The left one stops people. The right one takes one move.*

## The home screen is the menu

A phone has no menu across the top like a website. Everything lives on the home screen.

But if it only has icons, people cannot tell whose it is. That is why the top is widgets: name, role and work status. The icons below open the rest, and the four that matter most sit in the dock.

![Left: a home screen with only icons. Right: widgets for name, status and numbers on top, then icons and the dock](https://haryarrahman.tech/posts/portfolio-as-a-phone/home-en.png)

*The same icons. The right one already introduces the person.*

## Every app always has a way home

A phone inside a browser makes it easy to get lost.

So every app opens from its icon and closes back into it. The back button at the top left and Esc go one step back. The home bar at the bottom, tapped or swiped up, goes straight home.

![Three screens: home, project list, project detail. Back or Esc goes one step back, the home bar goes straight home](https://haryarrahman.tech/posts/portfolio-as-a-phone/way-home-en.png)

*Two ways out: one step back, or straight home.*

## On a real phone, the frame disappears

On a laptop, a narrow screen with no body just looks like a small page. But on a phone, drawing a phone inside a phone is strange.

That is why the frame only exists on wide screens. On a laptop the phone stands beside a short intro and a CV button. On a real phone the frame disappears, and the screen becomes the phone itself.

![Left: on a laptop, the phone in a frame beside the intro. Right: on a real phone, the home screen fills the screen](https://haryarrahman.tech/posts/portfolio-as-a-phone/frame-en.png)

*The same page on two screens.*

## The rest stays simple

- **Every screen has its own link.** The open app is written into the address, so you can share it.
- **There is only one colour, green.** Text on it is always dark, so it stays easy to read.
- **Settings are remembered.** The theme, wallpaper and accent stay the same when you come back.

![The Projects app open, showing one project's detail inside the phone](https://haryarrahman.tech/posts/portfolio-as-a-phone/open-app-project-detail-v2.jpg)

*One project, opened from the Projects list.*

The lock screen idea came from a desktop-style portfolio by Parinaz Kassemi that I found on Awwwards. I only took the idea, not the name, the look or the icons.

## Conclusion

A portfolio shaped like a phone is easy to use when it moves like a phone but never gets in the way. It comes down to three things:

- A lock screen that opens with one move, and that a link skips.
- A home screen that introduces the person first, then works as the menu.
- A way home from every app, and a frame that only exists on wide screens.

## The numbers

| | Light | Dark |
|---|---|---|
| Background | `#FFFFFF` | `#121212` |
| Card | `#FFFFFF` | `#1E1E1E` |
| Gray | `#F5F5F5` | `#2E2E2E` |
| Line | `#E5E5E5` | `#3A3A3A` |
| Text | `#121212` | `#FFFFFF` |
| Label | `#6B6B6B` | `#B3B3B3` |
| Accent | `#1FB85A` | `#1FB85A` |
| Text on the accent | `#0E0E10` | `#0E0E10` |

The font is the system font. Body text is 15px, interface text 14px, page titles 24px.

## Use it yourself

The code is in [app-templates/apps/portfolio-phone](https://github.com/haryarrahman14/app-templates/tree/main/apps/portfolio-phone).

### Hand it to your AI

Want it as your own right away? Paste this into Claude Code, Cursor or any other agent in an empty folder:

```text
Set up a project from a template for me.

1. Clone https://github.com/haryarrahman14/app-templates
2. Read AGENTS.md at the repo root: it says where every change goes.
   docs/design-system.md has the colours, type and spacing.
3. I want the template in apps/portfolio-phone
   (live preview: https://phone.blog.haryarrahman.tech).
   Keep that folder and packages/ui and packages/content; remove the other apps.
4. Turn it into my portfolio.
   I am <your name>, <your role>. My projects and links: <paste them>. Accent colour: <a colour>.

Ask me for anything you need before you start. Then run it locally and show me.
```

[Part 2](https://haryarrahman.tech/blog/portfolio-as-a-laptop-desktop) is the same portfolio shaped like a laptop desktop.
