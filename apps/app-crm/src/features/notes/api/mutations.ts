import { toast } from "@repo/ui/components/sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notesQuery } from "@/features/notes/api/queries";
import type { NewNote, Note } from "@/features/notes/schemas/note";
import { patchList } from "@/lib/optimistic";
import { db, delay, newId, nowIso, recordActivity } from "@/lib/sample-db/db";
import { SESSION_MEMBER_ID } from "@/lib/session";

const key = notesQuery.queryKey;

export function useCreateNote() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (input: NewNote) => {
			await delay(350);
			const note: Note = {
				id: newId("n"),
				title: input.title || input.body.split("\n")[0]?.slice(0, 60) || "Untitled",
				body: input.body,
				record: input.record,
				authorId: SESSION_MEMBER_ID,
				createdAt: nowIso(),
				updatedAt: nowIso(),
			};
			db.notes.unshift(note);
			if (note.record) {
				recordActivity({
					type: "note",
					summary: `Added a note: ${note.title}`,
					record: note.record,
				});
			}
			return note;
		},
		onSuccess: () => toast.success("Note saved"),
		onError: () => toast.error("Could not save the note"),
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: key });
			queryClient.invalidateQueries({ queryKey: ["activities"] });
		},
	});
}

export function useUpdateNote() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ id, ...patch }: Partial<Note> & { id: string }) => {
			await delay(300);
			const note = db.notes.find((item) => item.id === id);
			if (!note) throw new Error("Note not found");
			Object.assign(note, patch, { updatedAt: nowIso() });
		},
		onMutate: ({ id, ...patch }) =>
			patchList<Note>(queryClient, key, (items) =>
				items.map((item) => (item.id === id ? { ...item, ...patch, updatedAt: nowIso() } : item)),
			),
		onError: (_error, _input, rollback) => {
			rollback?.();
			toast.error("Could not save the note");
		},
		onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
	});
}

export function useDeleteNote() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			await delay(250);
			db.notes = db.notes.filter((item) => item.id !== id);
		},
		onMutate: (id) =>
			patchList<Note>(queryClient, key, (items) => items.filter((n) => n.id !== id)),
		onSuccess: () => toast.success("Note deleted"),
		onError: (_error, _id, rollback) => rollback?.(),
		onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
	});
}
