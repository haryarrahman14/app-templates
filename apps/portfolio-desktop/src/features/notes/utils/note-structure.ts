import {
	type NoteHeading,
	type NotePicture,
	noteHeadingSchema,
	notePictureSchema,
} from "@/features/notes/schemas/note";

/** Body lines with their 1-based line number, leaving out fenced code blocks. */
function proseLines(markdown: string) {
	const lines: { text: string; line: number }[] = [];
	let inFence = false;
	markdown.split(/\r?\n/).forEach((text, index) => {
		if (/^\s*(```|~~~)/.test(text)) inFence = !inFence;
		else if (!inFence) lines.push({ text, line: index + 1 });
	});
	return lines;
}

/** Markdown inline syntax to plain text: links keep their label, emphasis and code marks go. */
const plain = (text: string) =>
	text
		.replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
		.replace(/[*_`]/g, "")
		.trim();

const slug = (text: string) =>
	text
		.toLowerCase()
		.normalize("NFKD")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "") || "section";

/** The note's `##` headings, in order, with ids unique within the note. */
export function noteHeadings(markdown: string): NoteHeading[] {
	const seen = new Map<string, number>();
	return proseLines(markdown).flatMap(({ text, line }) => {
		const match = /^##\s+(.+?)\s*#*\s*$/.exec(text);
		if (!match?.[1]) return [];
		const label = plain(match[1]);
		const base = slug(label);
		const count = seen.get(base) ?? 0;
		seen.set(base, count + 1);
		return [
			noteHeadingSchema.parse({ id: count ? `${base}-${count + 1}` : base, text: label, line }),
		];
	});
}

const IMAGE = /!\[([^\]]*)\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)/g;
const CAPTION = /^\s*(?:\*([^*].*?)\*|_([^_].*?)_)\s*$/;

/** Every picture in the note, in order. A picture alone on its line takes the italic line under it as caption. */
export function notePictures(markdown: string): NotePicture[] {
	const lines = proseLines(markdown);
	return lines.flatMap(({ text, line }, index) => {
		const found = [...text.matchAll(IMAGE)];
		const alone = found.length === 1 && text.trim() === found[0]?.[0];
		// The caption is the next non-empty line, when it is one italic phrase.
		const next = lines.slice(index + 1).find((l) => l.text.trim());
		const caption = alone && next ? CAPTION.exec(next.text) : null;
		return found.map((match) =>
			notePictureSchema.parse({
				src: match[2],
				alt: match[1] ?? "",
				caption: caption ? plain(caption[1] ?? caption[2] ?? "") : undefined,
				line,
			}),
		);
	});
}

/** Smooth scrolling unless the OS or Settings → Reduce motion asks for less motion. */
export function scrollBehavior(): ScrollBehavior {
	if (typeof window === "undefined") return "auto";
	const reduce =
		window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
		document.documentElement.classList.contains("reduce-motion");
	return reduce ? "auto" : "smooth";
}
