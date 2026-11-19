import { Skeleton } from "@repo/ui/components/skeleton";

/** Route-level loading state shown while a screen's code loads. */
export function PageSkeleton({ variant = "page" }: { variant?: "page" | "document" }) {
	if (variant === "document") {
		return (
			<div className="mx-auto w-full max-w-2xl space-y-4 px-6 pt-20 sm:px-12" aria-busy="true">
				<Skeleton className="size-10 rounded-xl" />
				<Skeleton className="h-10 w-3/4" />
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-5/6" />
			</div>
		);
	}
	return (
		<div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-6 sm:px-8 sm:py-10" aria-busy="true">
			<div className="space-y-2">
				<Skeleton className="h-4 w-32" />
				<Skeleton className="h-9 w-72" />
			</div>
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{["a", "b", "c", "d"].map((key) => (
					<Skeleton key={key} className="h-40 rounded-2xl" />
				))}
			</div>
		</div>
	);
}

export function DocumentSkeleton() {
	return <PageSkeleton variant="document" />;
}
