/** Fictional product. Rename here; it is used in titles, the sidebar and auth pages. */
export const APP_NAME = "Paperwren";
export const APP_TAGLINE = "A calm place for your team's documents, tasks and plans.";

/** "Tasks · Paperwren": the title for one screen. */
export const pageTitle = (name: string) => ({ meta: [{ title: `${name} · ${APP_NAME}` }] });

/** Where this app is published. A link preview needs the full address of public/og.jpg (1200×630). */
export const SITE_URL = "https://paperwren.blog.haryarrahman.tech";
