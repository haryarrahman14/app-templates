import { Button } from "@repo/ui/components/button";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Change } from "@/components/kit/change";
import { MeterBar } from "@/components/kit/charts/sparkline";
import { Panel, PanelHeader } from "@/components/kit/panel";
import { ListSkeleton } from "@/components/kit/skeletons";
import { allocationQuery } from "@/features/overview/api/queries";
import { useFormat } from "@/lib/use-format";

export function AllocationCard() {
	const { data } = useQuery(allocationQuery);
	const format = useFormat();
	if (!data) return <ListSkeleton rows={6} />;
	const max = Math.max(...data.map((row) => row.weight));
	return (
		<Panel aria-labelledby="allocation-title">
			<PanelHeader
				id="allocation-title"
				title="Sectors"
				description="Share of holdings and today's move"
				action={
					<Button variant="ghost" size="sm" asChild>
						<Link to="/portfolio">Details</Link>
					</Button>
				}
			/>
			<ul className="space-y-3">
				{data.map((row) => (
					<li key={row.sector} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1.5">
						<span className="truncate text-sm">{row.sector}</span>
						<span className="flex items-center gap-3 text-sm">
							<span className="w-12 text-right text-muted-foreground tabular-nums">
								{format.percent(row.weight, { digits: 1 })}
							</span>
							<Change value={row.changePct} className="w-16 justify-end text-xs">
								{format.percent(row.changePct, { signed: true })}
							</Change>
						</span>
						<MeterBar value={row.weight} max={max} tone="muted" className="col-span-2" />
					</li>
				))}
			</ul>
		</Panel>
	);
}
