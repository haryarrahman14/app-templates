import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Change } from "@/components/kit/change";
import { Sparkline } from "@/components/kit/charts/sparkline";
import { InstrumentMark } from "@/components/kit/instrument-mark";
import { Panel, PanelHeader } from "@/components/kit/panel";
import { moversQuery } from "@/features/overview/api/queries";
import { useFormat } from "@/lib/use-format";

export function MoversCard() {
	const { data } = useSuspenseQuery(moversQuery);
	const format = useFormat();
	return (
		<Panel aria-labelledby="movers-title">
			<PanelHeader id="movers-title" title="Top movers" description="Biggest moves today" />
			<ul className="-mx-2">
				{data.map((m) => (
					<li key={m.symbol}>
						<Link
							to="/markets/$symbol"
							params={{ symbol: m.symbol }}
							className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-foreground/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
						>
							<InstrumentMark symbol={m.symbol} />
							<span className="min-w-0 flex-1">
								<span className="block font-medium text-sm">{m.symbol}</span>
								<span className="block truncate text-muted-foreground text-xs">{m.name}</span>
							</span>
							<Sparkline
								values={m.spark}
								width={56}
								height={22}
								trend={m.changePct >= 0 ? "up" : "down"}
							/>
							<span className="w-20 text-right text-sm">
								<span className="block tabular-nums">{format.currency(m.price)}</span>
								<Change value={m.changePct} className="justify-end text-xs">
									{format.percent(m.changePct, { signed: true })}
								</Change>
							</span>
						</Link>
					</li>
				))}
			</ul>
		</Panel>
	);
}
