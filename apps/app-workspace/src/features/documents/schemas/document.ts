import { z } from "zod";
import { normalizeTint } from "@/lib/palette";

export const blockTypeSchema = z.enum([
	"paragraph",
	"heading1",
	"heading2",
	"todo",
	"bullet",
	"quote",
	"callout",
	"divider",
	"image",
]);
export type BlockType = z.infer<typeof blockTypeSchema>;

export const blockSchema = z.object({
	id: z.string(),
	type: blockTypeSchema,
	text: z.string(),
	checked: z.boolean().optional(),
});
export type Block = z.infer<typeof blockSchema>;

export const docFontSchema = z.enum(["sans", "serif", "mono"]);
export const docWidthSchema = z.enum(["narrow", "normal", "wide"]);
export type DocFont = z.infer<typeof docFontSchema>;
export type DocWidth = z.infer<typeof docWidthSchema>;

export const docCoverTintSchema = z.enum(["gray", "blue", "teal", "green", "yellow", "orange"]);

/** Covers used to be numbered gradients; those indexes map to the flat cover of the closest hue. */
const LEGACY_COVERS = ["orange", "green", "teal", "blue", "yellow", "gray"] as const;

const docCoverSchema = z.preprocess(
	(raw) => {
		if (!raw || typeof raw !== "object" || "tint" in raw) return raw;
		const { gradient, ...rest } = raw as { gradient?: unknown };
		return { ...rest, tint: LEGACY_COVERS[Number(gradient)] ?? "gray" };
	},
	z.object({
		enabled: z.boolean(),
		tint: z.preprocess((value) => {
			const tint = normalizeTint(value);
			return docCoverTintSchema.safeParse(tint).success ? tint : "gray";
		}, docCoverTintSchema),
	}),
);

export const docSchema = z.object({
	id: z.string(),
	title: z.string(),
	emoji: z.string(),
	folderId: z.string().nullable(),
	tagIds: z.array(z.string()),
	ownerId: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
	starred: z.boolean(),
	trashedAt: z.string().nullable(),
	font: docFontSchema,
	width: docWidthSchema,
	cover: docCoverSchema,
	blocks: z.array(blockSchema),
});
export type Doc = z.infer<typeof docSchema>;

/** Everything an edit may change. Ids, owner and timestamps are the server's business. */
export type DocPatch = Partial<
	Pick<
		Doc,
		"title" | "emoji" | "folderId" | "tagIds" | "starred" | "font" | "width" | "cover" | "blocks"
	>
>;

export const folderSchema = z.object({
	id: z.string(),
	name: z.string().min(1),
	parentId: z.string().nullable(),
});
export type Folder = z.infer<typeof folderSchema>;

export const tagSchema = z.object({
	id: z.string(),
	name: z.string().min(1).max(24),
	tint: z.string(),
});
export type Tag = z.infer<typeof tagSchema>;

export const newFolderSchema = z.object({
	name: z.string().trim().min(1, "Give the folder a name.").max(40, "Keep it under 40 characters."),
});
