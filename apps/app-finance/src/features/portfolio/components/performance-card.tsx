import { Skeleton } from "@repo/ui/components/skeleton";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Change } from "@/components/kit/change";
import { PriceChart } from "@/components/kit/charts/price-chart";
import { Panel, PanelHeader } from "@/components/kit/panel";
import { RangeTabs } from "@/components/kit/range-tabs";
import { performanceQuery } from "@/features/portfolio/api/queries";
import type { ChartRange } from "@/lib/ranges";
import { useFormat } from "@/lib/use-format";

export function PerformanceCard() {
	const [range, setRange] = useState<ChartRange>("YTD");
	const format = useFormat();
	const { data } = useQuery({ ...performanceQuery(range), placeholderData: keepPreviousData });
	const last = data?.points[data.points.length - 1];
	const mine = last && data ? ((last.value - data.base) / data.base) * 100 : 0;
	const bench = last && data ? ((last.benchmark - data.base) / data.base) * 100 : 0;

	return (
		<Panel aria-labelledby="perf-title">
			<PanelHeader
				id="perf-title"
				title="Performance vs benchmark"
				description={
					data ? `Dashed line: ${data.benchmarkName}, rescaled to your starting value` : " "
				}
				action={
					<RangeTabs
						value={range}
						onChange={setRange}
						ranges={["1M", "3M", "YTD", "1Y"]}
						label="Performance range"
					/>
				}
			/>
			{data ? (
				<>
					<dl className="mb-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
						<div>
							<dt className="text-muted-foreground text-xs">Your portfolio</dt>
							<dd className="font-medium">
								<Change value={mine}>{format.percent(mine, { signed: true })}</Change>
							</dd>
						</div>
						<div>
							<dt className="text-muted-foreground text-xs">Benchmark</dt>
							<dd className="font-medium">
								<Change value={bench}>{format.percent(bench, { signed: true })}</Change>
							</dd>
						</div>
						<div>
							<dt className="text-muted-foreground text-xs">Difference</dt>
							<dd className="font-medium">
								<Change value={mine - bench}>
									{format.percent(mine - bench, { signed: true })} pts
								</Change>
							</dd>
						</div>
					</dl>
					<PriceChart
						data={data.points.map((p) => ({ t: p.t, close: p.value, compare: p.benchmark }))}
						range={range}
						base={data.base}
						height={260}
						label="Portfolio value against benchmark"
						tone="tint"
						compareLabel="Benchmark"
						baseLabel="Starting value"
						formatValue={(v) => format.currency(v, { compact: true, digits: 0 })}
						formatChange={(v, p) =>
							`${format.currency(v, { signed: true, digits: 0 })} (${format.percent(p, { signed: true })})`
						}
					/>
				</>
			) : (
				<Skeleton className="h-[300px] w-full rounded-xl" />
			)}
		</Panel>
	);
}
