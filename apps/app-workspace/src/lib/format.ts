import { format, formatDistanceToNowStrict, isToday, isYesterday } from "date-fns";

/** "just now", "5 min ago", "Yesterday", "Mar 4". */
export function formatRelative(iso: string) {
	const date = new Date(iso);
	const diff = Date.now() - date.getTime();
	if (diff < 60_000) return "just now";
	if (diff < 86_400_000 && isToday(date))
		return `${formatDistanceToNowStrict(date).replace(" minutes", " min").replace(" minute", " min")} ago`;
	if (isYesterday(date)) return "Yesterday";
	return format(date, date.getFullYear() === new Date().getFullYear() ? "MMM d" : "MMM d, yyyy");
}

export const formatDate = (iso: string) => format(new Date(iso), "MMM d, yyyy");
export const formatDateTime = (iso: string) => format(new Date(iso), "MMM d, yyyy 'at' h:mm a");

/** True when the key event comes from a field the user is typing in. */
export function isTypingTarget(target: EventTarget | null) {
	if (!(target instanceof HTMLElement)) return false;
	return (
		target.isContentEditable ||
		target.tagName === "INPUT" ||
		target.tagName === "TEXTAREA" ||
		target.tagName === "SELECT"
	);
}

export const pluralize = (count: number, word: string) =>
	`${count} ${word}${count === 1 ? "" : "s"}`;
