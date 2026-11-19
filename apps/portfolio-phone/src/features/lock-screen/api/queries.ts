import { formatDate, profile, projects } from "@repo/content";
import { queryOptions } from "@tanstack/react-query";
import {
	type LockNotification,
	lockNotificationSchema,
} from "@/features/lock-screen/schemas/notification";
import { englishPosts } from "@/lib/content";

const list = (names: string[]) =>
	names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names.at(-1)}` : (names[0] ?? "");

/**
 * The cards on the lock screen, built only from facts in `@repo/content` (packages/content):
 * the project count, his availability as he words it, and the latest post. A card without its fact is left out.
 */
async function listNotifications(): Promise<LockNotification[]> {
	const latest = englishPosts[0];
	const featured = projects.filter((project) => project.featured).map((project) => project.name);
	const cards: (LockNotification | null)[] = [
		projects.length
			? {
					id: "projects",
					app: "projects",
					title: `${projects.length} projects`,
					body: featured.length ? `Featured: ${list(featured)}. Tap to look.` : "Tap to look.",
				}
			: null,
		profile.availability
			? { id: "availability", app: "contact", title: profile.availability, body: profile.email }
			: null,
		latest
			? {
					id: "post",
					app: "notes",
					itemId: latest.slug,
					title: "Latest post",
					body: latest.title,
					time: formatDate(latest.publishedAt),
				}
			: null,
	];
	return lockNotificationSchema.array().parse(cards.filter(Boolean));
}

export const lockNotificationsQuery = queryOptions({
	queryKey: ["lock-screen", "notifications"],
	queryFn: listNotifications,
});
