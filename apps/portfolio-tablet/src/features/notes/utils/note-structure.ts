import type { NoteHeading, NotePicture } from "@/features/notes/schemas/note";
import { slugify } from "@/lib/slug";

/** Prefix of heading anchors in the reading pane, so they never clash with other ids on the page. */
export const HEADING_ID_PREFIX = "note-";

const IMAGE = /!\[([^\]]*)\]\(\s*([^)\s]+)(?:\s+"[^"]*")?\s*\)/g;
const ONLY_IMAGE = /^!\[[^\]]*\]\([^)]*\)$/;
const ITALIC_LINE = /^(?:\*(?!\*)(.+?)\*|_(?!_)(.+?)_)$/;

/** Markdown lines outside fenced code blocks, trimmed. */
function proseLines(markdown: string) {
	const lines: string[] = [];
	let fenced = false;
	for (const raw of markdown.split("\n")) {
		const line = raw.trim();
		if (line.startsWith("```") || line.startsWith("~~~")) {
			fenced = !fenced;
			continue;
		}
		lines.push(fenced ? "" : line);
	}
	return lines;
}

/** Inline markdown reduced to its words. */
function plain(text: string) {
	return text
		.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
		.replace(/[*_`]/g, "")
		.trim();
}

/** The note's `##` headings, in order, with the same anchors the reading pane gives them. */
export function noteHeadings(markdown: string): NoteHeading[] {
	return proseLines(markdown)
		.filter((line) => /^##\s+\S/.test(line))
		.map((line) => {
			const text = plain(line.replace(/^##\s+/, "").replace(/\s+#+$/, ""));
			return { id: `${HEADING_ID_PREFIX}${slugify(text)}`, text };
		})
		.filter((h) => h.text && h.id !== HEADING_ID_PREFIX);
}

/** Every picture in the note, in order. A picture alone on its line takes the italic line under it as its caption. */
export function notePictures(markdown: string): NotePicture[] {
	const lines = proseLines(markdown);
	const pictures: NotePicture[] = [];
	lines.forEach((line, i) => {
		for (const match of line.matchAll(IMAGE)) {
			const [, alt = "", src = ""] = match;
			let caption: string | undefined;
			if (ONLY_IMAGE.test(line)) {
				const next = lines[i + 1] === "" ? lines[i + 2] : lines[i + 1];
				const italic = next ? ITALIC_LINE.exec(next) : null;
				if (italic) caption = plain(italic[1] ?? italic[2] ?? "") || undefined;
			}
			pictures.push({ src, alt: plain(alt), caption });
		}
	});
	return pictures;
}
