import { createFileRoute } from "@tanstack/react-router";
import { companiesQuery } from "@/features/companies/api/queries";
import { dealsQuery } from "@/features/deals/api/queries";
import { peopleQuery } from "@/features/people/api/queries";
import { tasksQuery } from "@/features/tasks/api/queries";
import { TasksPage } from "@/features/tasks/components/tasks-page";
import { membersQuery } from "@/features/workspace/api/queries";
import { ensureQueries } from "@/lib/ensure-queries";
import { pageTitle } from "@/lib/site";

export const Route = createFileRoute("/_app/tasks")({
	loader: ({ context }) =>
		ensureQueries(
			context.queryClient,
			tasksQuery,
			companiesQuery,
			peopleQuery,
			dealsQuery,
			membersQuery,
		),
	head: () => pageTitle("Tasks"),
	component: TasksPage,
});
