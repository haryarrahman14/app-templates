import type { PostDoc, PublishCheck } from "./types.ts";

/**
 * Publish's check for a post (design/cp2-admin-ux.md 7, "Rules"): one copy, read by the admin while he types and by
 * the API when he presses Publish. Plain TypeScript with no imports, so the API runs it as it is.
 */

/** Where a problem stands: the field, the picture's number in the body (from 1), and the text to select there. */
export type PostProblem = {
	words: string;
	field: "title" | "excerpt" | "body";
	image?: number;
	at: number;
	end: number;
};

/** UUIDs, as in the API's own image addresses: their digit runs would read as phone numbers. */
const UUIDS = /[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}/gi;

/** A run of 9 or more digits once counted, with spaces, dashes, dots, parentheses and a leading + between them. */
const PHONE = /\+?\(?\d[\d().\-\t\p{Zs}]*\d/gu;

/** A picture: ![alt](address "title"), on one line; the address bare or in <>. */
const IMAGE = /!\[([^\]\n]*)\]\(\s*(<[^>\n]*>|[^\s)]*)[^)\n]*\)/g;

/**
 * Blocks stop Publish; notes are only said (a phone number blocks a job's Publish, not a post's). A post needs a
 * title and words, every picture an alt, and every picture an address (a failed upload leaves none).
 */
export function postProblems(doc: PostDoc): { blocks: PostProblem[]; notes: PostProblem[] } {
	const blocks: PostProblem[] = [];
	if (!doc.title.trim()) blocks.push({ words: "Needs a title.", field: "title", at: 0, end: 0 });
	if (!doc.body.trim()) blocks.push({ words: "Needs words.", field: "body", at: 0, end: 0 });
	let image = 0;
	for (const m of withoutCode(doc.body).matchAll(IMAGE)) {
		const where = {
			field: "body",
			image: ++image,
			at: m.index,
			end: m.index + m[0].length,
		} as const;
		if (!m[1].trim()) blocks.push({ words: "Alt is empty.", ...where });
		else if (!m[2].replace(/^<|>$/g, "").trim()) blocks.push({ words: "Upload failed.", ...where });
	}
	const notes: PostProblem[] = [];
	for (const field of ["title", "excerpt", "body"] as const) {
		const prose = withoutCode(doc[field]).replace(UUIDS, (uuid) => "_".repeat(uuid.length));
		for (const m of phoneRuns(prose)) {
			const words = `Looks like a phone number: ${m[0]}`;
			if (!notes.some((n) => n.words === words))
				notes.push({ words, field, at: m.index, end: m.index + m[0].length });
		}
	}
	return { blocks, notes };
}

/** The same check as the API answers it: each sentence once. */
export function checkPost(doc: PostDoc): PublishCheck {
	const { blocks, notes } = postProblems(doc);
	const words = (problems: PostProblem[]) => [...new Set(problems.map((p) => p.words))];
	return { blocks: words(blocks), notes: words(notes) };
}

const phoneRuns = (text: string) =>
	[...text.matchAll(PHONE)].filter((m) => m[0].replace(/\D/g, "").length >= 9);

/** The phone-like runs in a text. */
export const phoneLike = (text: string) => phoneRuns(text).map((m) => m[0]);

/** Every character but the line breaks as a space: the text keeps its length, so a place in it is a place in the original. */
const blank = (text: string) => text.replace(/[^\n]/g, " ");

/**
 * The Markdown with its fenced code blocks and inline code spans blanked out (CommonMark's rules, simplified), the
 * same length as it came, so what is found in it can be selected in the original.
 */
export function withoutCode(markdown: string): string {
	const lines: string[] = [];
	let fence = "";
	for (const line of markdown.split("\n")) {
		const marker = /^ {0,3}(`{3,}|~{3,})(.*)$/.exec(line);
		if (fence) {
			const closes =
				marker?.[1][0] === fence[0] && marker[1].length >= fence.length && !marker[2].trim();
			if (closes) fence = "";
			lines.push(blank(line));
		} else if (marker && !(marker[1][0] === "`" && marker[2].includes("`"))) {
			fence = marker[1];
			lines.push(blank(line));
		} else {
			lines.push(line);
		}
	}
	// A span opens and closes with equally long backtick runs and never crosses a blank line.
	return lines.join("\n").replace(/(?<!`)(`+)(?!`)(?:[^\n]|\n(?![ \t]*\n))+?(?<!`)\1(?!`)/g, blank);
}
