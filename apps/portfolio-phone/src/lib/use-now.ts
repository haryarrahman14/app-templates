import { useEffect, useState } from "react";

/**
 * The current time, ticking on the minute boundary (cheap, and exact enough for a clock).
 * `null` until mounted: the page may be a file rendered at build time, so the first render
 * shows no time rather than the server's (zone, locale and minute all differ).
 */
export function useNow() {
	const [now, setNow] = useState<Date | null>(null);

	useEffect(() => {
		let timer: ReturnType<typeof setTimeout>;
		const tick = () => {
			const current = new Date();
			setNow(current);
			timer = setTimeout(tick, 60_000 - (current.getSeconds() * 1000 + current.getMilliseconds()));
		};
		tick();
		return () => clearTimeout(timer);
	}, []);

	return now;
}

export const formatTime = (date: Date) =>
	date
		.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
		.replace(/\s?[AP]M$/i, "");

export const formatLongDate = (date: Date) =>
	date.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
