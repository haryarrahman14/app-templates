---
title: What does a documents workspace template need?
excerpt: Documents that are easy to find, a page that saves itself with its tools beside it, and one colour used like a highlighter.
tags: Design System, React, Tailwind CSS, TanStack, Web App
stack: React, TypeScript, TanStack Start, TanStack Router, React Query, TanStack Table, Tailwind CSS, shadcn/ui, Radix UI, Zod, React Hook Form, Motion, Lucide, Vite, Turborepo, pnpm, Biome, Cloudflare Workers
publishedAt: 2026-11-19
lang: en
cover: https://haryarrahman.tech/posts/documents-workspace-template/docs-grid-v2.jpg
share: https://haryarrahman.tech/og/documents-workspace-template.png
---

*Template series, part 4 of 6. The code is in the repo.*

Short answer: three things. Documents have to be easy to find. Writing has to feel like a page, with its tools beside it. And the colour must not get in the way of reading, so the buttons are black and the only colour is a highlighter yellow.

## What I made

Paperwren, a sample documents workspace. It has folders, documents, an editor, tasks and a calendar. Every name, person and piece of content is made up.

Try it: [paperwren.blog.haryarrahman.tech](https://paperwren.blog.haryarrahman.tech)

![The Paperwren home: a sidebar with folders and tags, recently edited documents and a grid of documents](https://haryarrahman.tech/posts/documents-workspace-template/docs-grid-v2.jpg)

*The home page. The open item is marked yellow.*

## People look for documents in different ways

Some remember the folder. Some like to look around. Some only remember one word from the title.

So there are three ways in. Folders and tags sit in the sidebar. All documents show as a grid or a table. If you remember the name, type it in search or press ⌘K.

![Three panels: folders and tags in the sidebar, documents in a grid, and a search box with ⌘K](https://haryarrahman.tech/posts/documents-workspace-template/find-en.png)

*Three ways to the same document.*

## Writing should feel like a page, not a form

A form has fixed fields and a Save button. Forget to click it and the writing is gone.

Here a document is a page made of blocks: text, headings, to-dos, quotes and callouts. Type "/" to pick a block. There is no Save button: the page saves by itself as soon as you stop typing, and when you leave the page.

![Left: a form with a title field, a body field and a Save button. Right: a page of blocks with the "/" menu and the word Saved](https://haryarrahman.tech/posts/documents-workspace-template/save-en.png)

*The left one waits for a click. The right one is already saved.*

## The tools for writing sit beside the page

If the settings live on another screen, you have to leave your writing to change one small thing.

So everything sits beside it. On the left is the outline, built from the headings in the document. Click one to jump there. On the right are three tabs: style for the font and text width, info for the folder and tags, and comments.

![Left: the document and its settings on two separate screens. Right: the outline, the document and the style panel on one screen](https://haryarrahman.tech/posts/documents-workspace-template/side-en.png)

*The page stays in the middle. The tools stay at the edges.*

## There is one colour, used like a highlighter

A documents app is mostly writing. If buttons and menus are coloured too, your eyes get pulled everywhere.

That is why the buttons are black. Yellow goes only where you would use a highlighter: selected text, the open item and checked to-dos. But yellow is never the colour of text, because it is hard to read on white.

![The same screen twice. Left: a purple menu item, a blue button and coloured words. Right: a black button, and yellow only on the open item, the selected text and the checked to-do](https://haryarrahman.tech/posts/documents-workspace-template/colour-en.png)

*The same screen. On the right, the writing is what you see first.*

## The rest sits around the documents

- **Tasks and a calendar.** A task can be linked to a document, and it shows up as a dot on the calendar.
- **Sharing.** Invite people to view, comment or edit. Or export the document as Markdown.
- **Trash.** A deleted document can still be restored.

![A document open with the outline on the left and the Style tab on the right](https://haryarrahman.tech/posts/documents-workspace-template/document-inspector-v2.jpg)

*One document, with its tools on both sides.*

The layout, a sidebar, a grid of documents and a page with a panel beside it, came from Craft, through its screens on Mobbin. I took only the idea, not the name, logo, icons or colours.

## Conclusion

A documents workspace that feels good to use is one that stays out of the way of the writing. Three things do it:

- Three ways to find a document.
- A page of blocks that saves itself, with its tools beside it.
- Black buttons and one colour, used like a highlighter.

## The numbers

| | Light | Dark |
|---|---|---|
| Background | `#FAFAFA` | `#111111` |
| Card | `#FFFFFF` | `#1A1A1A` |
| Border | `#EAEAEA` | `#2E2E2E` |
| Text | `#1A1A1A` | `#FAFAFA` |
| Label | `#6B6B6B` | `#A0A0A0` |
| Button | `#1A1A1A` | `#FAFAFA` |
| Highlighter | `#FFC61A` | `#FFC61A` |
| Marks on the highlighter | `#1A1A1A` | `#1A1A1A` |

The font is the system font. Menus and tables are 14 to 15px, document text is 16px, page titles are 24 to 30px.

## Use it yourself

The code is in [app-templates/apps/app-workspace](https://github.com/haryarrahman14/app-templates/tree/main/apps/app-workspace).

### Hand it to your AI

Want it to be yours right away? Paste this into Claude Code, Cursor or another agent in an empty folder:

```text
Set up a project from a template for me.

1. Clone https://github.com/haryarrahman14/app-templates
2. Read AGENTS.md at the repo root: it says where every change goes.
   docs/design-system.md has the colours, type and spacing.
3. I want the template in apps/app-workspace
   (live preview: https://paperwren.blog.haryarrahman.tech).
   Keep that folder and packages/ui; remove the other apps.
4. Turn it into my app.
   Name: <your product>. What it does: <one line>. Accent colour: <a colour>.

Ask me for anything you need before you start. Then run it locally and show me.
```

[Part 5](https://haryarrahman.tech/blog/crm-admin-template) is Tidewell, a business admin built around data tables.
