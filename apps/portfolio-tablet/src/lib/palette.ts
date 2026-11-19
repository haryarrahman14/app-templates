import { z } from "zod";

/**
 * Solid fills for things that must be told apart (app tiles, covers, file labels): the app accent
 * (aqua) plus the shared system-style category set. Values live in styles/app.css
 * (`--aqua`, `--cat-<name>`). Never a gradient, never a raw hue.
 */
export const SWATCHES = [
	"aqua",
	"red",
	"orange",
	"yellow",
	"green",
	"teal",
	"blue",
	"gray",
	"graphite",
] as const;

export const swatchSchema = z.enum(SWATCHES);
export type Swatch = z.infer<typeof swatchSchema>;

/** Glyph or label colour on each fill: white, dark on yellow, deep teal on aqua. */
const INK: Partial<Record<Swatch, string>> = {
	aqua: "var(--teal-deep)",
	yellow: "var(--cat-ink-dark)",
};

/** CSS colour of a swatch fill, or (`"ink"`) of the glyph or label on it. */
export function swatchVar(swatch: Swatch, shade?: "ink"): string {
	if (shade === "ink") return INK[swatch] ?? "var(--cat-ink)";
	return swatch === "aqua" ? "var(--aqua)" : `var(--cat-${swatch})`;
}
