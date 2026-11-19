import type { ChartRange } from "@/lib/ranges";
import type { Holding } from "./account-store";
import { barsForRange, liveQuote, rangeBase } from "./prices";
import { round } from "./random";
import { BENCHMARK, findInstrument, SECTORS, UNIVERSE } from "./universe";

/**
 * Portfolio maths over the sample account, shared by Overview and Portfolio. Uses today's holdings
 * across the whole range (a "current holdings" view), which is what most dashboards show.
 */
export function portfolioSeries(holdings: Holding[], cash: number, range: ChartRange) {
	const series = holdings.map((h) => ({ h, bars: barsForRange(h.symbol, range) }));
	const length = Math.min(...series.map((s) => s.bars.length));
	const points: { t: number; value: number }[] = [];
	for (let i = 0; i < length; i++) {
		let value = cash;
		let t = 0;
		for (const { h, bars } of series) {
			const bar = bars[bars.length - length + i];
			if (!bar) continue;
			value += bar.close * h.quantity;
			t = bar.t;
		}
		points.push({ t, value: round(value) });
	}
	const base = holdings.reduce((sum, h) => sum + rangeBase(h.symbol, range) * h.quantity, cash);
	return { points, base: round(base) };
}

/** Benchmark line rescaled to start at the portfolio's starting value. */
export function benchmarkSeries(range: ChartRange, startValue: number) {
	const bars = barsForRange(BENCHMARK.symbol, range);
	const base = rangeBase(BENCHMARK.symbol, range);
	return bars.map((bar) => ({ t: bar.t, value: round((bar.close / base) * startValue) }));
}

export function valueHoldings(holdings: Holding[], tick: number) {
	return holdings.map((h) => {
		const quote = liveQuote(h.symbol, tick);
		const entry = findInstrument(h.symbol);
		const value = quote.price * h.quantity;
		const cost = h.avgCost * h.quantity;
		return {
			symbol: h.symbol,
			name: entry?.name ?? h.symbol,
			sector: entry?.sector ?? "Technology",
			quantity: h.quantity,
			avgCost: h.avgCost,
			price: quote.price,
			value: round(value),
			cost: round(cost),
			dayChange: round(quote.change * h.quantity),
			dayChangePct: quote.changePct,
			pnl: round(value - cost),
			pnlPct: cost > 0 ? round(((value - cost) / cost) * 100) : 0,
		};
	});
}

export function sectorAllocation(holdings: Holding[], tick: number) {
	const valued = valueHoldings(holdings, tick);
	const total = valued.reduce((sum, h) => sum + h.value, 0) || 1;
	return SECTORS.map((sector) => {
		const items = valued.filter((h) => h.sector === sector);
		const value = items.reduce((sum, h) => sum + h.value, 0);
		const prev = items.reduce((sum, h) => sum + (h.value - h.dayChange), 0);
		return {
			sector,
			value: round(value),
			weight: round((value / total) * 100),
			changePct: prev > 0 ? round(((value - prev) / prev) * 100) : 0,
			count: items.length,
		};
	})
		.filter((s) => s.count > 0)
		.sort((a, b) => b.value - a.value);
}

/** Cap-weighted move per sector at a tick, with the biggest mover in each. */
export function sectorMoves(tick: number) {
	return SECTORS.map((sector) => {
		const members = UNIVERSE.filter((e) => e.sector === sector).map((e) => ({
			symbol: e.symbol,
			capBn: e.capBn,
			changePct: liveQuote(e.symbol, tick).changePct,
		}));
		const cap = members.reduce((sum, m) => sum + m.capBn, 0);
		const weighted = members.reduce((sum, m) => sum + m.changePct * m.capBn, 0) / (cap || 1);
		const leader = [...members].sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct))[0];
		return {
			sector,
			changePct: round(weighted),
			capBn: round(cap, 1),
			count: members.length,
			leader: { symbol: leader?.symbol ?? "", changePct: leader?.changePct ?? 0 },
		};
	});
}
