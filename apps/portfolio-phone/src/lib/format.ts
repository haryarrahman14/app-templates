/** Formats an ISO date (YYYY-MM-DD) the same way on server and client. */
export function formatDate(iso: string, style: "long" | "short" = "long") {
	return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
		timeZone: "UTC",
		month: style === "long" ? "long" : "short",
		day: "numeric",
		year: "numeric",
	});
}

/** Rough reading time for a block of text. */
export const readingMinutes = (text: string) =>
	Math.max(1, Math.round(text.split(/\s+/).length / 220));
