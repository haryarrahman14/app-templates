import type { Note } from "@/features/notes/schemas/note";

/** The Notes list order, also used by the home widget: pinned first, then newest first. */
export function sortNotes(notes: Note[]) {
	return [...notes].sort(
		(a, b) => Number(b.pinned) - Number(a.pinned) || (b.date ?? "").localeCompare(a.date ?? ""),
	);
}
