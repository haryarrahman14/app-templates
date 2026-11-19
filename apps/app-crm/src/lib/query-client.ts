import { QueryClient } from "@tanstack/react-query";

/** One client for the tab. The router creates it and hands it to route loaders through context. */
export function createQueryClient() {
	return new QueryClient({ defaultOptions: { queries: { staleTime: 60_000 } } });
}
