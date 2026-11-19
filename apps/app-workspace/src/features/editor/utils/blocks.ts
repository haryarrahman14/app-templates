import type { Block, BlockType } from "@/features/documents/schemas/document";
import { TEXT_BLOCKS } from "@/features/editor/constants/block-options";

export const isTextBlock = (type: BlockType) => TEXT_BLOCKS.includes(type);

export const makeBlock = (type: BlockType = "paragraph", text = ""): Block => ({
	id: `b-${crypto.randomUUID().slice(0, 8)}`,
	type,
	text,
	...(type === "todo" ? { checked: false } : {}),
});

export const countWords = (title: string, blocks: Block[]) =>
	[title, ...blocks.map((b) => b.text)].join(" ").split(/\s+/).filter(Boolean).length;

export function moveItem<T>(items: T[], from: number, to: number) {
	if (to < 0 || to >= items.length || from === to) return items;
	const next = [...items];
	const [item] = next.splice(from, 1);
	if (item === undefined) return items;
	next.splice(to, 0, item);
	return next;
}
