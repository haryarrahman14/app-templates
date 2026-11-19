import { queryOptions } from "@tanstack/react-query";
import { screenerRowSchema, sectorTileSchema } from "@/features/markets/schemas/screener";
import { sampleDelay } from "@/lib/delay";
import { LIVE_TICK_MS, queryRoots } from "@/lib/query-keys";
import { currentTick, liveQuote, sparkline } from "@/lib/sample-data/prices";
import { capBucket, UNIVERSE } from "@/lib/sample-data/universe";
import { sectorMoves } from "@/lib/sample-data/valuation";

/** Screener rows with live sample quotes. Replace with your market-data API (one call per page or all). */
async function listScreenerRows() {
	await sampleDelay(300);
	const tick = currentTick(LIVE_TICK_MS);
	return screenerRowSchema.array().parse(
		UNIVERSE.map((entry) => {
			const quote = liveQuote(entry.symbol, tick);
			return {
				symbol: entry.symbol,
				name: entry.name,
				sector: entry.sector,
				price: quote.price,
				change: quote.change,
				changePct: quote.changePct,
				capBn: entry.capBn,
				capBucket: capBucket(entry.capBn),
				volume: quote.volume,
				pe: entry.pe,
				dividendYield: entry.dividendYield,
				spark: sparkline(entry.symbol, 30),
			};
		}),
	);
}

export const screenerQuery = queryOptions({
	queryKey: [...queryRoots.quotes, "screener"],
	queryFn: listScreenerRows,
	refetchInterval: LIVE_TICK_MS,
});

/** Cap-weighted move per sector for the heatmap. */
async function listSectorTiles() {
	await sampleDelay(260);
	return sectorTileSchema.array().parse(sectorMoves(currentTick(LIVE_TICK_MS)));
}

export const sectorTilesQuery = queryOptions({
	queryKey: [...queryRoots.quotes, "sectors"],
	queryFn: listSectorTiles,
	refetchInterval: LIVE_TICK_MS,
});
