/**
 * Query-key roots shared across features, so a mutation in one feature can invalidate another's data
 * (a sample trade touches the portfolio, transactions and overview) without importing its internals.
 */
export const queryRoots = {
	market: ["market"],
	quotes: ["market", "quotes"],
	account: ["account"],
	portfolio: ["account", "portfolio"],
	transactions: ["account", "transactions"],
	watchlists: ["account", "watchlists"],
	alerts: ["account", "alerts"],
	settings: ["settings"],
	reports: ["reports"],
	notifications: ["notifications"],
} as const;

/** How often "live" sample prices tick (ms). */
export const LIVE_TICK_MS = 5_000;
