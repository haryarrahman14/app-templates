import type { ChartRange } from "@/lib/ranges";
import { DAY_MS, MARKET_OPEN_MIN, SAMPLE_AS_OF, START_OF_YEAR, tradingDays } from "./calendar";
import { gaussian, round, seeded } from "./random";
import { BENCHMARK, findInstrument } from "./universe";

/**
 * Deterministic generated prices. Daily closes are a seeded random walk that ends exactly on the
 * instrument's sample price; intraday bars are a seeded bridge between two closes. No real market data.
 */
export type Bar = {
	t: number;
	open: number;
	high: number;
	low: number;
	close: number;
	volume: number;
};

const HISTORY_DAYS = 260;

type Profile = { price: number; vol: number; drift: number; avgVolume: number };

function profileFor(symbol: string): Profile {
	if (symbol === BENCHMARK.symbol) return { ...BENCHMARK, avgVolume: 0 };
	const entry = findInstrument(symbol);
	if (!entry) throw new Error(`Unknown sample instrument ${symbol}`);
	return {
		price: entry.price,
		vol: entry.vol,
		drift: entry.drift,
		avgVolume: Math.round((entry.capBn * 1e9 * 0.004) / entry.price),
	};
}

const dailyCache = new Map<string, Bar[]>();

export function dailyBars(symbol: string): Bar[] {
	const cached = dailyCache.get(symbol);
	if (cached) return cached;
	const { price, vol, drift, avgVolume } = profileFor(symbol);
	const rand = seeded(`daily:${symbol}`);
	const days = tradingDays(HISTORY_DAYS);
	const dailyVol = vol / Math.sqrt(252);
	const dailyDrift = drift / 252;
	// Walk in log space, then shift so the last close lands on the sample price.
	const logs: number[] = [0];
	for (let i = 1; i < days.length; i++) {
		const prev = logs[i - 1] ?? 0;
		logs.push(prev + dailyDrift - (dailyVol * dailyVol) / 2 + dailyVol * gaussian(rand));
	}
	const shift = Math.log(price) - (logs[logs.length - 1] ?? 0);
	const closes = logs.map((l) => Math.exp(l + shift));
	const bars = days.map((t, i) => {
		const close = closes[i] ?? price;
		const prevClose = closes[i - 1] ?? close * (1 - dailyDrift);
		const open = prevClose * (1 + dailyVol * 0.3 * gaussian(rand));
		const wick = dailyVol * 0.6 * Math.abs(gaussian(rand));
		return {
			t,
			open: round(open),
			close: round(close),
			high: round(Math.max(open, close) * (1 + wick)),
			low: round(Math.min(open, close) * (1 - wick)),
			volume: Math.round(avgVolume * (0.6 + rand() * 0.9)),
		};
	});
	dailyCache.set(symbol, bars);
	return bars;
}

/** Bars inside one trading day, bridging from the previous close to that day's close. */
function intradayBars(symbol: string, day: Bar, prevClose: number, steps: number, stepMin: number) {
	const { vol, avgVolume } = profileFor(symbol);
	const rand = seeded(`intraday:${symbol}:${day.t}:${steps}`);
	const stepVol = vol / Math.sqrt(252 * steps);
	const walk: number[] = [0];
	for (let i = 1; i <= steps; i++) walk.push((walk[i - 1] ?? 0) + stepVol * gaussian(rand));
	const end = walk[steps] ?? 0;
	const target = Math.log(day.close / prevClose);
	const path = walk.map((w, i) => prevClose * Math.exp(w - (end - target) * (i / steps)));
	const bars: Bar[] = [];
	for (let i = 1; i <= steps; i++) {
		const open = path[i - 1] ?? prevClose;
		const close = path[i] ?? open;
		const wick = stepVol * 0.5 * Math.abs(gaussian(rand));
		bars.push({
			t: day.t + (MARKET_OPEN_MIN + i * stepMin) * 60_000,
			open: round(open),
			close: round(close),
			high: round(Math.max(open, close) * (1 + wick)),
			low: round(Math.min(open, close) * (1 - wick)),
			volume: Math.round((avgVolume / steps) * (0.5 + rand())),
		});
	}
	return bars;
}

