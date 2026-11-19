import type { QueryClient, QueryKey } from "@tanstack/react-query";

/**
 * Optimistic list update: cancel in-flight fetches, apply `update` to the cached list, and return
 * a rollback. Use in a mutation's onMutate; call the rollback in onError; invalidate in onSettled.
 */
export async function patchList<T>(
	queryClient: QueryClient,
	queryKey: QueryKey,
	update: (items: T[]) => T[],
) {
	await queryClient.cancelQueries({ queryKey });
	const previous = queryClient.getQueryData<T[]>(queryKey);
	if (previous) queryClient.setQueryData<T[]>(queryKey, update(previous));
	return () => queryClient.setQueryData(queryKey, previous);
}

export type Rollback = () => void;
