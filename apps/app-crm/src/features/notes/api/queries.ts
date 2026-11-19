import { queryOptions } from "@tanstack/react-query";
import { noteSchema } from "@/features/notes/schemas/note";
import { db, delay } from "@/lib/sample-db/db";

// ▶ Real API: swap this queryFn for a fetch to your notes endpoint.
export const notesQuery = queryOptions({
	queryKey: ["notes"],
	queryFn: async () => {
		await delay();
		return noteSchema
			.array()
			.parse(db.notes)
			.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
	},
});
