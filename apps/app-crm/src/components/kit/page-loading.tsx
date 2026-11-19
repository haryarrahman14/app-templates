import { Skeleton } from "@repo/ui/components/skeleton";

/** Route-level loading: a calm page skeleton rather than a spinner. */
export function PageLoading() {
	return (
		<div
			className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 md:px-8"
			aria-busy="true"
		>
			<span className="sr-only">Loading…</span>
			<div className="flex items-end justify-between">
				<div className="space-y-2">
					<Skeleton className="h-7 w-48 rounded-lg" />
					<Skeleton className="h-4 w-72 rounded-md" />
				</div>
				<Skeleton className="h-8 w-28 rounded-lg" />
			</div>
			<div className="grid gap-4 sm:grid-cols-3">
				{[0, 1, 2].map((index) => (
					<Skeleton key={index} className="h-28 rounded-2xl" />
				))}
			</div>
			<div className="space-y-2 rounded-2xl border p-4">
				{[0, 1, 2, 3, 4, 5].map((index) => (
					<Skeleton key={index} className="h-9 rounded-lg" />
				))}
			</div>
		</div>
	);
}
