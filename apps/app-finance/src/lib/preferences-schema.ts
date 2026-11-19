import { z } from "zod";

/**
 * Display preferences (Settings → Appearance), kept in localStorage. Read with `usePreferences()`.
 */
export const preferencesSchema = z.object({
	/** "amber" is the default. Ids from older versions ("green", "orange", …) fall back to it. */
	accent: z.enum(["amber", "blue", "teal"]).catch("amber"),
	numberLocale: z.enum(["en-US", "de-DE", "fr-CH", "en-IN"]),
	compactNumbers: z.boolean(),
	currency: z.enum(["USD", "EUR", "GBP", "CHF"]),
});
export type Preferences = z.infer<typeof preferencesSchema>;

export const PREFERENCES_KEY = "ledgerfinch.preferences";

export const DEFAULT_PREFERENCES: Preferences = {
	accent: "amber",
	numberLocale: "en-US",
	compactNumbers: false,
	currency: "USD",
};

/** Inline in <head> so the stored accent applies before paint. */
export const accentScript = `(()=>{try{var p=JSON.parse(localStorage.getItem(${JSON.stringify(PREFERENCES_KEY)})||"{}");if(p.accent==="blue"||p.accent==="teal")document.documentElement.dataset.accent=p.accent}catch(_){}})()`;
