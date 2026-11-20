import { queryOptions } from "@tanstack/react-query";
import { type Note, noteSchema } from "@/features/notes/schemas/note";
import { notePictures } from "@/features/notes/utils/pictures";
import { englishPosts } from "@/lib/content";

/**
 * The owner's blog posts in English, read from packages/content/posts/*.md (frontmatter + Markdown):
 * pinned posts first, then newest first. Replace those files to reuse the template.
 */
async function listNotes(): Promise<Note[]> {
	const notes = noteSchema.array().parse(
		englishPosts.map((post) => ({
			slug: post.slug,
			title: post.title,
			date: post.publishedAt,
			excerpt: post.excerpt,
			tags: post.tags,
			pinned: post.pinned,
			stack: post.stack,
			body: post.body,
			pictures: notePictures(post.body),
		})),
	);
	// englishPosts is already newest first, and sort is stable: pinned ones move up, in that order.
	return notes.sort((a, b) => Number(b.pinned) - Number(a.pinned));
}

export const notesQuery = queryOptions({
	queryKey: ["notes"],
	queryFn: listNotes,
});
