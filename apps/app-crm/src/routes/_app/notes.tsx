import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { companiesQuery } from "@/features/companies/api/queries";
import { notesQuery } from "@/features/notes/api/queries";
import { NotesPage } from "@/features/notes/components/notes-page";
import { peopleQuery } from "@/features/people/api/queries";
import { membersQuery } from "@/features/workspace/api/queries";
import { ensureQueries } from "@/lib/ensure-queries";
import { pageTitle } from "@/lib/site";

export const Route = createFileRoute("/_app/notes")({
	// `?note=<id>` selects a note (and shows the editor on phones).
	validateSearch: z.object({ note: z.string().optional().catch(undefined) }),
	loader: ({ context }) =>
		ensureQueries(context.queryClient, notesQuery, companiesQuery, peopleQuery, membersQuery),
	head: () => pageTitle("Notes"),
	component: function Page() {
		return <NotesPage selectedId={Route.useSearch().note} />;
	},
});
