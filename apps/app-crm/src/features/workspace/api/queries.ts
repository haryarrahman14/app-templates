import { queryOptions } from "@tanstack/react-query";
import {
	favouriteSchema,
	memberSchema,
	notificationSchema,
	recordListSchema,
} from "@/features/workspace/schemas/workspace";
import { db, delay } from "@/lib/sample-db/db";
import { SESSION_MEMBER_ID } from "@/lib/session";

// ▶ Real API: replace each queryFn body with a fetch, e.g. `fetch("/api/members").then(r => r.json())`.

export const membersQuery = queryOptions({
	queryKey: ["workspace", "members"],
	queryFn: async () => {
		await delay();
		return memberSchema.array().parse(db.members);
	},
});

/** The signed-in member. With real auth, read it from the session endpoint. */
export const meQuery = queryOptions({
	queryKey: ["workspace", "me"],
	queryFn: async () => {
		await delay(100);
		return memberSchema.parse(db.members.find((member) => member.id === SESSION_MEMBER_ID));
	},
});

export const listsQuery = queryOptions({
	queryKey: ["workspace", "lists"],
	queryFn: async () => {
		await delay();
		return recordListSchema.array().parse(db.lists);
	},
});

export const favouritesQuery = queryOptions({
	queryKey: ["workspace", "favourites"],
	queryFn: async () => {
		await delay();
		return favouriteSchema.array().parse(db.favourites);
	},
});

export const notificationsQuery = queryOptions({
	queryKey: ["workspace", "notifications"],
	queryFn: async () => {
		await delay();
		return notificationSchema.array().parse(db.notifications);
	},
});
