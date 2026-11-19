import { Skeleton } from "@repo/ui/components/skeleton";
import { cn } from "@repo/ui/lib/cn";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { CandlestickChartIcon, LineChartIcon } from "lucide-react";
import { useState } from "react";
import { PriceChart } from "@/components/kit/charts/price-chart";
import { Panel } from "@/components/kit/panel";
import { RangeTabs } from "@/components/kit/range-tabs";
import { barsQuery } from "@/features/instruments/api/queries";
import { DEFAULT_INSTRUMENT_RANGE } from "@/features/instruments/constants/chart";
import { type ChartRange, RANGE_LABEL } from "@/lib/ranges";
import { useFormat } from "@/lib/use-format";

export function InstrumentChart({ symbol }: { symbol: string }) {
	const [range, setRange] = useState<ChartRange>(DEFAULT_INSTRUMENT_RANGE);
	const [mode, setMode] = useState<"line" | "candle">("line");
	const format = useFormat();
	const { data, isPlaceholderData } = useQuery({
		...barsQuery(symbol, range),
		placeholderData: keepPreviousData,
	});

	const last = data?.bars[data.bars.length - 1];
	const change = last && data ? last.close - data.base : 0;
	const pct = data?.base ? (change / data.base) * 100 : 0;

	return (
		<Panel aria-label={`${symbol} price chart`}>
			<div className="flex flex-wrap items-center justify-between gap-3">
				<p className="text-muted-foreground text-sm">
					{data ? (
						<>
							<span className={change >= 0 ? "text-gain" : "text-loss"}>
								{change >= 0 ? "▲" : "▼"} {format.percent(pct, { signed: true })}
							</span>{" "}
							{RANGE_LABEL[range]}
						</>
					) : (
						" "
					)}
				</p>
				<div className="flex items-center gap-2">
					<RangeTabs value={range} onChange={setRange} label={`${symbol} chart range`} />
					<div
						role="radiogroup"
						aria-label="Chart type"
						className="inline-flex rounded-full bg-foreground/[0.05] p-0.5"
					>
						{(
							[
								["line", LineChartIcon, "Line"],
								["candle", CandlestickChartIcon, "Candles"],
							] as const
						).map(([value, Icon, label]) => (
							// biome-ignore lint/a11y/useSemanticElements: segmented control, ARIA radio pattern.
							<button
								key={value}
								type="button"
								role="radio"
								aria-checked={mode === value}
								aria-label={label}
								title={label}
								onClick={() => setMode(value)}
								className={cn(
									"rounded-full p-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
									mode === value
										? "bg-background text-foreground shadow-sm dark:bg-foreground/15"
										: "text-muted-foreground hover:text-foreground",
								)}
							>
								<Icon aria-hidden className="size-3.5" />
							</button>
						))}
					</div>
				</div>
			</div>
			<div className={cn("mt-4 transition-opacity", isPlaceholderData && "opacity-60")}>
				{data ? (
					<PriceChart
						data={data.bars}
						range={range}
						base={data.base}
						mode={mode}
						height={340}
						label={`${symbol} price`}
						formatValue={(v) => format.currency(v, { compact: false })}
						formatChange={(v, p) =>
							`${format.currency(v, { signed: true })} (${format.percent(p, { signed: true })})`
						}
					/>
				) : (
					<Skeleton className="h-[340px] w-full rounded-xl" />
				)}
			</div>
		</Panel>
	);
}
