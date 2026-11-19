import { useCallback, useSyncExternalStore } from "react";
import { ONBOARDING_STEPS } from "@/features/onboarding/constants/steps";

const STORAGE_KEY = "tidewell_onboarding";
const listeners = new Set<() => void>();
let cache: string | null = null;

function read(): string {
	if (cache !== null) return cache;
	try {
		cache = localStorage.getItem(STORAGE_KEY) ?? "profile";
	} catch {
		cache = "profile";
	}
	return cache;
}

function write(ids: string[]) {
	cache = ids.join(",");
	try {
		localStorage.setItem(STORAGE_KEY, cache);
	} catch {}
	for (const listener of listeners) listener();
}

const subscribe = (listener: () => void) => {
	listeners.add(listener);
	return () => listeners.delete(listener);
};

/** Which getting-started steps are done. Kept in localStorage; a real app would store it per user. */
export function useOnboarding() {
	const raw = useSyncExternalStore(subscribe, read);
	const done = raw ? raw.split(",").filter(Boolean) : [];

	const complete = useCallback((id: string) => {
		const current = read().split(",").filter(Boolean);
		if (!current.includes(id)) write([...current, id]);
	}, []);
	const toggle = useCallback((id: string) => {
		const current = read().split(",").filter(Boolean);
		write(current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
	}, []);
	const reset = useCallback(() => write([]), []);

	return {
		steps: ONBOARDING_STEPS,
		done,
		completed: ONBOARDING_STEPS.filter((step) => done.includes(step.id)).length,
		total: ONBOARDING_STEPS.length,
		complete,
		toggle,
		reset,
	};
}
