import { queryOptions } from "@tanstack/react-query";
import { notificationSchema } from "@/features/notifications/schemas/notification";
import { sampleDelay } from "@/lib/delay";
import { queryRoots } from "@/lib/query-keys";
import { SAMPLE_NOTIFICATIONS } from "@/lib/sample-data/news";

/** In-memory inbox (browser tab). Swap for your notifications endpoint. */
export const inbox = SAMPLE_NOTIFICATIONS.map((n) => ({ ...n }));

async function listNotifications() {
	await sampleDelay(200);
	return notificationSchema.array().parse(inbox.map((n) => ({ ...n })));
}

export const notificationsQuery = queryOptions({
	queryKey: [...queryRoots.notifications],
	queryFn: listNotifications,
});
