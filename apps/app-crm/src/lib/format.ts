import { format, formatDistanceToNowStrict, isToday, isTomorrow, isYesterday } from "date-fns";

const currency = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	maximumFractionDigits: 0,
});
const compact = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	notation: "compact",
	maximumFractionDigits: 1,
});

export const formatMoney = (value: number) => currency.format(value);
export const formatMoneyCompact = (value: number) => compact.format(value);

export function formatDay(iso: string | null) {
	if (!iso) return "—";
	const date = new Date(iso);
	if (isToday(date)) return "Today";
	if (isTomorrow(date)) return "Tomorrow";
	if (isYesterday(date)) return "Yesterday";
	return format(date, "MMM d");
}

export const formatDate = (iso: string | null) =>
	iso ? format(new Date(iso), "MMM d, yyyy") : "—";
export const formatTime = (iso: string) => format(new Date(iso), "h:mm a");
export const formatAgo = (iso: string | null) =>
	iso ? `${formatDistanceToNowStrict(new Date(iso))} ago` : "Never";

export function initials(name: string) {
	const parts = name.trim().split(/\s+/);
	return (
		(parts[0]?.[0] ?? "") + (parts.length > 1 ? (parts.at(-1)?.[0] ?? "") : "")
	).toUpperCase();
}

/** Avatars without photos sit on one neutral gray (not coloured), the same for every name. */
const AVATAR_TONES = ["bg-avatar text-avatar-foreground"];
export function toneFor(name: string) {
	let hash = 0;
	for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
	return AVATAR_TONES[hash % AVATAR_TONES.length] as string;
}

export const pluralize = (count: number, word: string, plural = `${word}s`) =>
	`${count} ${count === 1 ? word : plural}`;
