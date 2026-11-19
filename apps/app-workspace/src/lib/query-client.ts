import { QueryClient } from "@tanstack/react-query";

/** One QueryClient per router, so one for the tab. */
export function createQueryClient() {
	return new QueryClient({ defaultOptions: { queries: { staleTime: 60_000 } } });
}
