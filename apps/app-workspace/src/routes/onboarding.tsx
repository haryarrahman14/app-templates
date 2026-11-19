import { createFileRoute, redirect } from "@tanstack/react-router";
import { ErrorScreen } from "@/components/layout/error-screen";
import { OnboardingFlow } from "@/features/onboarding/components/onboarding-flow";
import { getSession } from "@/lib/session";
import { pageTitle } from "@/lib/site";

export const Route = createFileRoute("/onboarding")({
	beforeLoad: ({ location }) => {
		const user = getSession();
		if (!user) throw redirect({ to: "/sign-in", search: { next: location.href } });
		return { user };
	},
	head: () => pageTitle("Welcome"),
	errorComponent: ErrorScreen,
	component: OnboardingRoute,
});

function OnboardingRoute() {
	const { user } = Route.useRouteContext();
	return <OnboardingFlow user={user} />;
}
