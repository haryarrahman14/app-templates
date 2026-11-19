import { useSyncExternalStore } from "react";

/** Live media query match. `false` on the server and during hydration. */
export function useMediaQuery(query: string) {
	return useSyncExternalStore(
		(onChange) => {
			const media = matchMedia(query);
			media.addEventListener("change", onChange);
			return () => media.removeEventListener("change", onChange);
		},
		() => matchMedia(query).matches,
		() => false,
	);
}

/** Phone widths: split view off, dock becomes a tab bar. */
export const PHONE_QUERY = "(max-width: 767px)";
