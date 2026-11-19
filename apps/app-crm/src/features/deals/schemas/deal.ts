import { z } from "zod";

export const DEAL_STAGES = ["lead", "qualified", "proposal", "negotiation", "won", "lost"] as const;
export const dealStageSchema = z.enum(DEAL_STAGES);
export type DealStage = z.infer<typeof dealStageSchema>;

export const DEAL_STAGE_META: Record<
	DealStage,
	{ label: string; dot: string; probability: number }
> = {
	lead: { label: "Lead", dot: "bg-cat-gray", probability: 10 },
	qualified: { label: "Qualified", dot: "bg-cat-blue", probability: 30 },
	proposal: { label: "Proposal", dot: "bg-cat-orange", probability: 55 },
	negotiation: { label: "Negotiation", dot: "bg-cat-yellow", probability: 75 },
	won: { label: "Won", dot: "bg-cat-green", probability: 100 },
	lost: { label: "Lost", dot: "bg-cat-red", probability: 0 },
};

export const dealSchema = z.object({
	id: z.string(),
	name: z.string().min(1),
	companyId: z.string(),
	contactId: z.string().nullable(),
	ownerId: z.string(),
	stage: dealStageSchema,
	value: z.number().nonnegative(),
	closeDate: z.string(),
	createdAt: z.string(),
	/** Position inside its stage column. */
	rank: z.number(),
});
export type Deal = z.infer<typeof dealSchema>;

export const newDealSchema = z.object({
	name: z.string().trim().min(2, "Enter at least 2 characters").max(60),
	companyId: z.string().min(1, "Pick a company"),
	stage: dealStageSchema,
	value: z.number({ error: "Enter an amount" }).min(0, "Must be 0 or more").max(10_000_000),
	closeDate: z.string().min(1, "Pick a close date"),
	ownerId: z.string().min(1, "Pick an owner"),
});
export type NewDeal = z.infer<typeof newDealSchema>;
