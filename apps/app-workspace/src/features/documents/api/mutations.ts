import { toast } from "@repo/ui/components/sonner";
import { type QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { docsKeys } from "@/features/documents/api/queries";
import { docsStore, foldersStore, tagsStore } from "@/features/documents/api/store";
import { DOC_TEMPLATES, templateBlocks } from "@/features/documents/constants/templates";
import {
	type Doc,
	type DocPatch,
	docCoverTintSchema,
	type Folder,
	type Tag,
} from "@/features/documents/schemas/document";
import { newId, sampleDelay } from "@/lib/mock-db";
import { SAMPLE_USER_ID } from "@/lib/session";

/** Applies a change to every cached copy of the given documents (list + detail). */
function patchCachedDocs(queryClient: QueryClient, ids: string[], patch: (doc: Doc) => Doc | null) {
	const idSet = new Set(ids);
	queryClient.setQueryData<Doc[]>(docsKeys.list(), (old) =>
		old
			?.map((doc) => (idSet.has(doc.id) ? patch(doc) : doc))
			.filter((doc): doc is Doc => doc !== null),
	);
	for (const id of ids) {
		queryClient.setQueryData<Doc | null>(docsKeys.detail(id), (old) => (old ? patch(old) : old));
	}
}

async function snapshot(queryClient: QueryClient, ids: string[]) {
	await queryClient.cancelQueries({ queryKey: docsKeys.all });
	return {
		list: queryClient.getQueryData<Doc[]>(docsKeys.list()),
		details: ids.map(
			(id) => [id, queryClient.getQueryData<Doc | null>(docsKeys.detail(id))] as const,
		),
	};
}

function rollback(
	queryClient: QueryClient,
	context: Awaited<ReturnType<typeof snapshot>> | undefined,
) {
	if (!context) return;
	queryClient.setQueryData(docsKeys.list(), context.list);
	for (const [id, doc] of context.details) queryClient.setQueryData(docsKeys.detail(id), doc);
}

export function useCreateDoc() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			templateId = "blank",
			folderId = null,
			title,
		}: {
			templateId?: string;
			folderId?: string | null;
			title?: string;
		} = {}) => {
			await sampleDelay(200);
			const template = DOC_TEMPLATES.find((t) => t.id === templateId) ?? DOC_TEMPLATES[0];
			if (!template) throw new Error("Unknown template");
			const now = new Date().toISOString();
			const doc: Doc = {
				id: newId("d"),
				title: title ?? template.title,
				emoji: template.emoji,
				folderId,
				tagIds: [],
				ownerId: SAMPLE_USER_ID,
				createdAt: now,
				updatedAt: now,
				starred: false,
				trashedAt: null,
				font: "sans",
				width: "normal",
				cover: {
					enabled: false,
					tint: docCoverTintSchema.options[Math.floor(Math.random() * 6)] ?? "gray",
				},
				blocks: templateBlocks(template, () => newId("b")),
			};
			return docsStore.insert(doc);
		},
		onSuccess: (doc) => {
			queryClient.setQueryData(docsKeys.detail(doc.id), doc);
			queryClient.setQueryData<Doc[]>(docsKeys.list(), (old) => (old ? [doc, ...old] : old));
		},
		onError: () => toast.error("Could not create the document."),
		onSettled: () => queryClient.invalidateQueries({ queryKey: docsKeys.list() }),
	});
}

/** Edits a document. Used by the editor's autosave, so it does not toast on success. */
export function useUpdateDoc() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ id, patch }: { id: string; patch: DocPatch }) => {
			await sampleDelay(220);
			return docsStore.update(id, { ...patch, updatedAt: new Date().toISOString() });
		},
		onMutate: async ({ id, patch }) => {
			const context = await snapshot(queryClient, [id]);
			patchCachedDocs(queryClient, [id], (doc) => ({
				...doc,
				...patch,
				updatedAt: new Date().toISOString(),
			}));
			return context;
		},
		onError: (_error, _vars, context) => {
			rollback(queryClient, context);
			toast.error("Your last change could not be saved.");
		},
		onSuccess: (doc) => {
			queryClient.setQueryData(docsKeys.detail(doc.id), doc);
		},
	});
}

export function useToggleStar() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ ids, starred }: { ids: string[]; starred: boolean }) => {
			await sampleDelay(160);
			for (const id of ids) docsStore.update(id, { starred });
			return { ids, starred };
		},
		onMutate: async ({ ids, starred }) => {
			const context = await snapshot(queryClient, ids);
			patchCachedDocs(queryClient, ids, (doc) => ({ ...doc, starred }));
			return context;
		},
		onError: (_error, _vars, context) => {
			rollback(queryClient, context);
			toast.error("Could not update starred.");
		},
		onSuccess: ({ ids, starred }) => {
			if (ids.length > 1)
				toast.success(`${starred ? "Starred" : "Unstarred"} ${ids.length} documents`);
		},
		onSettled: () => queryClient.invalidateQueries({ queryKey: docsKeys.list() }),
	});
}

