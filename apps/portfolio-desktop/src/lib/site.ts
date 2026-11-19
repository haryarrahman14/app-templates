import { profile } from "@repo/content";

/** The default page title, before the profile query sets its own. */
export const APP_NAME = `${profile.name} · Portfolio`;

/** One line for search results and link previews. */
export const APP_TAGLINE = `${profile.name}, ${profile.headline}. A portfolio you use like a laptop desktop: windows, a dock, widgets and notes.`;

/** Where this app is published. A link preview needs the full address of public/og.jpg (1200×630). */
export const SITE_URL = "https://desktop.blog.haryarrahman.tech";
