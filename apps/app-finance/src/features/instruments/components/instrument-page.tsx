import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ChevronLeftIcon } from "lucide-react";
import { Change } from "@/components/kit/change";
import { InstrumentMark } from "@/components/kit/instrument-mark";
import { instrumentQuery, quoteQuery } from "@/features/instruments/api/queries";
import { AboutCard } from "@/features/instruments/components/about-card";
import { InstrumentChart } from "@/features/instruments/components/instrument-chart";
import { KeyStats } from "@/features/instruments/components/key-stats";
import { PositionCard } from "@/features/instruments/components/position-card";
import { RelatedCard } from "@/features/instruments/components/related-card";
import { WatchButton } from "@/features/instruments/components/watch-button";
import { LIVE_TICK_MS } from "@/lib/query-keys";
import { useFormat } from "@/lib/use-format";

export function InstrumentPage({ symbol }: { symbol: string }) {
	const { data: instrument } = useSuspenseQuery(instrumentQuery(symbol));
	const { data: quote } = useSuspenseQuery(quoteQuery(symbol));
	const format = useFormat();
	if (!instrument) return null;

	return (
		<div className="space-y-6">
			<Link
				to="/markets"
				className="inline-flex items-center gap-1 text-muted-foreground text-sm hover:text-foreground"
			>
				<ChevronLeftIcon aria-hidden className="size-4" />
				Markets
			</Link>
			<header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
				<div className="flex items-start gap-4">
					<InstrumentMark symbol={instrument.symbol} className="size-12 rounded-xl text-sm" />
					<div>
						<p className="text-muted-foreground text-sm">
							{instrument.symbol} · {instrument.sector}
						</p>
						<h1 className="font-semibold text-2xl tracking-tight sm:text-3xl">{instrument.name}</h1>
						<p className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
							<span className="font-semibold text-3xl tabular-nums" aria-live="polite">
								{format.currency(quote.price)}
							</span>
							<Change value={quote.change} className="text-sm">
								{format.currency(quote.change, { signed: true })} (
								{format.percent(quote.changePct, { signed: true })}) today
							</Change>
						</p>
						<p className="mt-1 text-muted-foreground text-xs">
							Sample quote · ticks every {LIVE_TICK_MS / 1000} seconds
						</p>
					</div>
				</div>
				<WatchButton symbol={instrument.symbol} />
			</header>

			<div className="grid gap-6 lg:grid-cols-3">
				<div className="flex min-w-0 flex-col gap-6 lg:col-span-2">
					<InstrumentChart symbol={instrument.symbol} />
					<KeyStats instrument={instrument} />
					<AboutCard instrument={instrument} />
				</div>
				<div className="flex min-w-0 flex-col gap-6">
					<PositionCard symbol={instrument.symbol} price={quote.price} />
					<RelatedCard symbol={instrument.symbol} />
				</div>
			</div>
		</div>
	);
}
