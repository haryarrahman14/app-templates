import {
	CheckSquareIcon,
	Heading1Icon,
	Heading2Icon,
	ImageIcon,
	InfoIcon,
	ListIcon,
	type LucideIcon,
	MinusIcon,
	PilcrowIcon,
	QuoteIcon,
} from "lucide-react";
import type { BlockType } from "@/features/documents/schemas/document";

export type BlockOption = {
	type: BlockType;
	label: string;
	hint: string;
	icon: LucideIcon;
	keywords: string;
};

export const BLOCK_OPTIONS: BlockOption[] = [
	{
		type: "paragraph",
		label: "Text",
		hint: "Plain paragraph",
		icon: PilcrowIcon,
		keywords: "text paragraph p",
	},
	{
		type: "heading1",
		label: "Heading",
		hint: "Large section title",
		icon: Heading1Icon,
		keywords: "heading h1 title #",
	},
	{
		type: "heading2",
		label: "Subheading",
		hint: "Smaller section title",
		icon: Heading2Icon,
		keywords: "subheading heading h2 ##",
	},
	{
		type: "todo",
		label: "To-do",
		hint: "Checkbox item",
		icon: CheckSquareIcon,
		keywords: "todo task check []",
	},
	{
		type: "bullet",
		label: "Bulleted list",
		hint: "Simple list item",
		icon: ListIcon,
		keywords: "bullet list ul -",
	},
	{
		type: "quote",
		label: "Quote",
		hint: "Pull a sentence out",
		icon: QuoteIcon,
		keywords: "quote blockquote >",
	},
	{
		type: "callout",
		label: "Callout",
		hint: "Highlighted note",
		icon: InfoIcon,
		keywords: "callout note info tip",
	},
	{
		type: "divider",
		label: "Divider",
		hint: "A quiet line",
		icon: MinusIcon,
		keywords: "divider line hr ---",
	},
	{
		type: "image",
		label: "Image",
		hint: "Picture with a caption",
		icon: ImageIcon,
		keywords: "image picture photo",
	},
];

export const TEXT_BLOCKS: BlockType[] = [
	"paragraph",
	"heading1",
	"heading2",
	"todo",
	"bullet",
	"quote",
	"callout",
];

/** Markdown-style shortcuts typed at the start of an empty paragraph. */
export const MARKDOWN_SHORTCUTS: Record<string, BlockType> = {
	"# ": "heading1",
	"## ": "heading2",
	"- ": "bullet",
	"* ": "bullet",
	"[] ": "todo",
	"> ": "quote",
	"! ": "callout",
};

export const EMOJI_CHOICES = [
	"📄",
	"👋",
	"🧭",
	"🗓️",
	"✍️",
	"🌱",
	"🔎",
	"🪴",
	"💡",
	"🎨",
	"🧳",
	"🍲",
	"📌",
	"🚀",
	"📚",
	"🎯",
];
