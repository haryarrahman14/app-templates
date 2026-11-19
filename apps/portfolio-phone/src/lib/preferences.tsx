import { MotionConfig } from "motion/react";
import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { z } from "zod";

/**
 * Wallpapers are CSS in `styles/app.css` (`[data-wallpaper="…"]`); add one there and here.
 * All are flat fields: the neutral default, the accent, black and white.
 */
export const WALLPAPERS = [
	{ id: "plain", label: "Plain" },
	{ id: "green", label: "Green" },
	{ id: "black", label: "Black" },
	{ id: "white", label: "White" },
] as const;

/**
 * The app accent (green) plus colours from the category set. The `--tint` values live in
 * `styles/app.css` (`[data-accent="…"]`); `swatch` repeats them for the picker.
 */
export const ACCENTS = [
	{ id: "green", label: "Green", swatch: { light: "#1FB85A", dark: "#1FB85A" } },
	{ id: "blue", label: "Blue", swatch: { light: "#007AFF", dark: "#007AFF" } },
	{ id: "teal", label: "Teal", swatch: { light: "#30B0C7", dark: "#30B0C7" } },
	{ id: "red", label: "Red", swatch: { light: "#FF3B30", dark: "#FF3B30" } },
] as const;

/** Unknown ids (e.g. from an older palette, still in localStorage) fall back to the defaults. */
const preferencesSchema = z.object({
	wallpaper: z.enum(WALLPAPERS.map((w) => w.id)).catch("plain"),
	accent: z.enum(ACCENTS.map((a) => a.id)).catch("green"),
	reduceMotion: z.boolean().catch(false),
});

export type Preferences = z.infer<typeof preferencesSchema>;

export const DEFAULT_PREFERENCES: Preferences = {
	wallpaper: "plain",
	accent: "green",
	reduceMotion: false,
};
const STORAGE_KEY = "phone:preferences";
export const UNLOCK_KEY = "phone:unlocked";

function apply(prefs: Preferences) {
	const root = document.documentElement;
	root.dataset.wallpaper = prefs.wallpaper;
	root.dataset.accent = prefs.accent;
	root.toggleAttribute("data-reduce-motion", prefs.reduceMotion);
}

/**
 * Inline in <head>: applies saved wallpaper/accent/motion and the session's unlock before
 * first paint, so a returning visitor never sees a flash of the defaults or the lock screen.
 * Ids that are no longer offered fall back to the defaults.
 */
export const preferencesScript = `(()=>{try{var r=document.documentElement,p=JSON.parse(localStorage.getItem(${JSON.stringify(STORAGE_KEY)})||"{}"),w=${JSON.stringify(WALLPAPERS.map((w) => w.id))},a=${JSON.stringify(ACCENTS.map((a) => a.id))};r.dataset.wallpaper=w.indexOf(p.wallpaper)>-1?p.wallpaper:${JSON.stringify(DEFAULT_PREFERENCES.wallpaper)};r.dataset.accent=a.indexOf(p.accent)>-1?p.accent:${JSON.stringify(DEFAULT_PREFERENCES.accent)};if(p.reduceMotion)r.setAttribute("data-reduce-motion","");if(sessionStorage.getItem(${JSON.stringify(UNLOCK_KEY)}))r.dataset.unlocked=""}catch(_){}})()`;

type PreferencesContext = Preferences & {
	update: (patch: Partial<Preferences>) => void;
};

const Context = createContext<PreferencesContext | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
	const [prefs, setPrefs] = useState<Preferences>(DEFAULT_PREFERENCES);

	useEffect(() => {
		try {
			const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
			setPrefs(preferencesSchema.parse({ ...DEFAULT_PREFERENCES, ...saved }));
		} catch {}
	}, []);

	const update = useCallback((patch: Partial<Preferences>) => {
		setPrefs((current) => {
			const next = { ...current, ...patch };
			apply(next);
			try {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
			} catch {}
			return next;
		});
	}, []);

	return (
		<Context value={{ ...prefs, update }}>
			<MotionConfig reducedMotion={prefs.reduceMotion ? "always" : "user"}>{children}</MotionConfig>
		</Context>
	);
}

export function usePreferences() {
	const context = useContext(Context);
	if (!context) throw new Error("usePreferences needs <PreferencesProvider>");
	return context;
}
