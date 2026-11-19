import { type ContactMessage, contactMessageSchema } from "@/features/contact/schemas/contact";

/**
 * Pretends to send the message. Nothing leaves the browser.
 * Replace the body with a fetch to your form endpoint (or a server function) when you go live.
 */
export async function sendContactMessage(input: ContactMessage) {
	const message = contactMessageSchema.parse(input);
	await new Promise((resolve) => setTimeout(resolve, 700));
	return { ok: true as const, firstName: message.name.split(" ")[0] ?? message.name };
}
