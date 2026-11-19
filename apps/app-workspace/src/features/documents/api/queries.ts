import { queryOptions } from "@tanstack/react-query";
import { docsStore, foldersStore, tagsStore } from "@/features/documents/api/store";
import { docSchema, folderSchema, tagSchema } from "@/features/documents/schemas/document";
import { sampleDelay } from "@/lib/mock-db";

/**
 * Documents data access. To use a real API, replace each queryFn body with a fetch
 * (e.g. `fetch("/api/docs").then((r) => r.json())`) and keep the zod parse.
 */
export const docsKeys = {
	all: ["docs"] as const,
	list: () => [...docsKeys.all, "list"] as const,
	trash: () => [...docsKeys.all, "trash"] as const,
	detail: (id: string) => [...docsKeys.all, "detail", id] as const,
	folders: ["folders"] as const,
	tags: ["tags"] as const,
};

const byUpdated = <T extends { updatedAt: string }>(a: T, b: T) =>
	b.updatedAt.localeCompare(a.updatedAt);

/** Every document not in the trash, most recently edited first. */
export const docsQuery = queryOptions({
	queryKey: docsKeys.list(),
	queryFn: async () => {
		await sampleDelay();
		return docSchema
			.array()
			.parse(docsStore.all().filter((doc) => !doc.trashedAt))
			.sort(byUpdated);
	},
});

export const trashedDocsQuery = queryOptions({
	queryKey: docsKeys.trash(),
	queryFn: async () => {
		await sampleDelay();
		return docSchema
			.array()
			.parse(docsStore.all().filter((doc) => doc.trashedAt))
			.sort((a, b) => (b.trashedAt ?? "").localeCompare(a.trashedAt ?? ""));
	},
});

/** One document, or null when it does not exist (the page shows a not-found state). */
export const docQuery = (id: string) =>
	queryOptions({
		queryKey: docsKeys.detail(id),
		queryFn: async () => {
			await sampleDelay(200);
			const doc = docsStore.find(id);
			return doc ? docSchema.parse(doc) : null;
		},
	});

export const foldersQuery = queryOptions({
	queryKey: docsKeys.folders,
	queryFn: async () => {
		await sampleDelay(120);
		return folderSchema.array().parse(foldersStore.all());
	},
});

export const tagsQuery = queryOptions({
	queryKey: docsKeys.tags,
	queryFn: async () => {
		await sampleDelay(120);
		return tagSchema.array().parse(tagsStore.all());
	},
});
