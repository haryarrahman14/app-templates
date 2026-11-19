/** The shared category set (styles/app.css), as CSS variables. Solid fills only: app tiles, covers, dots. */
export const CATEGORY = {
	red: "var(--red)",
	orange: "var(--orange)",
	yellow: "var(--yellow)",
	green: "var(--green)",
	teal: "var(--teal)",
	blue: "var(--blue)",
	gray: "var(--gray)",
	graphite: "var(--graphite)",
} as const;

/** Glyph colour on a solid fill: white, except a dark glyph on yellow. */
export function glyphOn(fill: string) {
	return fill === CATEGORY.yellow ? CATEGORY.graphite : "#ffffff";
}
