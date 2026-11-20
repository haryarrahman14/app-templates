import { story } from "@repo/content";
import { queryOptions } from "@tanstack/react-query";
import { type Notebook, notebookSchema } from "@/features/notes/schemas/note";
import { englishPosts } from "@/lib/blog-posts";

/** Left out of the story note: "today" still describes the MapTrack role, which ended in Nov 2026. */
const STALE_CHAPTERS = new Set(["today"]);

/** The real blog posts (English) from `packages/content/posts`, plus the story from `@repo/content`. */
async function getNotebook() {
	const chapters = story.chapters.filter((c) => !STALE_CHAPTERS.has(c.slug));
	const notebook: Notebook = {
		folders: [
			{ id: "blog", name: "Blog" },
			{ id: "story", name: "Story" },
		],
		notes: [
			...englishPosts().map((post) => ({
				id: post.slug,
				folder: "blog",
				title: post.title,
				date: post.publishedAt,
				pinned: post.pinned,
				stack: post.stack,
				excerpt: post.excerpt,
				body: `# ${post.title}\n\n${post.body}`,
			})),
			{
				id: "the-story-so-far",
				folder: "story",
				title: story.title,
				pinned: false,
				stack: [],
				excerpt: chapters[0]?.body,
				body: [
					`# ${story.title}`,
					...chapters.map((c) => `## ${c.title}\n\n*${c.period}*\n\n${c.body}`),
				].join("\n\n"),
			},
		],
	};
	return notebookSchema.parse(notebook);
}

export const notebookQuery = queryOptions({
	queryKey: ["notes"],
	queryFn: getNotebook,
});
