import { queryOptions } from "@tanstack/react-query";
import { type ReportPeriod, reportSchema } from "@/features/reports/schemas/report";
import { sampleDelay } from "@/lib/delay";
import { queryRoots } from "@/lib/query-keys";
import { INCOME_CATEGORIES, monthlyFlows, SPENDING_CATEGORIES } from "@/lib/sample-data/cashflow";
import { round } from "@/lib/sample-data/random";

const sum = (values: number[]) => values.reduce((s, v) => s + v, 0);
const pct = (now: number, before: number) => (before ? round(((now - before) / before) * 100) : 0);

/** Cash-flow report for the last N months, compared with the N months before. Swap for your API. */
async function getReport(period: ReportPeriod) {
	await sampleDelay(380);
	const n = Number(period);
	const flows = monthlyFlows(n * 2);
	const current = flows.slice(-n);
	const previous = flows.slice(0, n);
	const total = (rows: typeof flows, kind: "income" | "spending") =>
		sum(rows.map((r) => sum(Object.values(r[kind]))));

	const months = current.map((m) => {
		const income = round(sum(Object.values(m.income)));
		const spending = round(sum(Object.values(m.spending)));
		return {
			month: m.month,
			income,
			spending,
			net: round(income - spending),
			savingsRate: round(((income - spending) / income) * 100),
		};
	});
	const income = round(total(current, "income"));
	const spending = round(total(current, "spending"));

	return reportSchema.parse({
		period,
		months,
		categories: SPENDING_CATEGORIES.map((name) => {
			const amount = round(sum(current.map((m) => m.spending[name] ?? 0)));
			const before = sum(previous.map((m) => m.spending[name] ?? 0));
			return { name, amount, share: round((amount / spending) * 100), change: pct(amount, before) };
		}).sort((a, b) => b.amount - a.amount),
		incomeSources: INCOME_CATEGORIES.map((name) => {
			const amount = round(sum(current.map((m) => m.income[name] ?? 0)));
			return { name, amount, share: round((amount / income) * 100) };
		}),
		totals: {
			income,
			spending,
			net: round(income - spending),
			savingsRate: round(((income - spending) / income) * 100),
			incomeChange: pct(income, total(previous, "income")),
			spendingChange: pct(spending, total(previous, "spending")),
		},
	});
}

export const reportQuery = (period: ReportPeriod) =>
	queryOptions({
		queryKey: [...queryRoots.reports, period],
		queryFn: () => getReport(period),
		staleTime: 10 * 60_000,
	});
