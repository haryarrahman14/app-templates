/**
 * The owner's real blog posts: the markdown files in `packages/content/posts`, read at build time.
 * Shared by Notes (to read them) and Files (to list them as documents); each feature maps them in its
 * own `api/queries.ts`. English only: a post with `lang: id` is a translation and is left out.
 */
const RAW = import.meta.glob<string>("../../../../packages/content/posts/*.md", {
	query: "?raw",
	import: "default",
	eager: true,
});

export type BlogPost = {
	slug: string;
	title: string;
	excerpt: string;
	/** ISO date. */
	publishedAt: string;
	tags: string[];
	/** Markdown, without the frontmatter. */
	body: string;
};

/** A flat `key: value` frontmatter block, as the content package writes it. */
function parse(slug: string, raw: string) {
	const match = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(raw);
	const meta: Record<string, string> = {};
	for (const line of (match?.[1] ?? "").split("\n")) {
		const i = line.indexOf(":");
		if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
	}
	return { slug, meta, body: (match?.[2] ?? raw).trim() };
}

export function englishPosts(): BlogPost[] {
	return Object.entries(RAW)
		.map(([path, raw]) => parse(path.split("/").pop()?.replace(/\.md$/, "") ?? path, raw))
		.filter(({ meta }) => (meta.lang ?? "en") === "en" && !meta.translationOf)
		.map(({ slug, meta, body }) => ({
			slug,
			title: meta.title ?? slug,
			excerpt: meta.excerpt ?? "",
			publishedAt: meta.publishedAt ?? "",
			tags: (meta.tags ?? "")
				.split(",")
				.map((t) => t.trim())
				.filter(Boolean),
			body,
		}))
		.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}
