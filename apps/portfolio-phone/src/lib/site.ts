import { profile } from "@repo/content";

/** The default page title, before a route sets its own. */
export const APP_NAME = `${profile.name} · ${profile.headline}`;

/** One line for search results and link previews. */
export const APP_TAGLINE = `${profile.name}, ${profile.headline}. A portfolio you use like a phone: a lock screen, a home screen and apps.`;

/** Where this app is published. A link preview needs the full address of public/og.jpg (1200×630). */
export const SITE_URL = "https://phone.blog.haryarrahman.tech";
