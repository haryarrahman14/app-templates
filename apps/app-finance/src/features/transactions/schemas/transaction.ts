import { z } from "zod";

export const transactionTypeSchema = z.enum([
	"buy",
	"sell",
	"deposit",
	"withdrawal",
	"dividend",
	"fee",
]);
export type TransactionType = z.infer<typeof transactionTypeSchema>;

export const transactionSchema = z.object({
	id: z.string(),
	date: z.number(),
	type: transactionTypeSchema,
	symbol: z.string().nullable(),
	quantity: z.number().nullable(),
	price: z.number().nullable(),
	amount: z.number(),
	status: z.enum(["settled", "pending"]),
	account: z.enum(["Brokerage", "Savings"]),
	note: z.string(),
});
export type Transaction = z.infer<typeof transactionSchema>;

/** The "record a cash movement" form. Trades come from the instrument page's sample order. */
export const newTransactionSchema = z
	.object({
		type: z.enum(["deposit", "withdrawal", "dividend", "fee"]),
		date: z.iso.date("Pick a date."),
		amount: z
			.number({ error: "Enter an amount." })
			.positive("Amount must be more than zero.")
			.max(1_000_000, "That is above this sample's limit."),
		account: z.enum(["Brokerage", "Savings"]),
		symbol: z.string(),
		note: z.string().max(80, "Keep the note under 80 characters."),
	})
	.superRefine((value, ctx) => {
		if (value.type === "dividend" && !value.symbol) {
			ctx.addIssue({
				code: "custom",
				path: ["symbol"],
				message: "Pick the instrument that paid it.",
			});
		}
	});
export type NewTransactionInput = z.infer<typeof newTransactionSchema>;

/** `/transactions?new=1` opens the "record a cash movement" dialog. */
export const transactionsSearchSchema = z.object({
	new: z.literal(1).optional().catch(undefined),
});
