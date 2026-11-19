/** First line of prose in a markdown note, without markup, for list previews. */
export function excerpt(markdown: string, max = 110) {
	const line =
		markdown
			.split("\n")
			.map((l) => l.trim())
			.find((l) => l && !l.startsWith("#")) ?? "";
	const plain = line.replace(/^[-*>\d.]+\s*/, "").replace(/[*_`[\]]/g, "");
	return plain.length > max ? `${plain.slice(0, max).trimEnd()}…` : plain;
}
