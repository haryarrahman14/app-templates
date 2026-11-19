/**
 * Sample data is anchored to a fixed "as of" date, so every generated series and date is identical on every
 * visit and in every time zone. Times are UTC. Swap this for real timestamps when a real API arrives.
 */
export const SAMPLE_AS_OF = Date.UTC(2026, 10, 19); // Thu 19 Nov 2026
export const DAY_MS = 86_400_000;
export const MARKET_OPEN_MIN = 14 * 60 + 30; // 14:30 UTC
export const MARKET_CLOSE_MIN = 21 * 60; // 21:00 UTC

const isWeekday = (ts: number) => {
	const day = new Date(ts).getUTCDay();
	return day !== 0 && day !== 6;
};

/** The last `count` weekdays up to and including SAMPLE_AS_OF, oldest first. */
export function tradingDays(count: number) {
	const days: number[] = [];
	let ts = SAMPLE_AS_OF;
	while (days.length < count) {
		if (isWeekday(ts)) days.push(ts);
		ts -= DAY_MS;
	}
	return days.reverse();
}

/** Weekdays after SAMPLE_AS_OF (for upcoming events). */
export function nextTradingDay(offset: number) {
	let ts = SAMPLE_AS_OF;
	let n = 0;
	while (n < offset) {
		ts += DAY_MS;
		if (isWeekday(ts)) n++;
	}
	return ts;
}

export const START_OF_YEAR = Date.UTC(new Date(SAMPLE_AS_OF).getUTCFullYear(), 0, 1);
