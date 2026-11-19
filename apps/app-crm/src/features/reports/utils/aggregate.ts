import { format, startOfMonth, startOfWeek, subDays } from "date-fns";
import type { Activity, ActivityType } from "@/features/activities/schemas/activity";
import { DEAL_STAGE_META, DEAL_STAGES, type Deal } from "@/features/deals/schemas/deal";
import type { Member } from "@/features/workspace/schemas/workspace";

export const RANGES = {
	"30d": { label: "Last 30 days", days: 30 },
	"90d": { label: "Last 90 days", days: 90 },
	"12m": { label: "Last 12 months", days: 365 },
} as const;
export type RangeId = keyof typeof RANGES;

type Window = { from: Date; to: Date };

function windows(range: RangeId, now = new Date()): { current: Window; previous: Window } {
	const days = RANGES[range].days;
	const from = subDays(now, days);
	return { current: { from, to: now }, previous: { from: subDays(from, days), to: from } };
}

const inWindow = (iso: string, window: Window) => {
	const time = new Date(iso).getTime();
	return time >= window.from.getTime() && time <= window.to.getTime();
};

const isOpen = (deal: Deal) => deal.stage !== "won" && deal.stage !== "lost";
const sum = (deals: Deal[]) => deals.reduce((total, deal) => total + deal.value, 0);

function periodStats(deals: Deal[], window: Window) {
	const closed = deals.filter((deal) => !isOpen(deal) && inWindow(deal.closeDate, window));
	const won = closed.filter((deal) => deal.stage === "won");
	return {
		wonValue: sum(won),
		wonCount: won.length,
		winRate: closed.length ? won.length / closed.length : 0,
		avgDeal: won.length ? sum(won) / won.length : 0,
		created: deals.filter((deal) => inWindow(deal.createdAt, window)),
	};
}

/** Relative change; null when there is nothing to compare with. */
const delta = (current: number, previous: number) =>
	previous === 0 ? null : (current - previous) / previous;

export function kpis(deals: Deal[], range: RangeId) {
	const { current, previous } = windows(range);
	const now = periodStats(deals, current);
	const before = periodStats(deals, previous);
	const open = deals.filter(isOpen);
	const openNew = sum(now.created.filter(isOpen));
	const openBefore = sum(before.created.filter(isOpen));
	return {
		pipeline: { value: sum(open), delta: delta(openNew, openBefore), count: open.length },
		won: { value: now.wonValue, delta: delta(now.wonValue, before.wonValue), count: now.wonCount },
		winRate: { value: now.winRate, delta: before.winRate ? now.winRate - before.winRate : null },
		avgDeal: { value: now.avgDeal, delta: delta(now.avgDeal, before.avgDeal) },
	};
}

/** Open pipeline by stage (current snapshot; the range does not apply to open deals). */
export function pipelineByStage(deals: Deal[]) {
	return DEAL_STAGES.filter((stage) => stage !== "won" && stage !== "lost").map((stage) => {
		const inStage = deals.filter((deal) => deal.stage === stage);
		return { stage: DEAL_STAGE_META[stage].label, value: sum(inStage), count: inStage.length };
	});
}

/** Won value per bucket: weeks for 30/90 days, months for 12 months. */
export function wonOverTime(deals: Deal[], range: RangeId) {
	const { current } = windows(range);
	const monthly = range === "12m";
	const bucketOf = (date: Date) =>
		monthly ? startOfMonth(date) : startOfWeek(date, { weekStartsOn: 1 });
	const buckets = new Map<number, number>();
	for (let cursor = bucketOf(current.from); cursor <= current.to; ) {
		buckets.set(cursor.getTime(), 0);
		cursor = monthly
			? new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1)
			: new Date(cursor.getTime() + 7 * 86_400_000);
	}
	for (const deal of deals) {
		if (deal.stage !== "won" || !inWindow(deal.closeDate, current)) continue;
		const key = bucketOf(new Date(deal.closeDate)).getTime();
		buckets.set(key, (buckets.get(key) ?? 0) + deal.value);
	}
	return Array.from(buckets, ([time, value]) => ({
		label: format(new Date(time), monthly ? "MMM" : "MMM d"),
		value,
	}));
}

export const ACTIVITY_LABEL: Record<ActivityType, string> = {
	email: "Emails",
	call: "Calls",
	meeting: "Meetings",
	note: "Notes",
	task: "Tasks",
	deal: "Deal updates",
	created: "New records",
};

export function activityByType(activities: Activity[], range: RangeId) {
	const { current } = windows(range);
	const counts = new Map<ActivityType, number>();
	for (const activity of activities) {
		if (!inWindow(activity.at, current)) continue;
		counts.set(activity.type, (counts.get(activity.type) ?? 0) + 1);
	}
	return Array.from(counts, ([type, count]) => ({ type, label: ACTIVITY_LABEL[type], count })).sort(
		(a, b) => b.count - a.count,
	);
}

export function topOwners(deals: Deal[], members: Member[], range: RangeId) {
	const { current } = windows(range);
	const totals = new Map<string, number>();
	for (const deal of deals) {
		if (deal.stage !== "won" || !inWindow(deal.closeDate, current)) continue;
		totals.set(deal.ownerId, (totals.get(deal.ownerId) ?? 0) + deal.value);
	}
	return Array.from(totals, ([ownerId, value]) => ({
		name: members.find((member) => member.id === ownerId)?.name.split(" ")[0] ?? "Unknown",
		value,
	}))
		.sort((a, b) => b.value - a.value)
		.slice(0, 5);
}
