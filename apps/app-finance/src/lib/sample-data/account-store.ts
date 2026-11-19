import { DAY_MS, SAMPLE_AS_OF, tradingDays } from "./calendar";
import { dailyBars } from "./prices";
import { round, seeded } from "./random";
import { findInstrument } from "./universe";

/**
 * The signed-in user's sample account: cash, holdings, transactions, watchlists and price alerts.
 * It lives in memory in the browser tab (reset on reload). Nothing here places a real order or moves
 * real money. Feature `api/` files read and change it; swap those queryFns/mutationFns for real calls.
 */
export type Holding = { symbol: string; quantity: number; avgCost: number };

export type TransactionType = "buy" | "sell" | "deposit" | "withdrawal" | "dividend" | "fee";

export type StoredTransaction = {
	id: string;
	date: number;
	type: TransactionType;
	symbol: string | null;
	quantity: number | null;
	price: number | null;
	/** Signed cash effect: negative for buys, withdrawals and fees. */
	amount: number;
	status: "settled" | "pending";
	account: "Brokerage" | "Savings";
	note: string;
};

export type StoredWatchlist = { id: string; name: string; symbols: string[] };

export type StoredAlert = {
	id: string;
	symbol: string;
	condition: "above" | "below";
	price: number;
	enabled: boolean;
	note: string;
	createdAt: number;
};

const SEED_POSITIONS: [string, number][] = [
	["NVRA", 42],
	["HLXW", 60],
	["MDRH", 25],
	["HBVL", 220],
	["SXPW", 300],
	["BKMG", 70],
	["AXWK", 38],
	["VLMR", 150],
	["ECHF", 55],
	["CBLN", 400],
	["LDGS", 30],
];

function seedAccount() {
	const rand = seeded("account");
	const days = tradingDays(230);
	const transactions: StoredTransaction[] = [];
	const holdings: Holding[] = [];
	let n = 0;
	const id = () => `TX-${String(++n).padStart(4, "0")}`;

	// Monthly deposits.
	for (let m = 0; m < 10; m++) {
		const date = days[m * 22] ?? SAMPLE_AS_OF;
		transactions.push({
			id: id(),
			date: date + 9 * 3_600_000,
			type: "deposit",
			symbol: null,
			quantity: null,
			price: null,
			amount: m === 0 ? 100_000 : 2_500,
			status: "settled",
			account: m % 3 === 0 ? "Savings" : "Brokerage",
			note: m === 0 ? "Initial funding" : "Monthly transfer",
		});
	}

	// One or two buys per position.
	for (const [symbol, quantity] of SEED_POSITIONS) {
		const bars = dailyBars(symbol);
		// "Bought the dip": each buy lands on the lowest close inside a random window.
		const lowestIn = (from: number, span: number) => {
			let best = from;
			for (let i = from; i < from + span; i++) {
				if (
					(bars[bars.length - 230 + i]?.close ?? Infinity) <
					(bars[bars.length - 230 + best]?.close ?? Infinity)
				)
					best = i;
			}
			return best;
		};
		const firstIndex = lowestIn(5 + Math.floor(rand() * 30), 60);
		const secondIndex = lowestIn(firstIndex + 20 + Math.floor(rand() * 30), 60);
		const split = Math.max(1, Math.round(quantity * (0.4 + rand() * 0.3)));
		let cost = 0;
		for (const [index, qty] of [
			[firstIndex, split],
			[secondIndex, quantity - split],
		] as const) {
			const bar = bars[bars.length - 230 + index];
			if (!bar || qty <= 0) continue;
			cost += bar.close * qty;
			transactions.push({
				id: id(),
				date: bar.t + (15 + Math.floor(rand() * 5)) * 3_600_000,
				type: "buy",
				symbol,
				quantity: qty,
				price: bar.close,
				amount: round(-bar.close * qty),
				status: "settled",
				account: "Brokerage",
				note: "",
			});
		}
		holdings.push({ symbol, quantity, avgCost: round(cost / quantity) });
	}

	// Quarterly dividends for payers, a few fees, one sell.
	for (const holding of holdings) {
		const entry = findInstrument(holding.symbol);
		if (!entry || entry.dividendYield <= 0) continue;
		for (const q of [60, 125, 190]) {
			const date = days[q] ?? SAMPLE_AS_OF;
			transactions.push({
				id: id(),
				date: date + 13 * 3_600_000,
				type: "dividend",
				symbol: holding.symbol,
				quantity: null,
				price: null,
				amount: round((entry.price * holding.quantity * entry.dividendYield) / 100 / 4),
				status: "settled",
				account: "Brokerage",
				note: "Quarterly dividend",
			});
		}
	}
	for (const d of [40, 105, 170, 220]) {
		transactions.push({
			id: id(),
			date: (days[d] ?? SAMPLE_AS_OF) + 8 * 3_600_000,
			type: "fee",
			symbol: null,
			quantity: null,
			price: null,
			amount: -4.99,
			status: "settled",
			account: "Brokerage",
			note: "Platform fee",
		});
	}
	const sellBar = dailyBars("PXLT")[dailyBars("PXLT").length - 40];
	if (sellBar) {
		transactions.push({
			id: id(),
			date: sellBar.t + 16 * 3_600_000,
			type: "sell",
			symbol: "PXLT",
			quantity: 80,
			price: sellBar.close,
			amount: round(sellBar.close * 80),
			status: "settled",
			account: "Brokerage",
			note: "Closed position",
		});
	}
	transactions.push({
		id: id(),
		date: SAMPLE_AS_OF - 2 * DAY_MS + 10 * 3_600_000,
		type: "withdrawal",
		symbol: null,
		quantity: null,
		price: null,
		amount: -1_200,
		status: "pending",
		account: "Savings",
		note: "To checking",
	});

	transactions.sort((a, b) => b.date - a.date);
	const cash = round(transactions.reduce((sum, tx) => sum + tx.amount, 0));

	return {
		cash,
		holdings,
		transactions,
		nextId: n,
		watchlists: [
			{ id: "wl-1", name: "Core ideas", symbols: ["QBTL", "CRSL", "VTLX", "ASTP", "PXLT"] },
			{ id: "wl-2", name: "Income", symbols: ["SGPH", "AQVD", "TRRC", "TDLX"] },
			{ id: "wl-3", name: "Earnings next week", symbols: [] },
		] as StoredWatchlist[],
		alerts: [
			{
				id: "al-1",
				symbol: "NVRA",
				condition: "above",
				price: 430,
				enabled: true,
				note: "Trim above here",
				createdAt: SAMPLE_AS_OF - 6 * DAY_MS,
			},
			{
				id: "al-2",
				symbol: "SXPW",
				condition: "below",
				price: 39,
				enabled: true,
				note: "",
				createdAt: SAMPLE_AS_OF - 12 * DAY_MS,
			},
			{
				id: "al-3",
				symbol: "HBVL",
				condition: "above",
				price: 62.5,
				enabled: false,
				note: "Revisit after results",
				createdAt: SAMPLE_AS_OF - 20 * DAY_MS,
			},
		] as StoredAlert[],
		nextListId: 3,
		nextAlertId: 3,
	};
}

