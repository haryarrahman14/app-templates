import { z } from "zod";

/** Collection filters held in the URL (?folder=&tag=&owner=&q=), so the sidebar can link to them. */
export const docFiltersSearchSchema = z.object({
	folder: z.string().optional().catch(undefined),
	tag: z.string().optional().catch(undefined),
	/** "me", "others" or a member id. */
	owner: z.string().optional().catch(undefined),
	q: z.string().optional().catch(undefined),
});

export type DocFiltersSearch = z.infer<typeof docFiltersSearchSchema>;
