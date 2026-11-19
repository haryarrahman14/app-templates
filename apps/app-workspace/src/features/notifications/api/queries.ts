import { queryOptions } from "@tanstack/react-query";
import { notificationsStore } from "@/features/notifications/api/store";
import { notificationSchema } from "@/features/notifications/schemas/notification";
import { sampleDelay } from "@/lib/mock-db";

export const notificationsKeys = { all: ["notifications"] as const };

/** Newest first. Replace the queryFn with your API (or a realtime subscription). */
export const notificationsQuery = queryOptions({
	queryKey: notificationsKeys.all,
	queryFn: async () => {
		await sampleDelay(200);
		return notificationSchema
			.array()
			.parse(notificationsStore.all())
			.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
	},
});
