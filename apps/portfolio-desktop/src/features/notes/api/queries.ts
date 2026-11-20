import { queryOptions } from "@tanstack/react-query";
import { type NoteInput, noteSchema } from "@/features/notes/schemas/note";

/** The owner's blog posts: Markdown files with frontmatter in packages/content/posts (@repo/content). */
const FILES = import.meta.glob<string>("../../../../../../packages/content/posts/*.md", {
	query: "?raw",
	import: "default",
	eager: true,
});

/** Splits `---` frontmatter (flat `key: value` lines) from the Markdown body. */
function parsePost(path: string, raw: string) {
	const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
	const meta: Record<string, string> = {};
	for (const line of (match?.[1] ?? "").split(/\r?\n/)) {
		const at = line.indexOf(":");
		if (at > 0) meta[line.slice(0, at).trim()] = line.slice(at + 1).trim();
	}
	return {
		slug: path.split("/").pop()?.replace(/\.md$/, "") ?? path,
		meta,
		body: (match?.[2] ?? raw).trim(),
	};
}

/** A comma-separated frontmatter value as a list. */
const list = (value: string | undefined) =>
	(value ?? "")
		.split(",")
		.map((item) => item.trim())
		.filter(Boolean);

/** English posts only (no `lang`, or `lang: en`): pinned first, then newest first. Translations are left out. */
async function listNotes() {
	const notes: NoteInput[] = Object.entries(FILES)
		.map(([path, raw]) => parsePost(path, raw))
		.filter(({ meta }) => (!meta.lang || meta.lang === "en") && !meta.translationOf)
		.map(({ slug, meta, body }) => ({
			id: slug,
			title: meta.title ?? slug,
			date: meta.publishedAt ?? "",
			pinned: meta.pinned === "true",
			tags: list(meta.tags),
			stack: list(meta.stack),
			excerpt: meta.excerpt,
			body,
		}))
		.sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.date.localeCompare(a.date));
	return noteSchema.array().parse(notes);
}

export const notesQuery = queryOptions({
	queryKey: ["notes", "list"],
	queryFn: listNotes,
});
