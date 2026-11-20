import type { NotePicture } from "@/features/notes/schemas/note";

/**
 * `![alt](src)`, then optionally a line of italics (`*…*` or `_…_`) as the next paragraph: that line
 * is the picture's caption.
 */
const PICTURE =
	/!\[([^\]]*)\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)[ \t]*(?:\r?\n[ \t]*){0,2}(?:([*_])(?![*_\s])([^\n]+?)\3[ \t]*(?=\r?\n|$))?/g;

/** Every picture in a note's Markdown, in reading order, with its caption. */
export function notePictures(markdown: string): NotePicture[] {
	return [...markdown.matchAll(PICTURE)].map(([, alt = "", src = "", , caption]) => ({
		src,
		alt: alt.trim(),
		caption: caption?.trim() || undefined,
	}));
}
