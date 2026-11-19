import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { NotFoundPanel } from "@/components/kit/not-found-panel";
import { AppShell } from "@/components/layout/app-shell";
import { readSession } from "@/lib/session";

/** The signed-in area: every route under it needs a session. */
export const Route = createFileRoute("/_app")({
	beforeLoad: ({ location }) => {
		// PLUG REAL AUTH HERE: ask your provider's SDK for the current user (see lib/session.ts).
		const session = readSession();
		if (!session) {
			throw redirect({
				to: "/sign-in",
				search: location.pathname === "/" ? {} : { next: location.href },
				replace: true,
			});
		}
		return { session };
	},
	component: AppLayout,
	notFoundComponent: NotFoundPanel,
});

function AppLayout() {
	const { session } = Route.useRouteContext();
	return (
		<AppShell session={session}>
			<Outlet />
		</AppShell>
	);
}
