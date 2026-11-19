/**
 * The in-memory "backend" behind every queryFn and mutationFn.
 *
 * It lives in the browser tab and starts from a deterministic seed; changes last until a reload.
 * To go live, replace the bodies of features/<f>/api/*.ts with fetch calls and delete this folder.
 */
import { isServer } from "@tanstack/react-query";
import {
	ACTIVITIES,
	COMPANIES,
	DEALS,
	FAVOURITES,
	LISTS,
	MEETINGS,
	MEMBERS,
	NOTES,
	NOTIFICATIONS,
	PEOPLE,
	TASKS,
} from "./seed";

export { ME_ID } from "./seed";

const clone = <T>(value: T): T => structuredClone(value);

export const db = {
	members: clone(MEMBERS),
	companies: clone(COMPANIES),
	people: clone(PEOPLE),
	deals: clone(DEALS),
	tasks: clone(TASKS),
	notes: clone(NOTES),
	activities: clone(ACTIVITIES),
	meetings: clone(MEETINGS),
	lists: clone(LISTS),
	favourites: clone(FAVOURITES),
	notifications: clone(NOTIFICATIONS),
};

/** A short artificial latency in the browser so loading and optimistic states are real. */
export function delay(ms = 350) {
	if (isServer) return Promise.resolve();
	return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

let counter = 1000;
/** Ids for records created in this tab. A real API returns its own. */
export function newId(prefix: string) {
	counter += 1;
	return `${prefix}${counter}`;
}

export const nowIso = () => new Date().toISOString();

type ActivityRow = (typeof db.activities)[number];

/** What a backend would do on its own: record an activity next to a change. */
export function recordActivity(
	entry: Omit<ActivityRow, "id" | "at" | "actorId" | "detail"> & {
		detail?: string;
	},
) {
	const activity: ActivityRow = {
		id: newId("a"),
		at: nowIso(),
		actorId: "m1",
		detail: "",
		...entry,
	};
	db.activities.unshift(activity);
	return activity;
}
