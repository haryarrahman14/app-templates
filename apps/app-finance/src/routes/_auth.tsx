import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { REQUIRE_SIGN_IN, readSession } from "@/lib/session";

/** Sign-in, sign-up and reset: signed-in visitors go straight to the overview. */
export const Route = createFileRoute("/_auth")({
	beforeLoad: () => {
		if (REQUIRE_SIGN_IN && readSession()) throw redirect({ to: "/", replace: true });
	},
	component: Outlet,
});
