import { profile } from "@repo/content";
import { queryOptions } from "@tanstack/react-query";
import { type ContactInfo, contactInfoSchema } from "@/features/contact/schemas/contact-info";

/** What the Contact app shows around the form: his links from `@repo/content` (packages/content). */
async function getContactInfo(): Promise<ContactInfo> {
	return contactInfoSchema.parse({
		email: profile.email,
		timezone: profile.timezone,
		intro: "A few lines is plenty.",
		links: profile.links.map(({ kind, label, handle, href }) => ({ kind, label, handle, href })),
	} satisfies ContactInfo);
}

export const contactInfoQuery = queryOptions({
	queryKey: ["contact", "info"],
	queryFn: getContactInfo,
});
