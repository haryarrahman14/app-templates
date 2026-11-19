import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { companiesQuery } from "@/features/companies/api/queries";
import { dealsQuery } from "@/features/deals/api/queries";
import { peopleQuery } from "@/features/people/api/queries";
import { tasksQuery } from "@/features/tasks/api/queries";
import {
	favouritesQuery,
	listsQuery,
	membersQuery,
	meQuery,
	notificationsQuery,
} from "@/features/workspace/api/queries";
import { ensureQueries } from "@/lib/ensure-queries";
import { isSignedIn } from "@/lib/session";

export const Route = createFileRoute("/_app")({
	// The guard for every app screen. ▶ With real auth, isSignedIn reads your provider's session.
	beforeLoad: ({ location }) => {
		if (!isSignedIn()) {
			throw redirect({ to: "/sign-in", search: { next: location.href }, replace: true });
		}
	},
	loader: ({ context }) =>
		ensureQueries(
			context.queryClient,
			meQuery,
			membersQuery,
			listsQuery,
			favouritesQuery,
			notificationsQuery,
			tasksQuery,
			// The shell's breadcrumb and lookups read these on every page.
			companiesQuery,
			peopleQuery,
			dealsQuery,
		),
	component: () => (
		<AppShell>
			<Outlet />
		</AppShell>
	),
});
