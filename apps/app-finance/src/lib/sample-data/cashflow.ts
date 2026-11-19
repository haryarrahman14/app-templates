import { SAMPLE_AS_OF } from "./calendar";
import { round, seeded } from "./random";

/** Invented monthly cash flow for the Reports screen: income and spending by category. */
export const INCOME_CATEGORIES = ["Salary", "Dividends", "Interest", "Side projects"] as const;
export const SPENDING_CATEGORIES = [
	"Housing",
	"Groceries",
	"Transport",
	"Dining out",
	"Subscriptions",
	"Travel",
	"Health",
	"Other",
] as const;

const INCOME_BASE: Record<(typeof INCOME_CATEGORIES)[number], number> = {
	Salary: 7_800,
	Dividends: 260,
	Interest: 85,
	"Side projects": 600,
};
const SPENDING_BASE: Record<(typeof SPENDING_CATEGORIES)[number], number> = {
	Housing: 2_350,
	Groceries: 640,
	Transport: 310,
	"Dining out": 420,
	Subscriptions: 96,
	Travel: 380,
	Health: 150,
	Other: 260,
};

export type MonthFlow = {
	month: number;
	income: Record<string, number>;
	spending: Record<string, number>;
};

/** The last `count` months (oldest first), the current sample month included. */
export function monthlyFlows(count = 12): MonthFlow[] {
	const anchor = new Date(SAMPLE_AS_OF);
	const flows: MonthFlow[] = [];
	for (let i = count - 1; i >= 0; i--) {
		const month = Date.UTC(anchor.getUTCFullYear(), anchor.getUTCMonth() - i, 1);
		const rand = seeded(`flow:${month}`);
		const income: Record<string, number> = {};
		const spending: Record<string, number> = {};
		for (const category of INCOME_CATEGORIES) {
			const base = INCOME_BASE[category];
			const swing = category === "Salary" ? 0.02 : category === "Side projects" ? 0.9 : 0.3;
			income[category] = round(Math.max(0, base * (1 + (rand() - 0.5) * 2 * swing)));
		}
		for (const category of SPENDING_CATEGORIES) {
			const base = SPENDING_BASE[category];
			const swing = category === "Housing" ? 0.01 : category === "Travel" ? 1 : 0.35;
			spending[category] = round(Math.max(0, base * (1 + (rand() - 0.5) * 2 * swing)));
		}
		flows.push({ month, income, spending });
	}
	return flows;
}
