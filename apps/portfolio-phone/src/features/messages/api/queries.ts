import { education, experiences, formatYearMonth, profile, projects } from "@repo/content";
import { queryOptions } from "@tanstack/react-query";
import { type Conversation, conversationSchema } from "@/features/messages/schemas/conversation";

const years = (start: string, end: string | null) =>
	`${formatYearMonth(start)} – ${end ? formatYearMonth(end) : "present"}`;

/**
 * "Ask me": preset questions whose answers are his own words or lists from `@repo/content`
 * (packages/content). Anything typed that isn't a preset gets the fallback, which claims nothing.
 */
async function getConversation(): Promise<Conversation> {
	return conversationSchema.parse({
		greeting: [
			`${profile.intro.hi}.`,
			"Pick a question below. The answers come straight from my CV and portfolio.",
		],
		questions: [
			{ id: "what", question: "What do you do?", answer: profile.summary },
			{
				id: "where",
				question: "Where have you worked?",
				answer: [
					experiences
						.map(
							(item) =>
								`${item.company}: ${item.roles[0]?.title ?? item.employmentType}, ${years(item.start, item.end)}`,
						)
						.join("\n"),
				],
			},
			{
				id: "built",
				question: "What have you built?",
				answer: [projects.map((item) => `${item.name}: ${item.tagline}`).join("\n")],
			},
			...(profile.availability
				? [{ id: "available", question: "Are you available?", answer: [profile.availability] }]
				: []),
			{
				id: "study",
				question: "Where did you study?",
				answer: [
					education
						.map(
							(item) =>
								`${item.school}: ${item.degree}, ${formatYearMonth(item.start)} – ${formatYearMonth(item.end)}${item.expected ? " (expected)" : ""}`,
						)
						.join("\n"),
				],
			},
			{
				id: "reach",
				question: "How can I reach you?",
				answer: [profile.links.map((link) => `${link.label}: ${link.handle}`).join("\n")],
			},
		],
		fallback: [
			"This chat only knows the preset questions. For anything else, open the Contact app.",
		],
	} satisfies Conversation);
}

export const conversationQuery = queryOptions({
	queryKey: ["messages", "conversation"],
	queryFn: getConversation,
});
