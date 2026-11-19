import type { PlanId } from "@/features/settings/schemas/settings";

export const PLANS: {
	id: PlanId;
	name: string;
	price: number;
	blurb: string;
	features: string[];
}[] = [
	{
		id: "free",
		name: "Starter",
		price: 0,
		blurb: "Track one portfolio",
		features: ["1 portfolio", "3 watchlists", "Daily brief"],
	},
	{
		id: "plus",
		name: "Plus",
		price: 9,
		blurb: "For active investors",
		features: ["5 portfolios", "Unlimited watchlists", "Price alerts", "CSV export"],
	},
	{
		id: "pro",
		name: "Pro",
		price: 24,
		blurb: "Everything, plus reports",
		features: ["Unlimited portfolios", "Advanced reports", "Priority support", "API access"],
	},
];

export const TIMEZONES = [
	"UTC",
	"Europe/London",
	"Europe/Zurich",
	"America/New_York",
	"America/Los_Angeles",
	"Asia/Singapore",
	"Asia/Jakarta",
	"Australia/Sydney",
];
