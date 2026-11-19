import type { Doc, Folder } from "@/features/documents/schemas/document";
import { SAMPLE_USER_ID } from "@/lib/session";

export const docTitle = (doc: Pick<Doc, "title">) => doc.title.trim() || "Untitled";

export const isMine = (doc: Pick<Doc, "ownerId">) => doc.ownerId === SAMPLE_USER_ID;

export type DocFilters = { folder?: string; tag?: string; owner?: string; q?: string };

/** Folder filter includes its sub-folders. Owner is "me", "others" or a member id. */
export function filterDocs(docs: Doc[], filters: DocFilters, folders: Folder[]) {
	const folderIds = filters.folder
		? new Set([
				filters.folder,
				...folders.filter((f) => f.parentId === filters.folder).map((f) => f.id),
			])
		: null;
	const q = filters.q?.trim().toLowerCase();
	return docs.filter((doc) => {
		if (folderIds && (!doc.folderId || !folderIds.has(doc.folderId))) return false;
		if (filters.tag && !doc.tagIds.includes(filters.tag)) return false;
		if (filters.owner === "me" && !isMine(doc)) return false;
		if (filters.owner === "others" && isMine(doc)) return false;
		if (filters.owner && !["me", "others"].includes(filters.owner) && doc.ownerId !== filters.owner)
			return false;
		if (q && !`${doc.title} ${doc.blocks.map((b) => b.text).join(" ")}`.toLowerCase().includes(q))
			return false;
		return true;
	});
}
