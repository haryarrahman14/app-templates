export const APP_NAME = "Tidewell";
export const APP_TAGLINE = "The calm CRM for small teams";
export const WORKSPACE_NAME = "Fernhill Studio";

/** A route's `head` title: "Companies · Tidewell". */
export const pageTitle = (title: string) => ({ meta: [{ title: `${title} · ${APP_NAME}` }] });

/** Where this app is published. A link preview needs the full address of public/og.jpg (1200×630). */
export const SITE_URL = "https://tidewell.blog.haryarrahman.tech";
