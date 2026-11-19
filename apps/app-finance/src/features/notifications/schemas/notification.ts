import { z } from "zod";

export const notificationSchema = z.object({
	id: z.string(),
	at: z.number(),
	title: z.string(),
	body: z.string(),
	read: z.boolean(),
});
export type AppNotification = z.infer<typeof notificationSchema>;
