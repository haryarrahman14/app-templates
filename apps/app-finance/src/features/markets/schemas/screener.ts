import { z } from "zod";

export const capBucketSchema = z.enum(["Mega", "Large", "Mid", "Small"]);
export type CapBucket = z.infer<typeof capBucketSchema>;

export const screenerRowSchema = z.object({
	symbol: z.string(),
	name: z.string(),
	sector: z.string(),
	price: z.number(),
	change: z.number(),
	changePct: z.number(),
	capBn: z.number(),
	capBucket: capBucketSchema,
	volume: z.number(),
	pe: z.number().nullable(),
	dividendYield: z.number(),
	spark: z.array(z.number()),
});
export type ScreenerRow = z.infer<typeof screenerRowSchema>;

export const sectorTileSchema = z.object({
	sector: z.string(),
	changePct: z.number(),
	capBn: z.number(),
	count: z.number(),
	leader: z.object({ symbol: z.string(), changePct: z.number() }),
});
export type SectorTile = z.infer<typeof sectorTileSchema>;
