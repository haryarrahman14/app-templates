/**
 * The shared category set (tags, list dots, calendar chips, covers, priorities). Records store one of
 * these ids; the colours themselves are CSS variables in src/styles/app.css.
 */
export const TINT_IDS = [
	"red",
	"orange",
	"yellow",
	"green",
	"teal",
	"blue",
	"gray",
	"graphite",
] as const;
export type TintId = (typeof TINT_IDS)[number];

/** Ids from earlier palettes, kept so data saved in localStorage still renders. */
const LEGACY_TINTS: Record<string, TintId> = {
	rust: "orange",
	wheat: "yellow",
	sage: "green",
	plum: "teal",
	stone: "gray",
	linen: "gray",
	ochre: "orange",
	amber: "yellow",
	rose: "red",
	sky: "blue",
	violet: "blue",
	emerald: "green",
};

/** Maps any stored tint (new or old) to a palette id; unknown values pass through unchanged. */
export function normalizeTint(value: unknown): unknown {
	if (typeof value !== "string") return value;
	if ((TINT_IDS as readonly string[]).includes(value)) return value;
	return LEGACY_TINTS[value] ?? value;
}
