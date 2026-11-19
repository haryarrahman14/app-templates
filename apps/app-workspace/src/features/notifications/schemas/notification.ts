import { z } from "zod";

export const notificationSchema = z.object({
	id: z.string(),
	kind: z.enum(["comment", "share", "mention", "task"]),
	actorName: z.string(),
	actorTint: z.string(),
	text: z.string(),
	href: z.string(),
	createdAt: z.string(),
	read: z.boolean(),
});
export type Notification = z.infer<typeof notificationSchema>;