let state: ReturnType<typeof seedAccount> | null = null;

export function account() {
	state ??= seedAccount();
	return state;
}

export function nextTransactionId() {
	const s = account();
	s.nextId += 1;
	return `TX-${String(s.nextId).padStart(4, "0")}`;
}

export class SampleRuleError extends Error {}

/** Applies a sample trade to the in-memory account. Validates against sample cash and holdings. */
export function applyTrade(input: {
	symbol: string;
	side: "buy" | "sell";
	quantity: number;
	price: number;
}) {
	const s = account();
	const total = round(input.quantity * input.price);
	const holding = s.holdings.find((h) => h.symbol === input.symbol);
	if (input.side === "buy") {
		if (total > s.cash) throw new SampleRuleError("Not enough sample cash for this order.");
		if (holding) {
			const quantity = holding.quantity + input.quantity;
			holding.avgCost = round((holding.avgCost * holding.quantity + total) / quantity);
			holding.quantity = quantity;
		} else {
			s.holdings.push({ symbol: input.symbol, quantity: input.quantity, avgCost: input.price });
		}
		s.cash = round(s.cash - total);
	} else {
		if (!holding || holding.quantity < input.quantity) {
			throw new SampleRuleError(`You hold ${holding?.quantity ?? 0} shares of ${input.symbol}.`);
		}
		holding.quantity -= input.quantity;
		if (holding.quantity === 0) s.holdings = s.holdings.filter((h) => h !== holding);
		s.cash = round(s.cash + total);
	}
	const tx: StoredTransaction = {
		id: nextTransactionId(),
		date: SAMPLE_AS_OF + 18 * 3_600_000,
		type: input.side,
		symbol: input.symbol,
		quantity: input.quantity,
		price: input.price,
		amount: input.side === "buy" ? -total : total,
		status: "settled",
		account: "Brokerage",
		note: "Sample order",
	};
	s.transactions.unshift(tx);
	return tx;
}

/** Danger zone: drop every change and rebuild the seeded sample account. */
export function resetAccount() {
	state = seedAccount();
}
