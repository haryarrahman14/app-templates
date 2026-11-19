import { queryOptions } from "@tanstack/react-query";
import { type Note, noteSchema } from "@/features/notes/schemas/note";
import { englishPosts } from "@/lib/content";

/**
 * The owner's blog posts in English, read from packages/content/posts/*.md (frontmatter + Markdown),
 * newest first. Replace those files to reuse the template.
 */
async function listNotes(): Promise<Note[]> {
	return noteSchema.array().parse(
		englishPosts.map((post) => ({
			slug: post.slug,
			title: post.title,
			date: post.publishedAt,
			excerpt: post.excerpt,
			tags: post.tags,
			body: post.body,
		})),
	);
}

export const notesQuery = queryOptions({
	queryKey: ["notes"],
	queryFn: listNotes,
});
