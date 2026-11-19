import {
	type Notification,
	notificationSchema,
} from "@/features/notifications/schemas/notification";
import { createCollection, relativeIso } from "@/lib/mock-db";

export const notificationsStore = createCollection<Notification>(
	"notifications",
	notificationSchema,
	() => [
		{
			id: "n-1",
			kind: "comment",
			actorName: "Tomas Reyhani",
			actorTint: "green",
			text: "commented on Welcome to Paperwren",
			href: "/docs/d-welcome",
			createdAt: relativeIso(0, -2),
			read: false,
		},
		{
			id: "n-2",
			kind: "share",
			actorName: "Ines Calloway",
			actorTint: "orange",
			text: "shared Client brief: Harbor Street Bakery with you",
			href: "/docs/d-brief",
			createdAt: relativeIso(0, -5),
			read: false,
		},
		{
			id: "n-3",
			kind: "task",
			actorName: "Paperwren",
			actorTint: "yellow",
			text: "reminds you that “Send the launch email draft” is due today",
			href: "/tasks",
			createdAt: relativeIso(0, -8),
			read: false,
		},
		{
			id: "n-4",
			kind: "mention",
			actorName: "Wren Adebayo",
			actorTint: "blue",
			text: "mentioned you in Spring product roadmap",
			href: "/docs/d-roadmap",
			createdAt: relativeIso(-1),
			read: true,
		},
	],
);
