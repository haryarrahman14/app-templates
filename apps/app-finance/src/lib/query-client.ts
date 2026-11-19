import { QueryClient } from "@tanstack/react-query";

/** One QueryClient for the tab, created with the router and shared through its context. */
export function createQueryClient() {
	return new QueryClient({ defaultOptions: { queries: { staleTime: 60_000 } } });
}
