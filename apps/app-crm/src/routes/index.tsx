import { createFileRoute, redirect } from "@tanstack/react-router";
import { isSignedIn } from "@/lib/session";

export const Route = createFileRoute("/")({
	beforeLoad: () => {
		throw redirect({ to: isSignedIn() ? "/home" : "/sign-in", replace: true });
	},
});
