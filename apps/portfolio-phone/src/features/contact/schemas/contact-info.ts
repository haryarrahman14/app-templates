import { z } from "zod";

export const contactInfoSchema = z.object({
	email: z.email(),
	/** IANA time zone from the record, e.g. "Asia/Jakarta". */
	timezone: z.string(),
	intro: z.string(),
	links: z.array(
		z.object({
			kind: z.enum(["github", "linkedin", "email"]),
			label: z.string(),
			handle: z.string(),
			href: z.string(),
		}),
	),
});

export type ContactInfo = z.infer<typeof contactInfoSchema>;
