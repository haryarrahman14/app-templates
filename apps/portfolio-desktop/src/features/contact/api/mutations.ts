import { mutationOptions } from "@tanstack/react-query";
import {
	type ContactMessage,
	contactMessageSchema,
} from "@/features/contact/schemas/contact-message";

/** Pretends to send. Replace the body with a call to your email API or form backend. */
async function sendContactMessage(input: ContactMessage) {
	const message = contactMessageSchema.parse(input);
	await new Promise((resolve) => setTimeout(resolve, 700));
	return { ok: true as const, to: message.email };
}

export const sendContactMessageMutation = mutationOptions({
	mutationKey: ["contact", "send"],
	mutationFn: sendContactMessage,
});
