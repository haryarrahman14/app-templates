import {
	FileText,
	Globe,
	type LucideIcon,
	NotebookPen,
	Printer,
	Sparkles,
	Trophy,
} from "lucide-react";
import { z } from "zod";

/** Icons that content files may name by key (content stays plain JSON-like data). */
export const CONTENT_ICONS = {
	document: FileText,
	printer: Printer,
	trophy: Trophy,
	globe: Globe,
	note: NotebookPen,
	sparkles: Sparkles,
} satisfies Record<string, LucideIcon>;

export const contentIconSchema = z.enum(
	Object.keys(CONTENT_ICONS) as [keyof typeof CONTENT_ICONS, ...(keyof typeof CONTENT_ICONS)[]],
);

export type ContentIcon = z.infer<typeof contentIconSchema>;

/**
 * Category colours (CLAUDE.md → Colour): the app accent plus the shared system-style set, used as
 * SOLID fills for app tiles, project art and shot placeholders. `glyph` is the icon/text colour on it.
 */
export const COLORS = {
	accent: { fill: "#1FB85A", glyph: "#0E0E10" },
	red: { fill: "#FF3B30", glyph: "#FFFFFF" },
	orange: { fill: "#FF9500", glyph: "#FFFFFF" },
	yellow: { fill: "#FFCC00", glyph: "#121212" },
	green: { fill: "#34C759", glyph: "#FFFFFF" },
	teal: { fill: "#30B0C7", glyph: "#FFFFFF" },
	blue: { fill: "#007AFF", glyph: "#FFFFFF" },
	gray: { fill: "#8E8E93", glyph: "#FFFFFF" },
	graphite: { fill: "#1C1C1E", glyph: "#FFFFFF" },
} as const;

export type CategoryColor = keyof typeof COLORS;

export const colorSchema = z.enum(Object.keys(COLORS) as [CategoryColor, ...CategoryColor[]]);

/** A flat fill in one category colour, with its glyph colour on top. */
export const colorFill = (color: CategoryColor) => ({
	background: COLORS[color].fill,
	color: COLORS[color].glyph,
});

/**
 * Each project's flat art (a glyph and a fill). Art, not content: a project that is not listed here
 * gets the next pair from the fallback cycle.
 */
const PROJECT_ART: Record<string, { icon: ContentIcon; color: CategoryColor }> = {
	penawaranku: { icon: "document", color: "blue" },
	"arsip-cetak": { icon: "printer", color: "orange" },
	"lomba-agustusan-2026": { icon: "trophy", color: "red" },
	portfolio: { icon: "globe", color: "graphite" },
};
const FALLBACK_ART: { icon: ContentIcon; color: CategoryColor }[] = [
	{ icon: "sparkles", color: "teal" },
	{ icon: "document", color: "gray" },
];

export function projectArt(slug: string, index = 0) {
	return PROJECT_ART[slug] ?? FALLBACK_ART[index % FALLBACK_ART.length] ?? FALLBACK_ART[0];
}
