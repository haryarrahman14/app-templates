import type { Block, BlockType } from "@/features/documents/schemas/document";

export type TemplateBlock = { type: BlockType; text?: string; checked?: boolean };

export type DocTemplate = {
	id: string;
	label: string;
	description: string;
	emoji: string;
	title: string;
	blocks: TemplateBlock[];
};

export const DOC_TEMPLATES: DocTemplate[] = [
	{
		id: "blank",
		label: "Blank document",
		description: "Start from an empty page",
		emoji: "📄",
		title: "",
		blocks: [{ type: "paragraph" }],
	},
	{
		id: "meeting",
		label: "Meeting notes",
		description: "Agenda, notes and action items",
		emoji: "🗓️",
		title: "Meeting notes",
		blocks: [
			{ type: "heading2", text: "Agenda" },
			{ type: "bullet", text: "" },
			{ type: "heading2", text: "Notes" },
			{ type: "paragraph", text: "" },
			{ type: "heading2", text: "Action items" },
			{ type: "todo", text: "", checked: false },
		],
	},
	{
		id: "brief",
		label: "Project brief",
		description: "Goal, scope and timeline",
		emoji: "🧭",
		title: "Project brief",
		blocks: [
			{ type: "callout", text: "One sentence: what are we doing and why now?" },
			{ type: "heading2", text: "Goal" },
			{ type: "paragraph", text: "" },
			{ type: "heading2", text: "Scope" },
			{ type: "bullet", text: "In: " },
			{ type: "bullet", text: "Out: " },
			{ type: "heading2", text: "Timeline" },
			{ type: "paragraph", text: "" },
		],
	},
	{
		id: "weekly",
		label: "Weekly plan",
		description: "Priorities for the week",
		emoji: "🌱",
		title: "This week",
		blocks: [
			{ type: "heading2", text: "Top three" },
			{ type: "todo", text: "", checked: false },
			{ type: "todo", text: "", checked: false },
			{ type: "todo", text: "", checked: false },
			{ type: "heading2", text: "Notes" },
			{ type: "paragraph", text: "" },
		],
	},
];

export const templateBlocks = (template: DocTemplate, makeId: () => string): Block[] =>
	template.blocks.map((block) => ({
		id: makeId(),
		type: block.type,
		text: block.text ?? "",
		...(block.type === "todo" ? { checked: block.checked ?? false } : {}),
	}));