/** Bars for a chart range, oldest first. The first bar's open is the reference for the range change. */
export function barsForRange(symbol: string, range: ChartRange): Bar[] {
	const daily = dailyBars(symbol);
	const last = daily.length - 1;
	switch (range) {
		case "1D": {
			const day = daily[last];
			const prev = daily[last - 1];
			if (!day || !prev) return [];
			return intradayBars(symbol, day, prev.close, 78, 5);
		}
		case "1W": {
			const bars: Bar[] = [];
			for (let i = last - 4; i <= last; i++) {
				const day = daily[i];
				const prev = daily[i - 1];
				if (day && prev) bars.push(...intradayBars(symbol, day, prev.close, 13, 30));
			}
			return bars;
		}
		case "1M":
			return daily.slice(-22);
		case "3M":
			return daily.slice(-64);
		case "YTD":
			return daily.filter((bar) => bar.t >= START_OF_YEAR);
		case "1Y":
			return daily.slice(-252);
	}
}

/** Reference price a range's change is measured from (the close before the range starts). */
export function rangeBase(symbol: string, range: ChartRange) {
	const daily = dailyBars(symbol);
	const bars = barsForRange(symbol, range);
	const first = bars[0];
	if (!first) return daily[daily.length - 1]?.close ?? 0;
	if (range === "1D" || range === "1W") {
		const firstDayIndex = daily.findIndex((d) => d.t === Math.floor(first.t / DAY_MS) * DAY_MS);
		return daily[firstDayIndex - 1]?.close ?? first.open;
	}
	const index = daily.findIndex((d) => d.t === first.t);
	return daily[index - 1]?.close ?? first.open;
}

/** Normalised closes for small sparklines (last 30 sessions). */
export function sparkline(symbol: string, sessions = 30) {
	return dailyBars(symbol)
		.slice(-sessions)
		.map((bar) => bar.close);
}

export type LiveQuote = {
	symbol: string;
	price: number;
	prevClose: number;
	change: number;
	changePct: number;
	open: number;
	high: number;
	low: number;
	volume: number;
	tick: number;
};

/**
 * The "live" price: the last sample close nudged by a deterministic function of the tick number
 * (`floor(now / tickMs)`), so every client sees the same value for the same tick.
 */
export function liveQuote(symbol: string, tick: number): LiveQuote {
	const daily = dailyBars(symbol);
	const today = daily[daily.length - 1];
	const prev = daily[daily.length - 2];
	if (!today || !prev) throw new Error(`No sample bars for ${symbol}`);
	const { vol } = profileFor(symbol);
	const phase = seeded(`phase:${symbol}`)() * Math.PI * 2;
	const jitter = seeded(`tick:${symbol}:${tick}`)() - 0.5;
	const nudge = vol * 0.006 * Math.sin(tick / 6 + phase) + vol * 0.003 * jitter;
	const price = round(today.close * (1 + nudge));
	const change = round(price - prev.close);
	return {
		symbol,
		price,
		prevClose: prev.close,
		change,
		changePct: round((change / prev.close) * 100, 2),
		open: today.open,
		high: round(Math.max(today.high, price)),
		low: round(Math.min(today.low, price)),
		volume: today.volume,
		tick,
	};
}

export function currentTick(tickMs: number) {
	return Math.floor(Date.now() / tickMs);
}

/** 52-week range from the daily history. */
export function yearRange(symbol: string) {
	const bars = dailyBars(symbol).slice(-252);
	return {
		low: Math.min(...bars.map((b) => b.low)),
		high: Math.max(...bars.map((b) => b.high)),
	};
}

export { SAMPLE_AS_OF };
