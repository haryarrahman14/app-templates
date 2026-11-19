/** Seeded, deterministic randomness: the same key always yields the same sequence (every visit sees the same market). */
export function hashString(input: string) {
	let hash = 2166136261;
	for (let i = 0; i < input.length; i++) {
		hash ^= input.charCodeAt(i);
		hash = Math.imul(hash, 16777619);
	}
	return hash >>> 0;
}

export function mulberry32(seed: number) {
	let a = seed >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

export function seeded(key: string) {
	return mulberry32(hashString(key));
}

/** Standard normal sample from a uniform source (Box–Muller). */
export function gaussian(rand: () => number) {
	const u = Math.max(rand(), 1e-9);
	const v = rand();
	return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export const round = (value: number, digits = 2) => {
	const f = 10 ** digits;
	return Math.round(value * f) / f;
};
