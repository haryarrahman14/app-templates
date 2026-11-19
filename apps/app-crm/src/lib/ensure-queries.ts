import type { FetchQueryOptions, QueryClient } from "@tanstack/react-query";

/**
 * Loader helper for thin route files: fill the cache before the page renders, and keep what this tab
 * already has (sample changes live in the cache). Usage:
 * `loader: ({ context }) => ensureQueries(context.queryClient, companiesQuery, peopleQuery)`.
 */
export async function ensureQueries(
	queryClient: QueryClient,
	// biome-ignore lint/suspicious/noExplicitAny: queryOptions of any shape.
	...queries: FetchQueryOptions<any, any, any, any>[]
) {
	await Promise.all(queries.map((query) => queryClient.ensureQueryData(query)));
}
