import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { getSession, REQUIRE_SIGN_IN } from "@/lib/session";

/** Sign-in, sign-up and password reset. Signed-in visitors go straight to the app. */
export const Route = createFileRoute("/_auth")({
	beforeLoad: () => {
		if (REQUIRE_SIGN_IN && getSession()) throw redirect({ to: "/" });
	},
	component: () => (
		<AuthLayout>
			<Outlet />
		</AuthLayout>
	),
});
