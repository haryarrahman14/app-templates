import type { Shot as ContentShot } from "@repo/content";

/**
 * Helpers shared by the features that read `@repo/content` (packages/content), the owner's portfolio
 * content. Facts never live here: only how to reach them.
 */

/** A proof screenshot's file in public/: the 800px web shot, or the 400px phone shot. */
export function shotSrc(shot: ContentShot) {
	return shot.src.replace(/\.webp$/, shot.kind === "phone" ? "-400.webp" : "-800.webp");
}

/** `/proof/<slug>/<name>.webp` → `<slug>-<name>`, an id the URL (`?id=`) accepts. */
export function shotId(shot: ContentShot) {
	return shot.src
		.replace(/^\/proof\//, "")
		.replace(/\.webp$/, "")
		.replace(/[^a-z0-9]+/g, "-");
}

export type ContentPost = {
	slug: string;
	title: string;
	excerpt: string;
	publishedAt: string;
	tags: string[];
	/** `pinned: true` in the frontmatter. */
	pinned: boolean;
	/** `stack: React, TypeScript, …`: what the post's project was built with. */
	stack: string[];
	lang?: string;
	translationOf?: string;
	body: string;
};

/** The real blog posts: packages/content/posts/*.md, YAML-style frontmatter plus Markdown. */
const FILES = import.meta.glob<string>("../../../../packages/content/posts/*.md", {
	query: "?raw",
	import: "default",
	eager: true,
});

/** `a, b, c` → `["a", "b", "c"]`. */
function splitList(value: string | undefined) {
	return (value ?? "")
		.split(",")
		.map((item) => item.trim())
		.filter(Boolean);
}

function parsePost(path: string, raw: string): ContentPost {
	const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
	const meta: Record<string, string> = {};
	for (const line of (match?.[1] ?? "").split(/\r?\n/)) {
		const at = line.indexOf(":");
		if (at > 0) meta[line.slice(0, at).trim()] = line.slice(at + 1).trim();
	}
	return {
		slug: path.split("/").at(-1)?.replace(/\.md$/, "") ?? "",
		title: meta.title ?? "",
		excerpt: meta.excerpt ?? "",
		publishedAt: meta.publishedAt ?? "",
		tags: splitList(meta.tags),
		pinned: meta.pinned === "true",
		stack: splitList(meta.stack),
		lang: meta.lang,
		translationOf: meta.translationOf,
		body: (match?.[2] ?? raw).trim(),
	};
}

/** English posts only (no `lang`, or `lang: en`; translations are left out), newest first. */
export const englishPosts: ContentPost[] = Object.entries(FILES)
	.map(([path, raw]) => parsePost(path, raw))
	.filter((post) => (!post.lang || post.lang === "en") && !post.translationOf)
	.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
