import { MotionConfig } from "motion/react";
import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { z } from "zod";

/** Wallpapers are flat fills: pure neutral grays, plain white/black and one accent field. One value for light, one for dark. */
export const WALLPAPERS = [
	{ id: "gray", name: "Gray", light: "#f7f7f7", dark: "#121212" },
	{ id: "silver", name: "Silver", light: "#dddddd", dark: "#2a2a2a" },
	{ id: "plain", name: "Plain", light: "#ffffff", dark: "#000000" },
	{ id: "tomato", name: "Tomato", light: "#e5432d", dark: "#e5432d" },
] as const;

/** The app accent (tomato) plus colours from the shared category set. `foreground` is the text colour on it.
 * `null` keeps the tomato default from styles/app.css. */
export const ACCENTS = [
	{ id: "tomato", name: "Tomato", value: null, swatch: "#e5432d" },
	{
		id: "blue",
		name: "Blue",
		value: { color: "#007aff", foreground: "#ffffff" },
		swatch: "#007aff",
	},
	{
		id: "teal",
		name: "Teal",
		value: { color: "#30b0c7", foreground: "#1c1c1e" },
		swatch: "#30b0c7",
	},
	{
		id: "green",
		name: "Green",
		value: { color: "#34c759", foreground: "#1c1c1e" },
		swatch: "#34c759",
	},
	{
		id: "orange",
		name: "Orange",
		value: { color: "#ff9500", foreground: "#1c1c1e" },
		swatch: "#ff9500",
	},
] as const;

const preferencesSchema = z.object({
	wallpaper: z.enum(WALLPAPERS.map((w) => w.id) as [string, ...string[]]).catch("gray"),
	accent: z.enum(ACCENTS.map((a) => a.id) as [string, ...string[]]).catch("tomato"),
	reduceMotion: z.boolean().catch(false),
});

export type Preferences = z.infer<typeof preferencesSchema>;

const DEFAULTS: Preferences = { wallpaper: "gray", accent: "tomato", reduceMotion: false };
const STORAGE_KEY = "desktop-preferences";

const wallpaperColors = Object.fromEntries(WALLPAPERS.map((w) => [w.id, [w.light, w.dark]]));
const accentColors = Object.fromEntries(ACCENTS.flatMap((a) => (a.value ? [[a.id, a.value]] : [])));

/**
 * Inline this in <head> before paint, like themeScript, so a saved wallpaper, accent or reduce motion is already
 * on the first frame. React only reads saved choices after hydration (the page is prerendered with the defaults).
 */
export const preferencesScript = `(()=>{try{var p=JSON.parse(localStorage.getItem(${JSON.stringify(STORAGE_KEY)})||"{}"),r=document.documentElement,s=r.style,w=${JSON.stringify(wallpaperColors)}[p.wallpaper],a=${JSON.stringify(accentColors)}[p.accent];if(w){s.setProperty("--wallpaper-light",w[0]);s.setProperty("--wallpaper-dark",w[1])}if(a){s.setProperty("--user-tint-light",a.color);s.setProperty("--user-tint-dark",a.color);s.setProperty("--user-tint-foreground",a.foreground)}if(p.reduceMotion===true)r.classList.add("reduce-motion")}catch(_){}})()`;

type PreferencesContextValue = Preferences & {
	set: (patch: Partial<Preferences>) => void;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
	const [prefs, setPrefs] = useState<Preferences>(DEFAULTS);

	// Read saved choices after hydration so server and first client render match.
	useEffect(() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) setPrefs(preferencesSchema.parse(JSON.parse(raw)));
		} catch {}
	}, []);

	useEffect(() => {
		const root = document.documentElement;
		const wallpaper = WALLPAPERS.find((w) => w.id === prefs.wallpaper) ?? WALLPAPERS[0];
		root.style.setProperty("--wallpaper-light", wallpaper.light);
		root.style.setProperty("--wallpaper-dark", wallpaper.dark);
		const accent = ACCENTS.find((a) => a.id === prefs.accent);
		if (accent?.value) {
			root.style.setProperty("--user-tint-light", accent.value.color);
			root.style.setProperty("--user-tint-dark", accent.value.color);
			root.style.setProperty("--user-tint-foreground", accent.value.foreground);
		} else {
			root.style.removeProperty("--user-tint-light");
			root.style.removeProperty("--user-tint-dark");
			root.style.removeProperty("--user-tint-foreground");
		}
		root.classList.toggle("reduce-motion", prefs.reduceMotion);
	}, [prefs.wallpaper, prefs.accent, prefs.reduceMotion]);

	const value = useMemo<PreferencesContextValue>(
		() => ({
			...prefs,
			set: (patch) =>
				setPrefs((current) => {
					const next = { ...current, ...patch };
					try {
						localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
					} catch {}
					return next;
				}),
		}),
		[prefs],
	);

	return (
		<PreferencesContext.Provider value={value}>
			<MotionConfig reducedMotion={prefs.reduceMotion ? "always" : "user"}>{children}</MotionConfig>
		</PreferencesContext.Provider>
	);
}

export function usePreferences() {
	const value = useContext(PreferencesContext);
	if (!value) throw new Error("usePreferences must be used inside PreferencesProvider");
	return value;
}
