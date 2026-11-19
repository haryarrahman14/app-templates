import { useSyncExternalStore } from "react";
import {
	DEFAULT_PREFERENCES,
	PREFERENCES_KEY,
	type Preferences,
	preferencesSchema,
} from "@/lib/preferences-schema";

const listeners = new Set<() => void>();
let current: Preferences | null = null;

function load(): Preferences {
	if (current) return current;
	try {
		const raw = localStorage.getItem(PREFERENCES_KEY);
		current = raw
			? preferencesSchema.parse({ ...DEFAULT_PREFERENCES, ...JSON.parse(raw) })
			: DEFAULT_PREFERENCES;
	} catch {
		current = DEFAULT_PREFERENCES;
	}
	return current;
}

export function applyAccent(accent: Preferences["accent"]) {
	const root = document.documentElement;
	if (accent === "amber") delete root.dataset.accent;
	else root.dataset.accent = accent;
}

export function setPreferences(patch: Partial<Preferences>) {
	current = { ...load(), ...patch };
	try {
		localStorage.setItem(PREFERENCES_KEY, JSON.stringify(current));
	} catch {}
	applyAccent(current.accent);
	for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
	listeners.add(listener);
	return () => listeners.delete(listener);
}

export function usePreferences() {
	return useSyncExternalStore(subscribe, load);
}

export type { Preferences };
