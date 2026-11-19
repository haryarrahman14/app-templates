import { isBefore, isToday, startOfDay } from "date-fns";
import type { Task } from "@/features/tasks/schemas/task";

/** yyyy-mm-dd for `<input type="date">`. Dates are stored as ISO at 17:00 UTC. */
export const toDateInput = (iso: string | null) => (iso ? iso.slice(0, 10) : "");
export const fromDateInput = (value: string) => (value ? `${value}T17:00:00.000Z` : null);
export const todayInput = () => new Date().toISOString().slice(0, 10);

export type TaskGroup = "overdue" | "today" | "upcoming" | "none";

export function groupOf(task: Task): TaskGroup {
	if (!task.dueDate) return "none";
	const due = new Date(task.dueDate);
	if (isToday(due)) return "today";
	if (isBefore(due, startOfDay(new Date()))) return "overdue";
	return "upcoming";
}

export const isOverdue = (task: Task) => !task.done && groupOf(task) === "overdue";

/** Record select value: "type:id", or "" for none. */
export const refToValue = (ref: Task["record"]) => (ref ? `${ref.type}:${ref.id}` : "");
