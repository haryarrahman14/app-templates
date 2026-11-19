import { addDays, format, isBefore, isToday, isTomorrow, parseISO, startOfDay } from "date-fns";

export const toDay = (date: Date) => format(date, "yyyy-MM-dd");
export const dayFromToday = (offset: number) => toDay(addDays(new Date(), offset));

export function dueLabel(day: string) {
	const date = parseISO(day);
	if (isToday(date)) return "Today";
	if (isTomorrow(date)) return "Tomorrow";
	return format(
		date,
		date.getFullYear() === new Date().getFullYear() ? "EEE, MMM d" : "MMM d, yyyy",
	);
}

export const isOverdue = (day: string) => isBefore(parseISO(day), startOfDay(new Date()));
