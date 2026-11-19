import type { DatePreset } from "@/features/transactions/constants/types";
import { DAY_MS, SAMPLE_AS_OF, START_OF_YEAR } from "@/lib/sample-data/calendar";

/** Resolves a preset (or custom yyyy-mm-dd bounds) to inclusive UTC ms bounds. */
export function resolveRange(
	preset: DatePreset,
	from: string,
	to: string,
): [number, number] | null {
	const end = SAMPLE_AS_OF + DAY_MS - 1;
	switch (preset) {
		case "all":
			return null;
		case "30":
			return [SAMPLE_AS_OF - 30 * DAY_MS, end];
		case "90":
			return [SAMPLE_AS_OF - 90 * DAY_MS, end];
		case "ytd":
			return [START_OF_YEAR, end];
		case "custom": {
			const start = from ? Date.parse(`${from}T00:00:00Z`) : Number.NEGATIVE_INFINITY;
			const stop = to ? Date.parse(`${to}T23:59:59Z`) : Number.POSITIVE_INFINITY;
			return [start, stop];
		}
	}
}

export const toInputDate = (ms: number) => new Date(ms).toISOString().slice(0, 10);
