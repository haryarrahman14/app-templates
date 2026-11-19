import { useEffect, useState } from "react";

/** The current time, ticking every `intervalMs`. `null` on the server and the first client render. */
export function useNow(intervalMs = 15_000) {
	const [now, setNow] = useState<Date | null>(null);
	useEffect(() => {
		setNow(new Date());
		const id = setInterval(() => setNow(new Date()), intervalMs);
		return () => clearInterval(id);
	}, [intervalMs]);
	return now;
}
