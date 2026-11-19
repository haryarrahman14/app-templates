import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Change } from "@/components/kit/change";
import { Sparkline } from "@/components/kit/charts/sparkline";
import { InstrumentMark } from "@/components/kit/instrument-mark";
import { Panel, PanelHeader } from "@/components/kit/panel";
import { ListSkeleton } from "@/components/kit/skeletons";
import { relatedQuery } from "@/features/instruments/api/queries";
import { useFormat } from "@/lib/use-format";

export function RelatedCard({ symbol }: { symbol: string }) {
	const { data } = useQuery(relatedQuery(symbol));
	const format = useFormat();
	if (!data) return <ListSkeleton rows={5} />;
	return (
		<Panel aria-labelledby="related-title">
			<PanelHeader id="related-title" title="Related" description="Same sector and similar risk" />
			<ul className="-mx-2">
				{data.map((item) => (
					<li key={item.symbol}>
						<Link
							to="/markets/$symbol"
							params={{ symbol: item.symbol }}
							className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-foreground/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
						>
							<InstrumentMark symbol={item.symbol} />
							<span className="min-w-0 flex-1">
								<span className="block font-medium text-sm">{item.symbol}</span>
								<span className="block truncate text-muted-foreground text-xs">{item.name}</span>
							</span>
							<Sparkline values={item.spark} width={56} height={22} />
							<span className="w-20 text-right text-sm">
								<span className="block tabular-nums">{format.currency(item.price)}</span>
								<Change value={item.changePct} className="justify-end text-xs">
									{format.percent(item.changePct, { signed: true })}
								</Change>
							</span>
						</Link>
					</li>
				))}
			</ul>
		</Panel>
	);
}
