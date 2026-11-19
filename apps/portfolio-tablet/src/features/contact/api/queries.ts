import { profile } from "@repo/content";
import { queryOptions } from "@tanstack/react-query";
import { type ContactInfo, contactInfoSchema } from "@/features/contact/schemas/contact";

/** Contact details from `@repo/content`: email, LinkedIn and GitHub. Never a phone number. */
async function getContactInfo() {
	const info: ContactInfo = {
		email: profile.email,
		location: profile.location,
		availability: profile.availability,
		links: profile.links
			.filter((l) => l.kind !== "email")
			.map((l) => ({ label: l.label, handle: l.handle, url: l.href })),
	};
	return contactInfoSchema.parse(info);
}

export const contactInfoQuery = queryOptions({
	queryKey: ["contact"],
	queryFn: getContactInfo,
});
