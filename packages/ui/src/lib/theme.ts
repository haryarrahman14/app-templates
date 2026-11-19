/** Framework-free theme logic. Safe to import from server code: no React here. */
export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";

const DARK_QUERY = "(prefers-color-scheme: dark)";

/**
 * Inline this in <head> before paint so the first frame already has the right theme (no flash).
 * `defaultTheme` applies until the visitor picks one; it is kept on <html data-theme-default>.
 */
export const themeScript = (defaultTheme: Theme = "system") =>
	`(()=>{try{var e=document.documentElement;e.dataset.themeDefault=${JSON.stringify(defaultTheme)};var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)})||${JSON.stringify(defaultTheme)};var d=t==="dark"||(t==="system"&&matchMedia(${JSON.stringify(DARK_QUERY)}).matches);e.classList.toggle("dark",d);e.style.colorScheme=d?"dark":"light"}catch(_){}})()`;

const isTheme = (value: unknown): value is Theme =>
	value === "light" || value === "dark" || value === "system";

export function readTheme(): Theme {
	let stored: string | null = null;
	try {
		stored = localStorage.getItem(THEME_STORAGE_KEY);
	} catch {}
	if (isTheme(stored)) return stored;
	const fallback = document.documentElement.dataset.themeDefault;
	return isTheme(fallback) ? fallback : "system";
}

export const resolveTheme = (theme: Theme): ResolvedTheme =>
	theme === "system" ? (matchMedia(DARK_QUERY).matches ? "dark" : "light") : theme;

export function applyTheme(theme: Theme) {
	const resolved = resolveTheme(theme);
	const root = document.documentElement;
	root.classList.toggle("dark", resolved === "dark");
	root.style.colorScheme = resolved;
}

export function setTheme(theme: Theme) {
	try {
		localStorage.setItem(THEME_STORAGE_KEY, theme);
	} catch {}
	applyTheme(theme);
}

/** Calls `onChange` when the theme may have changed: class flip, another tab, or the OS setting. */
export function subscribeTheme(onChange: () => void) {
	const observer = new MutationObserver(onChange);
	observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
	const media = matchMedia(DARK_QUERY);
	const onMedia = () => {
		if (readTheme() === "system") applyTheme("system");
	};
	const onStorage = (event: StorageEvent) => {
		if (event.key === THEME_STORAGE_KEY) applyTheme(readTheme());
	};
	media.addEventListener("change", onMedia);
	window.addEventListener("storage", onStorage);
	return () => {
		observer.disconnect();
		media.removeEventListener("change", onMedia);
		window.removeEventListener("storage", onStorage);
	};
}
