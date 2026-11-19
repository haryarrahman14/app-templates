import { createRouter } from "@tanstack/react-router";
import { RouteErrorState } from "@/components/kit/error-state";
import { createQueryClient } from "@/lib/query-client";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
	const queryClient = createQueryClient();

	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreload: "intent",
		// Loaders only warm the query cache; TanStack Query decides what is fresh.
		defaultPreloadStaleTime: 0,
		defaultErrorComponent: RouteErrorState,
	});
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
