import { z } from "zod";
import { appIdSchema } from "@/lib/apps";

const itemId = z
	.string()
	.regex(/^[a-z0-9-]{1,80}$/)
	.optional()
	.catch(undefined);

/**
 * The home route's search params: which apps are open and how they are laid out.
 * `/?app=projects&id=penawaranku&split=notes&ratio=70` → Projects (70%) beside Notes (30%).
 * Anything malformed is dropped, never an error.
 */
export const stageSearchSchema = z.object({
	app: appIdSchema.optional().catch(undefined),
	id: itemId,
	split: appIdSchema.optional().catch(undefined),
	sid: itemId,
	/** Width of the left pane in percent. */
	ratio: z
		.union([z.literal(30), z.literal(50), z.literal(70)])
		.optional()
		.catch(undefined),
});

export type StageSearch = z.infer<typeof stageSearchSchema>;
export type SplitRatio = 30 | 50 | 70;
