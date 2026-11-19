const dateFormat = new Intl.DateTimeFormat("en-GB", {
	day: "numeric",
	month: "short",
	year: "numeric",
	timeZone: "UTC",
});

/** "12 Nov 2026" from an ISO date. Fixed locale and UTC so server and client render the same text. */
export function formatDate(iso: string) {
	return dateFormat.format(new Date(iso));
}
