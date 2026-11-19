import { z } from "zod";
import { appIdSchema } from "@/lib/apps";

/** `/?app=projects` opens that window. Unknown values are dropped instead of erroring. */
export const desktopSearchSchema = z.object({
	app: appIdSchema.optional().catch(undefined),
});

export type DesktopSearch = z.infer<typeof desktopSearchSchema>;
