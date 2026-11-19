import { Skeleton } from "@repo/ui/components/skeleton";
import { cn } from "@repo/ui/lib/cn";
import { Panel } from "@/components/kit/panel";

/** A chart-shaped placeholder: header numbers, then a soft wave where the line will be. */
export function ChartSkeleton({
	className,
	height = 280,
}: {
	className?: string;
	height?: number;
}) {
	return (
		<Panel className={className} aria-busy aria-label="Loading chart">
			<div className="flex items-start justify-between gap-4">
				<div className="space-y-2">
					<Skeleton className="h-4 w-28" />
					<Skeleton className="h-9 w-48" />
					<Skeleton className="h-4 w-24" />
				</div>
				<Skeleton className="h-7 w-56 rounded-full" />
			</div>
			<div className="relative mt-6 overflow-hidden" style={{ height }}>
				<svg
					aria-hidden
					viewBox="0 0 400 100"
					preserveAspectRatio="none"
					className="absolute inset-0 size-full animate-pulse text-foreground/10"
				>
					<path
						d="M0 70 C40 60 60 80 100 62 S160 30 200 45 S270 70 300 40 S360 20 400 28 L400 100 L0 100 Z"
						fill="currentColor"
					/>
				</svg>
			</div>
		</Panel>
	);
}

export function ListSkeleton({ rows = 5, className }: { rows?: number; className?: string }) {
	return (
		<Panel className={className} aria-busy aria-label="Loading list">
			<Skeleton className="mb-5 h-4 w-32" />
			<div className="space-y-4">
				{Array.from({ length: rows }, (_, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: static placeholder rows.
					<div key={i} className="flex items-center gap-3">
						<Skeleton className="size-8 rounded-lg" />
						<div className="flex-1 space-y-1.5">
							<Skeleton className="h-3.5 w-1/3" />
							<Skeleton className="h-3 w-1/5" />
						</div>
						<Skeleton className="h-4 w-16" />
					</div>
				))}
			</div>
		</Panel>
	);
}

export function TableSkeleton({ rows = 8, className }: { rows?: number; className?: string }) {
	return (
		<Panel className={cn("p-0 sm:p-0", className)} aria-busy aria-label="Loading table">
			<div className="flex gap-3 border-b p-4">
				<Skeleton className="h-8 w-56" />
				<Skeleton className="h-8 w-28" />
				<Skeleton className="ml-auto h-8 w-24" />
			</div>
			<div className="divide-y">
				{Array.from({ length: rows }, (_, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: static placeholder rows.
					<div key={i} className="flex items-center gap-4 px-4 py-3.5">
						<Skeleton className="size-7 rounded-lg" />
						<Skeleton className="h-3.5 w-40" />
						<Skeleton className="ml-auto h-3.5 w-20" />
						<Skeleton className="h-3.5 w-16" />
						<Skeleton className="hidden h-5 w-20 sm:block" />
					</div>
				))}
			</div>
		</Panel>
	);
}

export function TilesSkeleton({ count = 4 }: { count?: number }) {
	return (
		<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
			{Array.from({ length: count }, (_, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: static placeholder tiles.
				<Panel key={i} className="space-y-2">
					<Skeleton className="h-3.5 w-20" />
					<Skeleton className="h-7 w-28" />
				</Panel>
			))}
		</div>
	);
}

export function PageSkeleton({
	variant = "dashboard",
}: {
	variant?: "dashboard" | "table" | "detail";
}) {
	return (
		<div className="space-y-6" aria-busy role="status" aria-label="Loading page">
			<div className="space-y-2">
				<Skeleton className="h-8 w-56" />
				<Skeleton className="h-4 w-80 max-w-full" />
			</div>
			{variant === "table" ? (
				<>
					<TilesSkeleton />
					<TableSkeleton />
				</>
			) : (
				<div className="grid gap-6 lg:grid-cols-3">
					<ChartSkeleton className="lg:col-span-2" height={variant === "detail" ? 340 : 280} />
					<ListSkeleton />
					<ListSkeleton className="lg:col-span-2" rows={4} />
					<ListSkeleton rows={4} />
				</div>
			)}
		</div>
	);
}
