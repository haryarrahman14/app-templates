/** Accent and density preferences, kept in localStorage and applied to <html> before paint. */
/**
 * The app accent (highlighter yellow) plus colours from the category set. Every option carries the
 * dark #1A1A1A glyph, and none is ever used as text: links stay ink.
 */
export const ACCENTS = {
	yellow: { label: "Highlighter", light: "#FFC61A", dark: "#FFC61A" },
	green: { label: "Green", light: "#34C759", dark: "#34C759" },
	orange: { label: "Orange", light: "#FF9500", dark: "#FF9500" },
	teal: { label: "Teal", light: "#30B0C7", dark: "#30B0C7" },
} as const;

/** Accent ids from earlier palettes that may still sit in localStorage. */
const LEGACY_ACCENTS: Record<string, Accent> = {
	sky: "yellow",
	blue: "yellow",
	ocean: "yellow",
	ochre: "yellow",
	plum: "yellow",
	amber: "yellow",
	terracotta: "yellow",
	rose: "yellow",
	sage: "green",
};

export type Accent = keyof typeof ACCENTS;
export type Density = "comfortable" | "compact";

export const DEFAULT_ACCENT: Accent = "yellow";

const ACCENT_KEY = "workspace-accent";
const DENSITY_KEY = "workspace-density";

export const isAccent = (value: unknown): value is Accent =>
	typeof value === "string" && value in ACCENTS;

const toAccent = (value: string | null): Accent =>
	isAccent(value) ? value : (LEGACY_ACCENTS[value ?? ""] ?? DEFAULT_ACCENT);

/** Inline in <head> (no flash). Mirrors `applyAppearance` below. */
export const appearanceScript = `(()=>{try{var a=${JSON.stringify(ACCENTS)};var l=${JSON.stringify(LEGACY_ACCENTS)};var k=localStorage.getItem("${ACCENT_KEY}");if(k&&l[k])k=l[k];var e=document.documentElement;if(k&&a[k]){e.style.setProperty("--accent-light",a[k].light);e.style.setProperty("--accent-dark",a[k].dark)}var d=localStorage.getItem("${DENSITY_KEY}");if(d)e.dataset.density=d}catch(_){}})()`;

export function readAppearance(): { accent: Accent; density: Density } {
	try {
		const accent = localStorage.getItem(ACCENT_KEY);
		const density = localStorage.getItem(DENSITY_KEY);
		return {
			accent: toAccent(accent),
			density: density === "compact" ? "compact" : "comfortable",
		};
	} catch {
		return { accent: DEFAULT_ACCENT, density: "comfortable" };
	}
}

export function applyAppearance({ accent, density }: { accent: Accent; density: Density }) {
	const root = document.documentElement;
	root.style.setProperty("--accent-light", ACCENTS[accent].light);
	root.style.setProperty("--accent-dark", ACCENTS[accent].dark);
	root.dataset.density = density;
	try {
		localStorage.setItem(ACCENT_KEY, accent);
		localStorage.setItem(DENSITY_KEY, density);
	} catch {}
}
