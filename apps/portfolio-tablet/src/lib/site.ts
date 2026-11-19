import { profile } from "@repo/content";

export const APP_NAME = `${profile.name} · Portfolio`;

/**
 * True on the Workers build: one static HTML file, rendered for bare `/`, is served for every URL. The first
 * client render must then ignore the search params (the HTML has none) and apply them right after hydration.
 * False on the Node build, where each request is rendered with its own search params.
 */
export const PRERENDERED: boolean = import.meta.env.PRERENDERED === true;

/** Browser UI colour for the status bar area on mobile browsers. */
export const THEME_COLOR = { light: "#eeeeee", dark: "#121212" };
