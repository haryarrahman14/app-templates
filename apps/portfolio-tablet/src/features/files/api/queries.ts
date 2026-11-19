import { profile, projects } from "@repo/content";
import { queryOptions } from "@tanstack/react-query";
import { type FileItem, type FileSystem, fileSystemSchema } from "@/features/files/schemas/file";
import { englishPosts } from "@/lib/blog-posts";

/** Size of a generated markdown document, e.g. "3 KB". */
function sizeOf(body: string) {
	const bytes = new TextEncoder().encode(body).length;
	return bytes < 1024 ? `${bytes} B` : `${Math.round(bytes / 1024)} KB`;
}

function markdownFile(file: Omit<FileItem, "kind" | "size" | "preview">, body: string): FileItem {
	return { ...file, kind: "doc", size: sizeOf(body), preview: { type: "markdown", body } };
}

/** "portfolio" is left out, as in Projects: its words describe his own site, which this is not. */
const LEFT_OUT = new Set(["portfolio"]);

/** Real documents only: the CV PDF, the blog posts, and a write-up of each project, all from `@repo/content`. */
async function getFileSystem() {
	const fileSystem: FileSystem = {
		folders: [
			{ id: "cv", name: "CV", description: "Curriculum vitae, PDF" },
			{ id: "writing", name: "Writing", description: "Blog posts" },
			{ id: "projects", name: "Projects", description: "Project write-ups" },
		],
		files: [
			{
				id: "cv",
				folder: "cv",
				name: profile.cv.fileName,
				kind: "pdf",
				size: profile.cv.sizeLabel,
				modified: profile.cv.updatedAt,
				preview: { type: "pdf", href: profile.cv.href, fileName: profile.cv.fileName },
			},
			...englishPosts().map((post) =>
				markdownFile(
					{
						id: `post-${post.slug}`,
						folder: "writing",
						name: `${post.slug}.md`,
						modified: post.publishedAt,
					},
					`# ${post.title}\n\n${post.body}`,
				),
			),
			...projects
				.filter((p) => !LEFT_OUT.has(p.slug))
				.map((p) =>
					markdownFile(
						{ id: `project-${p.slug}`, folder: "projects", name: `${p.name}.md` },
						[
							`# ${p.name}`,
							`*${p.tagline} · ${p.kind} · ${p.period} · ${p.status}*`,
							p.summary,
							p.bullets.map((b) => `- ${b}`).join("\n"),
							...p.metrics.map((m) => `**${m.value}** ${m.label}`),
							`**Stack:** ${p.tech.join(", ")}`,
							...p.links.map((l) => `[${l.label}](${l.href})`),
						].join("\n\n"),
					),
				),
		],
	};
	return fileSystemSchema.parse(fileSystem);
}

export const fileSystemQuery = queryOptions({
	queryKey: ["files"],
	queryFn: getFileSystem,
});
