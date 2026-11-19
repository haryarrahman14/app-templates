/** First line of real text in a Markdown note, without Markdown syntax, for the list preview. */
export function excerpt(markdown: string, max = 90) {
	const line =
		markdown
			.split("\n")
			.map((l) => l.trim())
			.find((l) => l && !l.startsWith("#")) ?? "";
	const plain = line
		.replace(/^([-*>]|\d+\.)\s+/, "")
		.replace(/[*_`]/g, "")
		.trim();
	return plain.length > max ? `${plain.slice(0, max).trimEnd()}…` : plain;
}
