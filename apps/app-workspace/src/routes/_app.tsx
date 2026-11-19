import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppShell, ShellPlaceholder } from "@/components/layout/app-shell";
import { ShellNotFoundScreen } from "@/components/layout/not-found-screen";
import { getSession } from "@/lib/session";

/** The signed-in area. Without a session every screen here redirects to sign-in and comes back. */
export const Route = createFileRoute("/_app")({
	beforeLoad: ({ location }) => {
		const user = getSession();
		if (!user) {
			throw redirect({
				to: "/sign-in",
				search: {
					next: location.pathname === "/" && !location.searchStr ? undefined : location.href,
				},
			});
		}
		return { user };
	},
	pendingComponent: ShellPlaceholder,
	notFoundComponent: ShellNotFoundScreen,
	component: () => (
		<AppShell>
			<Outlet />
		</AppShell>
	),
});
