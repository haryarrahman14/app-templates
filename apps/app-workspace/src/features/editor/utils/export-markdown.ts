import type { Block } from "@/features/documents/schemas/document";

const line = (block: Block) => {
	switch (block.type) {
		case "heading1":
			return `## ${block.text}`;
		case "heading2":
			return `### ${block.text}`;
		case "todo":
			return `- [${block.checked ? "x" : " "}] ${block.text}`;
		case "bullet":
			return `- ${block.text}`;
		case "quote":
			return `> ${block.text}`;
		case "callout":
			return `> **Note:** ${block.text}`;
		case "divider":
			return "---";
		case "image":
			return `_[Image: ${block.text || "untitled"}]_`;
		default:
			return block.text;
	}
};

export const toMarkdown = (title: string, blocks: Block[]) =>
	`# ${title || "Untitled"}\n\n${blocks.map(line).join("\n\n")}\n`;

/** Saves the document as a .md file in the browser. */
export function downloadMarkdown(title: string, blocks: Block[]) {
	const blob = new Blob([toMarkdown(title, blocks)], { type: "text/markdown" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = `${(title || "untitled").toLowerCase().replace(/[^a-z0-9]+/g, "-")}.md`;
	link.click();
	URL.revokeObjectURL(url);
}
