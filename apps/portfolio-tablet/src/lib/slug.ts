import { isValidElement, type ReactNode } from "react";

/** A heading's text as a URL-safe anchor: "The rest follows the visitor" → "the-rest-follows-the-visitor". */
export function slugify(text: string) {
	return text
		.toLowerCase()
		.normalize("NFKD")
		.replace(/[̀-ͯ]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

/** The plain text inside rendered markdown children (strong, code, links …). */
export function textOf(node: ReactNode): string {
	if (node === null || node === undefined || typeof node === "boolean") return "";
	if (typeof node === "string" || typeof node === "number") return String(node);
	if (Array.isArray(node)) return node.map(textOf).join("");
	if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children);
	return "";
}
