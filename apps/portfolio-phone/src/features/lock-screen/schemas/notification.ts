import { z } from "zod";
import { APP_IDS } from "@/lib/apps";

export const lockNotificationSchema = z.object({
	id: z.string(),
	/** Which app the card belongs to; tapping it unlocks straight into that app. */
	app: z.enum(APP_IDS),
	itemId: z.string().optional(),
	title: z.string(),
	body: z.string(),
	/** A real date from the record ("18 Nov 2026"); omitted when the fact has none. */
	time: z.string().optional(),
});

export type LockNotification = z.infer<typeof lockNotificationSchema>;
