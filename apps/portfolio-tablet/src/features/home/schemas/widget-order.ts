import { z } from "zod";

/**
 * Saved widget order: a list of widget ids. Tolerant on read: entries that are not short strings are
 * dropped here, ids of widgets that no longer exist are dropped when merged, new widgets are appended.
 */
export const widgetOrderSchema = z
	.array(z.unknown())
	.max(200)
	.transform((ids) =>
		ids.filter((id): id is string => typeof id === "string" && id.length > 0 && id.length <= 40),
	);
