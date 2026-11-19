import { Skeleton } from "@repo/ui/components/skeleton";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Change } from "@/components/kit/change";
import { PriceChart } from "@/components/kit/charts/price-chart";
import { Panel } from "@/components/kit/panel";
import { RangeTabs } from "@/components/kit/range-tabs";
import { portfolioHistoryQuery, portfolioSummaryQuery } from "@/features/overview/api/queries";
import { type ChartRange, RANGE_LABEL } from "@/lib/ranges";
import { useFormat } from "@/lib/use-format";

export function PortfolioChartCard() {
	const [range, setRange] = useState<ChartRange>("1M");
	const format = useFormat();
	const summary = useQuery(portfolioSummaryQuery);
	const history = useQuery({ ...portfolioHistoryQuery(range), placeholderData: keepPreviousData });

	const points = history.data?.points ?? [];
	const base = history.data?.base ?? 0;
	// The headline follows the live summary; the range change compares it with the range's start.
	const value = summary.data?.value ?? points[points.length - 1]?.value ?? 0;
	const change = range === "1D" ? (summary.data?.dayChange ?? 0) : value - base;
	const pct = range === "1D" ? (summary.data?.dayChangePct ?? 0) : base ? (change / base) * 100 : 0;

	return (
		<Panel aria-labelledby="portfolio-value-label">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<p id="portfolio-value-label" className="text-muted-foreground text-sm">
						Portfolio value
					</p>
					{summary.data ? (
						<>
							<p
								className="mt-1 font-semibold text-4xl tracking-tight tabular-nums"
								aria-live="polite"
							>
								{format.currency(value, { compact: false })}
							</p>
							<p className="mt-1 text-sm">
								<Change value={change}>
									{format.currency(change, { signed: true, compact: false })} (
									{format.percent(pct, { signed: true })})
								</Change>
								<span className="text-muted-foreground"> {RANGE_LABEL[range]}</span>
							</p>
						</>
					) : (
						<div className="mt-2 space-y-2">
							<Skeleton className="h-9 w-52" />
							<Skeleton className="h-4 w-36" />
						</div>
					)}
				</div>
				<RangeTabs value={range} onChange={setRange} label="Portfolio chart range" />
			</div>
			<div className="mt-6" aria-busy={history.isFetching}>
				{history.data ? (
					<div
						className={
							history.isPlaceholderData ? "opacity-60 transition-opacity" : "transition-opacity"
						}
					>
						<PriceChart
							data={points.map((p) => ({ t: p.t, close: p.value }))}
							range={range}
							base={base}
							height={300}
							label="Portfolio value"
							tone="tint"
							baseLabel="Starting value"
							formatValue={(v) => format.currency(v, { compact: true, digits: 0 })}
							formatChange={(v, p) =>
								`${format.currency(v, { signed: true, digits: 0 })} (${format.percent(p, { signed: true })})`
							}
						/>
					</div>
				) : (
					<Skeleton className="h-[300px] w-full rounded-xl" />
				)}
			</div>
			{summary.data ? (
				<dl className="mt-5 grid grid-cols-3 gap-4 border-t pt-4 text-sm">
					<div>
						<dt className="text-muted-foreground text-xs">Invested</dt>
						<dd className="font-medium tabular-nums">{format.currency(summary.data.invested)}</dd>
					</div>
					<div>
						<dt className="text-muted-foreground text-xs">Cash</dt>
						<dd className="font-medium tabular-nums">{format.currency(summary.data.cash)}</dd>
					</div>
					<div>
						<dt className="text-muted-foreground text-xs">Total return</dt>
						<dd className="font-medium">
							<Change value={summary.data.totalPnl}>
								{format.percent(summary.data.totalPnlPct, { signed: true })}
							</Change>
						</dd>
					</div>
				</dl>
			) : null}
		</Panel>
	);
}
