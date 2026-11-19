import { useMutation } from "@tanstack/react-query";
import { type AskAnswer, askAnswerSchema } from "@/features/home/schemas/meeting";
import { RECORD_TYPES, recordHref } from "@/lib/records";
import { db, delay } from "@/lib/sample-db/db";

/**
 * "Ask anything" — a canned stub that searches sample records by keyword.
 *
 * ▶ PLUG AN AI CALL HERE: post `question` to your model endpoint (with retrieval over your
 *   records) and return `{ text, links }`. The UI already renders whatever comes back.
 */
async function ask(question: string): Promise<AskAnswer> {
	await delay(900);
	const words = question
		.toLowerCase()
		.split(/[^a-z0-9]+/)
		.filter((word) => word.length > 2);
	const matches = (name: string) => words.some((word) => name.toLowerCase().includes(word));

	const links = [
		...db.companies
			.filter((company) => matches(company.name) || matches(company.industry))
			.map((company) => ({
				label: company.name,
				href: recordHref({ type: "company", id: company.id }),
				type: RECORD_TYPES.company.label,
			})),
		...db.people
			.filter((person) => matches(`${person.firstName} ${person.lastName}`))
			.map((person) => ({
				label: `${person.firstName} ${person.lastName}`,
				href: recordHref({ type: "person", id: person.id }),
				type: RECORD_TYPES.person.label,
			})),
		...db.deals
			.filter((deal) => matches(deal.name))
			.map((deal) => ({
				label: deal.name,
				href: recordHref({ type: "deal", id: deal.id }),
				type: RECORD_TYPES.deal.label,
			})),
	].slice(0, 6);

	const open = db.deals.filter((deal) => deal.stage !== "won" && deal.stage !== "lost");
	const text = links.length
		? `I found ${links.length} matching record${links.length === 1 ? "" : "s"}. This is a sample answer: connect a model to get a real summary.`
		: `Nothing matched “${question}”. You have ${open.length} open deals; try a company name or an industry such as “software”. (Sample answer.)`;

	return askAnswerSchema.parse({ text, links });
}

export function useAsk() {
	return useMutation({ mutationFn: ask });
}
