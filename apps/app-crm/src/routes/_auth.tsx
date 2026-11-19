import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { isSignedIn, REQUIRE_SIGN_IN, safeNext } from "@/lib/session";

export const Route = createFileRoute("/_auth")({
	// `next` is where the guard found the visitor; sign in and sign up return there.
	validateSearch: z.object({ next: z.string().optional().catch(undefined) }),
	beforeLoad: ({ search }) => {
		if (REQUIRE_SIGN_IN && isSignedIn())
			throw redirect({ href: safeNext(search.next), replace: true });
	},
	component: () => (
		<AuthLayout>
			<Outlet />
		</AuthLayout>
	),
});
