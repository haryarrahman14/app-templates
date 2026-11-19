import { useEffect } from "react";
import { z } from "zod";
import { createLocalStore, useLocalStore } from "@/lib/local-store";

/** Wallpapers are flat CSS fields (see styles/app.css, `[data-wallpaper=…]`). Add one here and there. */
export const WALLPAPERS = [
	{ id: "gray", name: "Gray" },
	{ id: "pure", name: "Pure" },
	{ id: "aqua", name: "Aqua" },
] as const;

/** Accent options: aqua plus colours from the category set. Each feeds --tint in styles/app.css (`[data-accent=…]`). */
export const ACCENTS = [
	{ id: "aqua", name: "Aqua" },
	{ id: "blue", name: "Blue" },
	{ id: "orange", name: "Orange" },
	{ id: "teal", name: "Teal" },
] as const;

const WALLPAPER_IDS = WALLPAPERS.map((w) => w.id);
const ACCENT_IDS = ACCENTS.map((a) => a.id);

/** Ids from older palettes still in a visitor's localStorage are not in these enums and fall back to the defaults. */
export const preferencesSchema = z.object({
	wallpaper: z.enum(WALLPAPER_IDS).catch("gray"),
	accent: z.enum(ACCENT_IDS).catch("aqua"),
	/** "system" follows prefers-reduced-motion. */
	reduceMotion: z.enum(["system", "on", "off"]).catch("system"),
});

export type Preferences = z.infer<typeof preferencesSchema>;
export type WallpaperId = Preferences["wallpaper"];
export type AccentId = Preferences["accent"];

export const DEFAULT_PREFERENCES: Preferences = {
	wallpaper: "gray",
	accent: "aqua",
	reduceMotion: "system",
};

const STORAGE_KEY = "portfolio-tablet:preferences";

export const preferencesStore = createLocalStore(
	STORAGE_KEY,
	preferencesSchema,
	DEFAULT_PREFERENCES,
);

export function usePreferences() {
	const preferences = useLocalStore(preferencesStore);
	const update = (patch: Partial<Preferences>) =>
		preferencesStore.write((prev) => ({ ...prev, ...patch }));
	return { preferences, update };
}

/** Mirrors preferences onto <html data-*> so CSS (wallpaper, accent) follows them. */
export function useApplyPreferences() {
	const preferences = useLocalStore(preferencesStore);
	useEffect(() => {
		// The hydration pass sees the defaults; the inline head script has already applied the real values.
		if (preferences === preferencesStore.fallback) return;
		const root = document.documentElement;
		root.dataset.wallpaper = preferences.wallpaper;
		root.dataset.accent = preferences.accent;
		root.dataset.reduceMotion = preferences.reduceMotion;
	}, [preferences]);
	return preferences;
}

/**
 * Inline in <head>: applies stored wallpaper and accent before first paint (no flash). Unknown ids
 * (older palettes) fall back to the defaults, like the schema.
 */
export const preferencesScript = `(()=>{try{var p=JSON.parse(localStorage.getItem(${JSON.stringify(STORAGE_KEY)})||"{}"),e=document.documentElement,w=${JSON.stringify(WALLPAPER_IDS)},a=${JSON.stringify(ACCENT_IDS)};e.dataset.wallpaper=w.indexOf(p.wallpaper)>-1?p.wallpaper:${JSON.stringify(DEFAULT_PREFERENCES.wallpaper)};e.dataset.accent=a.indexOf(p.accent)>-1?p.accent:${JSON.stringify(DEFAULT_PREFERENCES.accent)};if(typeof p.reduceMotion==="string")e.dataset.reduceMotion=p.reduceMotion}catch(_){}})()`;
