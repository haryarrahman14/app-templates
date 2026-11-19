import { useSyncExternalStore } from "react";
import type { z } from "zod";

/**
 * A tiny localStorage-backed store. Reads are validated with zod; anything invalid falls back to the default.
 * The server (and the hydration pass) always sees the fallback, so markup never mismatches.
 */
export function createLocalStore<T>(key: string, schema: z.ZodType<T>, fallback: T) {
	const listeners = new Set<() => void>();
	let cache: { raw: string | null; value: T } | undefined;

	function read(): T {
		let raw: string | null = null;
		try {
			raw = localStorage.getItem(key);
		} catch {}
		if (cache && cache.raw === raw) return cache.value;
		let value = fallback;
		if (raw) {
			try {
				const parsed = schema.safeParse(JSON.parse(raw));
				if (parsed.success) value = parsed.data;
			} catch {}
		}
		cache = { raw, value };
		return value;
	}

	function write(next: T | ((prev: T) => T)) {
		const value = typeof next === "function" ? (next as (prev: T) => T)(read()) : next;
		try {
			localStorage.setItem(key, JSON.stringify(value));
		} catch {}
		cache = undefined;
		for (const listener of listeners) listener();
	}

	function reset() {
		try {
			localStorage.removeItem(key);
		} catch {}
		cache = undefined;
		for (const listener of listeners) listener();
	}

	function subscribe(listener: () => void) {
		listeners.add(listener);
		const onStorage = (event: StorageEvent) => {
			if (event.key === key) {
				cache = undefined;
				listener();
			}
		};
		window.addEventListener("storage", onStorage);
		return () => {
			listeners.delete(listener);
			window.removeEventListener("storage", onStorage);
		};
	}

	return { read, write, reset, subscribe, fallback };
}

export type LocalStore<T> = ReturnType<typeof createLocalStore<T>>;

/** Subscribe a component to a local store. */
export function useLocalStore<T>(store: LocalStore<T>) {
	return useSyncExternalStore(store.subscribe, store.read, () => store.fallback);
}
