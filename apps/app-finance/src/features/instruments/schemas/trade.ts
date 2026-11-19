import { z } from "zod";

export const tradeSideSchema = z.enum(["buy", "sell"]);

/** Built per render so the rules know the sample price, cash and shares held. */
export function makeTradeSchema(ctx: { price: number; cash: number; held: number }) {
	return z
		.object({
			side: tradeSideSchema,
			quantity: z
				.number({ error: "Enter a number of shares." })
				.int("Whole shares only.")
				.positive("Enter at least 1 share.")
				.max(100_000, "That is more than this sample allows."),
		})
		.superRefine((value, issue) => {
			if (value.side === "buy" && value.quantity * ctx.price > ctx.cash) {
				issue.addIssue({
					code: "custom",
					path: ["quantity"],
					message: `That costs more than your sample cash (max ${Math.floor(ctx.cash / ctx.price)} shares).`,
				});
			}
			if (value.side === "sell" && value.quantity > ctx.held) {
				issue.addIssue({
					code: "custom",
					path: ["quantity"],
					message: ctx.held ? `You hold ${ctx.held} shares.` : "You don't hold this instrument.",
				});
			}
		});
}

export type TradeInput = z.infer<ReturnType<typeof makeTradeSchema>>;