export function useRestoreDocs() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (ids: string[]) => {
			await sampleDelay();
			for (const id of ids) docsStore.update(id, { trashedAt: null });
			return ids;
		},
		onMutate: async (ids) => {
			await queryClient.cancelQueries({ queryKey: docsKeys.trash() });
			const previous = queryClient.getQueryData<Doc[]>(docsKeys.trash());
			queryClient.setQueryData<Doc[]>(docsKeys.trash(), (old) =>
				old?.filter((doc) => !ids.includes(doc.id)),
			);
			return { previous };
		},
		onError: (_error, _vars, context) => {
			queryClient.setQueryData(docsKeys.trash(), context?.previous);
			toast.error("Could not restore.");
		},
		onSuccess: (ids) =>
			toast.success(ids.length === 1 ? "Document restored" : `${ids.length} documents restored`),
		onSettled: () => queryClient.invalidateQueries({ queryKey: docsKeys.all }),
	});
}

export function useTrashDocs() {
	const queryClient = useQueryClient();
	const restore = useRestoreDocs();
	return useMutation({
		mutationFn: async (ids: string[]) => {
			await sampleDelay();
			const now = new Date().toISOString();
			for (const id of ids) docsStore.update(id, { trashedAt: now });
			return ids;
		},
		onMutate: async (ids) => {
			const context = await snapshot(queryClient, ids);
			const trashedAt = new Date().toISOString();
			queryClient.setQueryData<Doc[]>(docsKeys.list(), (old) =>
				old?.filter((doc) => !ids.includes(doc.id)),
			);
			for (const id of ids) {
				queryClient.setQueryData<Doc | null>(docsKeys.detail(id), (old) =>
					old ? { ...old, trashedAt } : old,
				);
			}
			return context;
		},
		onError: (_error, _vars, context) => {
			rollback(queryClient, context);
			toast.error("Could not move to trash.");
		},
		onSuccess: (ids) =>
			toast.success(
				ids.length === 1 ? "Moved to trash" : `${ids.length} documents moved to trash`,
				{
					action: { label: "Undo", onClick: () => restore.mutate(ids) },
				},
			),
		onSettled: () => queryClient.invalidateQueries({ queryKey: docsKeys.all }),
	});
}

export function useDeleteDocsForever() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (ids: string[]) => {
			await sampleDelay();
			for (const id of ids) docsStore.remove(id);
			return ids;
		},
		onMutate: async (ids) => {
			await queryClient.cancelQueries({ queryKey: docsKeys.trash() });
			const previous = queryClient.getQueryData<Doc[]>(docsKeys.trash());
			queryClient.setQueryData<Doc[]>(docsKeys.trash(), (old) =>
				old?.filter((doc) => !ids.includes(doc.id)),
			);
			return { previous };
		},
		onError: (_error, _vars, context) => {
			queryClient.setQueryData(docsKeys.trash(), context?.previous);
			toast.error("Could not delete.");
		},
		onSuccess: (ids) =>
			toast.success(
				ids.length === 1 ? "Deleted forever" : `${ids.length} documents deleted forever`,
			),
		onSettled: () => queryClient.invalidateQueries({ queryKey: docsKeys.trash() }),
	});
}

export function useDuplicateDoc() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			await sampleDelay();
			const source = docsStore.find(id);
			if (!source) throw new Error("Document not found");
			const now = new Date().toISOString();
			return docsStore.insert({
				...source,
				id: newId("d"),
				title: `${source.title || "Untitled"} (copy)`,
				ownerId: SAMPLE_USER_ID,
				starred: false,
				createdAt: now,
				updatedAt: now,
				blocks: source.blocks.map((block) => ({ ...block, id: newId("b") })),
			});
		},
		onSuccess: (doc) => toast.success(`Created "${doc.title}"`),
		onError: () => toast.error("Could not duplicate."),
		onSettled: () => queryClient.invalidateQueries({ queryKey: docsKeys.list() }),
	});
}

export function useCreateTag() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ name, tint }: { name: string; tint: string }) => {
			await sampleDelay(150);
			const existing = tagsStore.all().find((t) => t.name === name);
			if (existing) return existing;
			const tag: Tag = { id: newId("t"), name, tint };
			return tagsStore.insert(tag);
		},
		onError: () => toast.error("Could not create the tag."),
		onSettled: () => queryClient.invalidateQueries({ queryKey: docsKeys.tags }),
	});
}

export function useCreateFolder() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ name, parentId = null }: { name: string; parentId?: string | null }) => {
			await sampleDelay(200);
			const folder: Folder = { id: newId("f"), name, parentId };
			return foldersStore.insert(folder);
		},
		onSuccess: (folder) => toast.success(`Folder "${folder.name}" created`),
		onError: () => toast.error("Could not create the folder."),
		onSettled: () => queryClient.invalidateQueries({ queryKey: docsKeys.folders }),
	});
}
