import { queryOptions } from "@tanstack/react-query";
import { alertSchema } from "@/features/alerts/schemas/alert";
import { sampleDelay } from "@/lib/delay";
import { LIVE_TICK_MS, queryRoots } from "@/lib/query-keys";
import { account } from "@/lib/sample-data/account-store";
import { currentTick, liveQuote } from "@/lib/sample-data/prices";
import { round } from "@/lib/sample-data/random";
import { findInstrument, UNIVERSE } from "@/lib/sample-data/universe";

/** Price alerts with the live sample price (browser-side account data). Swap for your alerts API. */
export const alertsQuery = queryOptions({
	queryKey: [...queryRoots.alerts],
	queryFn: async () => {
		await sampleDelay(280);
		const tick = currentTick(LIVE_TICK_MS);
		return alertSchema.array().parse(
			account().alerts.map((a) => {
				const current = liveQuote(a.symbol, tick).price;
				const distancePct = round(((a.price - current) / current) * 100);
				const triggered = a.condition === "above" ? current >= a.price : current <= a.price;
				return {
					...a,
					name: findInstrument(a.symbol)?.name ?? a.symbol,
					current,
					distancePct,
					triggered,
				};
			}),
		);
	},
	refetchInterval: LIVE_TICK_MS,
});

export const alertCandidates = UNIVERSE.map((e) => ({ symbol: e.symbol, name: e.name }));

export function currentSamplePrice(symbol: string) {
	return findInstrument(symbol) ? liveQuote(symbol, currentTick(LIVE_TICK_MS)).price : null;
}
