import type { TransactionType } from "@/features/transactions/schemas/transaction";

export const TYPE_LABEL: Record<TransactionType, string> = {
	buy: "Buy",
	sell: "Sell",
	deposit: "Deposit",
	withdrawal: "Withdrawal",
	dividend: "Dividend",
	fee: "Fee",
};

export const DATE_PRESETS = [
	{ value: "all", label: "All time" },
	{ value: "30", label: "Last 30 days" },
	{ value: "90", label: "Last 90 days" },
	{ value: "ytd", label: "This year" },
	{ value: "custom", label: "Custom range" },
] as const;
export type DatePreset = (typeof DATE_PRESETS)[number]["value"];
