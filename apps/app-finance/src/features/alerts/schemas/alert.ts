import { z } from "zod";

export const alertSchema = z.object({
	id: z.string(),
	symbol: z.string(),
	name: z.string(),
	condition: z.enum(["above", "below"]),
	price: z.number(),
	enabled: z.boolean(),
	note: z.string(),
	createdAt: z.number(),
	current: z.number(),
	/** Percent the price still has to move to trigger (negative once triggered). */
	distancePct: z.number(),
	triggered: z.boolean(),
});
export type PriceAlert = z.infer<typeof alertSchema>;

export const newAlertSchema = z.object({
	symbol: z.string().min(1, "Choose an instrument."),
	condition: z.enum(["above", "below"]),
	price: z
		.number({ error: "Enter a target price." })
		.positive("Target price must be above zero.")
		.max(100_000, "That target is out of range."),
	note: z.string().max(60, "Keep the note under 60 characters."),
});
export type NewAlertInput = z.infer<typeof newAlertSchema>;

/** `/alerts?new=1&symbol=NVRA` opens the create dialog, prefilled. */
export const alertsSearchSchema = z.object({
	new: z.literal(1).optional().catch(undefined),
	symbol: z.string().optional().catch(undefined),
});
