import { QueryClient } from "@tanstack/react-query";

/** One QueryClient per router: per request on the server, one for the tab in the browser. */
export function createQueryClient() {
	return new QueryClient({ defaultOptions: { queries: { staleTime: 60_000 } } });
}
