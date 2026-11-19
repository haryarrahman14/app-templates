import { z } from "zod";

/**
 * A tiny fake backend for the sample data. Each collection lives in the browser (localStorage), seeded
 * on first use, so edits survive a reload. Only `features/<feature>/api/*` talks to this file:
 * replace those queryFns / mutationFns with real API calls and delete this file.
 */
const PREFIX = "workspace-sample:";

export function createCollection<T extends { id: string }>(
	name: string,
	schema: z.ZodType<T>,
	seed: () => T[],
) {
	let memory: T[] | null = null;
	const listSchema = z.array(schema);

	const load = (): T[] => {
		if (memory) return memory;
		let stored: T[] | null = null;
		if (typeof window !== "undefined") {
			try {
				const raw = localStorage.getItem(PREFIX + name);
				if (raw) stored = listSchema.parse(JSON.parse(raw));
			} catch {
				stored = null;
			}
		}
		memory = stored ?? seed();
		return memory;
	};

	const save = (items: T[]) => {
		memory = items;
		if (typeof window === "undefined") return;
		try {
			localStorage.setItem(PREFIX + name, JSON.stringify(items));
		} catch {}
	};

	return {
		all: (): T[] => structuredClone(load()),
		find: (id: string): T | null => structuredClone(load().find((item) => item.id === id) ?? null),
		insert(item: T): T {
			save([item, ...load()]);
			return item;
		},
		update(id: string, patch: Partial<T>): T {
			let updated: T | undefined;
			save(
				load().map((item) => {
					if (item.id !== id) return item;
					updated = { ...item, ...patch };
					return updated;
				}),
			);
			if (!updated) throw new Error("That item no longer exists.");
			return structuredClone(updated);
		},
		remove(id: string) {
			save(load().filter((item) => item.id !== id));
		},
	};
}

/** Clears every sample collection; the next read reseeds it. */
export function resetSampleData() {
	try {
		for (const key of Object.keys(localStorage)) {
			if (key.startsWith(PREFIX)) localStorage.removeItem(key);
		}
	} catch {}
}

/** A small artificial latency so loading and optimistic states are real. */
export const sampleDelay = (ms = 260) =>
	new Promise<void>((resolve) => setTimeout(resolve, ms + Math.random() * 180));

export const newId = (prefix: string) => `${prefix}-${crypto.randomUUID().slice(0, 8)}`;

/** ISO timestamp `days` (and optional hours) away from now; negative is the past. */
export function relativeIso(days: number, hours = 0) {
	return new Date(Date.now() + (days * 24 + hours) * 3_600_000).toISOString();
}
