import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { useCreateDoc } from "@/features/documents/api/mutations";

/** Creates a document (optionally from a template) and opens it. */
export function useNewDoc() {
	const navigate = useNavigate();
	const create = useCreateDoc();
	const { mutate } = create;
	const newDoc = useCallback(
		(options: { templateId?: string; folderId?: string | null; title?: string } = {}) =>
			mutate(options, {
				onSuccess: (doc) => navigate({ to: "/docs/$docId", params: { docId: doc.id } }),
			}),
		[mutate, navigate],
	);
	return { newDoc, isPending: create.isPending };
}
