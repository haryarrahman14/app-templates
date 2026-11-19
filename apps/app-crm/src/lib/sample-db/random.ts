/** Seeded PRNG (mulberry32). Same seed, same data, on every load. */
export function createRandom(seed: number) {
	let state = seed >>> 0;
	const next = () => {
		state = (state + 0x6d2b79f5) | 0;
		let t = Math.imul(state ^ (state >>> 15), 1 | state);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
	return {
		next,
		int: (min: number, max: number) => Math.floor(next() * (max - min + 1)) + min,
		pick: <T>(items: readonly T[]): T => items[Math.floor(next() * items.length)] as T,
		chance: (probability: number) => next() < probability,
	};
}

/** Midnight UTC today. Sample dates are offsets from it, so "today" stays today. */
export const ANCHOR = (() => {
	const now = new Date();
	return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
})();

const DAY = 86_400_000;

/** ISO timestamp `days` from today (negative = past) at `hour`:`minute` UTC. */
export function dayOffset(days: number, hour = 12, minute = 0) {
	return new Date(ANCHOR + days * DAY + hour * 3_600_000 + minute * 60_000).toISOString();
}

/** ISO timestamp for a wall-clock time today in the runtime's own time zone (calendar-style data). */
export function todayAt(hour: number, minute = 0) {
	const date = new Date();
	date.setHours(hour, minute, 0, 0);
	return date.toISOString();
}
