import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { ShellErrorScreen } from "@/components/layout/error-screen";
import { PageSkeleton } from "@/components/layout/page-skeleton";
import { createQueryClient } from "@/lib/query-client";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
	const queryClient = createQueryClient();

	const router = createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreload: "intent",
		// Preloads go through TanStack Query, which has its own staleTime.
		defaultPreloadStaleTime: 0,
		// Route states for the signed-in screens; the root and onboarding set full-page ones.
		defaultPendingComponent: PageSkeleton,
		defaultErrorComponent: ShellErrorScreen,
	});

	// Wraps the app in QueryClientProvider (there is no server data to dehydrate in a static SPA).
	setupRouterSsrQueryIntegration({ router, queryClient });

	return router;
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
