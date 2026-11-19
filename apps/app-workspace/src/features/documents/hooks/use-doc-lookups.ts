import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { foldersQuery, tagsQuery } from "@/features/documents/api/queries";
import type { DocTableLookups } from "@/features/documents/components/doc-table";
import { membersQuery } from "@/features/members/api/queries";
import { SAMPLE_USER_ID } from "@/lib/session";
import { useSessionUser } from "@/lib/session-context";

/** Folder, tag and owner names for documents, resolved from their own queries. */
export function useDocLookups() {
	const user = useSessionUser();
	const folders = useQuery(foldersQuery);
	const tags = useQuery(tagsQuery);
	const members = useQuery(membersQuery);

	return useMemo(() => {
		const folderList = folders.data ?? [];
		const tagList = tags.data ?? [];
		const lookups: DocTableLookups = {
			folderName: (id) => folderList.find((f) => f.id === id)?.name ?? "No folder",
			owner: (id) => {
				if (id === SAMPLE_USER_ID) return { name: user.name };
				const member = members.data?.find((m) => m.id === id);
				return { name: member?.name ?? "Someone" };
			},
			tagsById: new Map(tagList.map((tag) => [tag.id, tag])),
		};
		return { folders: folderList, tags: tagList, members: members.data ?? [], lookups };
	}, [folders.data, tags.data, members.data, user.name]);
}
