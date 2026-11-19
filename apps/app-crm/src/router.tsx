import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { ErrorState } from "@/components/kit/error-state";
import { NotFoundState } from "@/components/kit/not-found-state";
import { PageLoading } from "@/components/kit/page-loading";
import { createQueryClient } from "@/lib/query-client";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
	const queryClient = createQueryClient();

	const router = createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreload: "intent",
		// Loaders only fill the query cache; TanStack Query decides what is fresh.
		defaultPreloadStaleTime: 0,
		// Shown inside the nearest layout (the app shell keeps its sidebar), as loading/error/not-found did.
		defaultPendingComponent: PageLoading,
		defaultErrorComponent: ({ error, reset }) => <ErrorState error={error} reset={reset} />,
		defaultNotFoundComponent: () => <NotFoundState />,
	});

	// Wraps the app in QueryClientProvider (and would hand queries over if a page were ever prerendered).
	setupRouterSsrQueryIntegration({ router, queryClient });

	return router;
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
