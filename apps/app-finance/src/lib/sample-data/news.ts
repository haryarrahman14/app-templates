import { DAY_MS, nextTradingDay, SAMPLE_AS_OF } from "./calendar";

/** Invented headlines about invented companies. Not news, not advice. */
export const SAMPLE_NEWS = [
	{
		id: "n1",
		minutesAgo: 18,
		source: "Ledgerfinch Wire",
		symbols: ["NVRA"],
		title: "Novara Systems widens its accelerator line with a lower-power part for edge servers",
		summary:
			"The company says shipments start next quarter; two cloud customers are named as early buyers.",
	},
	{
		id: "n2",
		minutesAgo: 47,
		source: "Ledger Notes",
		symbols: ["HBVL", "LDGS"],
		title: "Regional lenders firm up as deposit costs ease for a third straight month",
		summary: "Harbor & Vale and Ledgerstone lead the group; analysts point to steadier funding.",
	},
	{
		id: "n3",
		minutesAgo: 95,
		source: "Ledgerfinch Wire",
		symbols: ["SXPW", "VLMR"],
		title: "Solarix signs a 15-year storage contract with Voltmere Grid",
		summary: "The 400 MWh project is the largest battery agreement either company has announced.",
	},
	{
		id: "n4",
		minutesAgo: 140,
		source: "Sector Desk",
		symbols: ["VTLX"],
		title: "Vitalix reports positive mid-stage data for its lead autoimmune antibody",
		summary: "The company plans to meet regulators early next year about a late-stage design.",
	},
	{
		id: "n5",
		minutesAgo: 210,
		source: "Ledger Notes",
		symbols: ["KTWL", "FLFN"],
		title: "Holiday preorders run ahead of last year at Kitewell and Flora & Finch",
		summary: "Both retailers cite stronger online traffic; margins remain the open question.",
	},
	{
		id: "n6",
		minutesAgo: 320,
		source: "Sector Desk",
		symbols: ["CBLN"],
		title: "Cobaltine Mining restarts its northern refinery after maintenance",
		summary: "Output should return to full rate within six weeks, the company said.",
	},
	{
		id: "n7",
		minutesAgo: 470,
		source: "Ledgerfinch Wire",
		symbols: ["ECHF", "PXLT"],
		title: "Echoform Media to stream Pixelton's game soundtracks in a licensing deal",
		summary: "Terms were not disclosed. Pixelton shares moved more than Echoform's on the news.",
	},
	{
		id: "n8",
		minutesAgo: 610,
		source: "Sector Desk",
		symbols: ["SKRL"],
		title: "Skyrail Logistics trims its freight-volume outlook on slower port traffic",
		summary: "Management kept its cost-savings target and its dividend unchanged.",
	},
];

/** The static tail of the daily brief; the headline and figures are derived in the overview query. */
export const SAMPLE_BRIEF = {
	body: "This brief is written from invented sample data to show where a generated or editorial summary would sit.",
};

export const SAMPLE_EVENTS = [
	{
		id: "e1",
		date: nextTradingDay(1),
		symbol: "HLXW",
		kind: "earnings" as const,
		label: "Q3 results, after close",
	},
	{
		id: "e2",
		date: nextTradingDay(2),
		symbol: "BKMG",
		kind: "dividend" as const,
		label: "Ex-dividend date",
	},
	{
		id: "e3",
		date: nextTradingDay(4),
		symbol: "AXWK",
		kind: "earnings" as const,
		label: "Q3 results, before open",
	},
	{
		id: "e4",
		date: nextTradingDay(6),
		symbol: "VTLX",
		kind: "meeting" as const,
		label: "Investor day",
	},
	{
		id: "e5",
		date: nextTradingDay(8),
		symbol: "NVRA",
		kind: "earnings" as const,
		label: "Q3 results, after close",
	},
	{
		id: "e6",
		date: nextTradingDay(9),
		symbol: "VLMR",
		kind: "dividend" as const,
		label: "Dividend payment",
	},
];

export const SAMPLE_NOTIFICATIONS = [
	{
		id: "no1",
		at: SAMPLE_AS_OF + 15 * 3_600_000,
		title: "NVRA is up 3% today",
		body: "Your largest holding moved above its 20-day high.",
		read: false,
	},
	{
		id: "no2",
		at: SAMPLE_AS_OF + 11 * 3_600_000,
		title: "Dividend received",
		body: "Brookmere Goods paid a sample dividend into Brokerage.",
		read: false,
	},
	{
		id: "no3",
		at: SAMPLE_AS_OF - DAY_MS + 17 * 3_600_000,
		title: "Weekly report ready",
		body: "Your income and spending summary for last week is in Reports.",
		read: true,
	},
	{
		id: "no4",
		at: SAMPLE_AS_OF - 2 * DAY_MS + 9 * 3_600_000,
		title: "New sign-in",
		body: "A new session started on a sample browser.",
		read: true,
	},
];
