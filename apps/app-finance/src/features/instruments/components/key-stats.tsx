import { useSuspenseQuery } from "@tanstack/react-query";
import { MeterBar } from "@/components/kit/charts/sparkline";
import { Panel, PanelHeader } from "@/components/kit/panel";
import { Stat } from "@/components/kit/stat";
import { quoteQuery } from "@/features/instruments/api/queries";
import type { Instrument } from "@/features/instruments/schemas/instrument";
import { useFormat } from "@/lib/use-format";

export function KeyStats({ instrument }: { instrument: Instrument }) {
	const { data: quote } = useSuspenseQuery(quoteQuery(instrument.symbol));
	const format = useFormat();
	const position =
		((quote.price - instrument.yearLow) / (instrument.yearHigh - instrument.yearLow)) * 100;

	return (
		<Panel aria-labelledby="stats-title">
			<PanelHeader id="stats-title" title="Key stats" />
			<dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
				<Stat label="Open" value={format.currency(quote.open)} />
				<Stat label="Day high" value={format.currency(quote.high)} />
				<Stat label="Day low" value={format.currency(quote.low)} />
				<Stat label="Previous close" value={format.currency(quote.prevClose)} />
				<Stat
					label="Market cap"
					value={format.currency(instrument.capBn * 1e9, { compact: true })}
				/>
				<Stat
					label="P/E ratio"
					value={instrument.pe == null ? "n/a" : format.number(instrument.pe, { digits: 1 })}
				/>
				<Stat
					label="Dividend yield"
					value={format.percent(instrument.dividendYield, { digits: 2 })}
				/>
				<Stat label="Beta" value={format.number(instrument.beta, { digits: 2 })} />
				<Stat label="Volume" value={format.number(quote.volume, { compact: true })} />
				<Stat
					label="Avg volume (30d)"
					value={format.number(instrument.avgVolume, { compact: true })}
				/>
			</dl>
			<div className="mt-6">
				<div className="mb-2 flex justify-between text-muted-foreground text-xs">
					<span>52-week low {format.currency(instrument.yearLow)}</span>
					<span>52-week high {format.currency(instrument.yearHigh)}</span>
				</div>
				<div className="relative">
					<MeterBar value={100} tone="muted" className="h-1.5" />
					<span
						className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background bg-tint"
						style={{ left: `${Math.max(0, Math.min(100, position))}%` }}
						aria-hidden
					/>
				</div>
				<p className="sr-only">
					Current price is {Math.round(position)}% of the way from the 52-week low to the high.
				</p>
			</div>
		</Panel>
	);
}
