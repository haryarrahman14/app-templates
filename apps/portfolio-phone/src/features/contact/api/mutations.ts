import { mutationOptions } from "@tanstack/react-query";
import {
	type ContactMessage,
	contactMessageSchema,
} from "@/features/contact/schemas/contact-message";

/**
 * Pretends to send. Replace the body with a call to your form backend
 * (a server function, Formspree, Resend …); the form doesn't change.
 */
async function sendContactMessage(input: ContactMessage) {
	const message = contactMessageSchema.parse(input);
	await new Promise((resolve) => setTimeout(resolve, 900));
	return { ok: true as const, name: message.name };
}

export const sendContactMessageMutation = mutationOptions({
	mutationKey: ["contact", "send"],
	mutationFn: sendContactMessage,
});
