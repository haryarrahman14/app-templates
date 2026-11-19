export const APP_NAME = "Tidewell";
export const APP_TAGLINE = "The calm CRM for small teams";
export const WORKSPACE_NAME = "Fernhill Studio";

/** A route's `head` title: "Companies · Tidewell". */
export const pageTitle = (title: string) => ({ meta: [{ title: `${title} · ${APP_NAME}` }] });
