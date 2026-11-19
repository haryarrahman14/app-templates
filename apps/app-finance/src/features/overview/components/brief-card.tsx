import { Skeleton } from "@repo/ui/components/skeleton";
import { useQuery } from "@tanstack/react-query";
import { SparklesIcon } from "lucide-react";
import { Panel } from "@/components/kit/panel";
import { briefQuery } from "@/features/overview/api/queries";

export function BriefCard() {
	const { data } = useQuery(briefQuery);
	if (!data) {
		return (
			<Panel className="space-y-3" aria-busy aria-label="Loading daily brief">
				<Skeleton className="h-3.5 w-24" />
				<Skeleton className="h-6 w-full" />
				<Skeleton className="h-20 w-full" />
			</Panel>
		);
	}
	return (
		<Panel className="overflow-hidden" aria-labelledby="brief-title">
			<p className="relative inline-flex items-center gap-1.5 font-medium text-muted-foreground text-xs uppercase tracking-wide">
				<SparklesIcon aria-hidden className="size-3.5 text-muted-foreground" />
				<span id="brief-title">Daily brief</span>
			</p>
			<h2 className="relative mt-3 font-semibold text-lg leading-snug">{data.headline}</h2>
			<p className="relative mt-2 text-muted-foreground text-sm leading-relaxed">{data.body}</p>
			<ul className="relative mt-4 space-y-2 text-sm">
				{data.points.map((point) => (
					<li key={point} className="flex gap-2">
						<span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-muted-foreground" />
						{point}
					</li>
				))}
			</ul>
			<p className="relative mt-4 text-[11px] text-muted-foreground">
				Written from sample data. Not investment advice.
			</p>
		</Panel>
	);
}
