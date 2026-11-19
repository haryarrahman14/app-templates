import { useEffect, useState } from "react";

/** Current time, ticking every `intervalMs`. `undefined` on the server and first client render. */
export function useNow(intervalMs = 15_000) {
	const [now, setNow] = useState<Date>();

	useEffect(() => {
		setNow(new Date());
		const id = window.setInterval(() => setNow(new Date()), intervalMs);
		return () => window.clearInterval(id);
	}, [intervalMs]);

	return now;
}
