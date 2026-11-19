/** Builds a CSV string (RFC 4180 quoting) and downloads it in the browser. */
export function toCsv(rows: Record<string, string | number | boolean | null | undefined>[]) {
	if (rows.length === 0) return "";
	const headers = Object.keys(rows[0] ?? {});
	const quote = (value: unknown) => {
		const text = value == null ? "" : String(value);
		return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
	};
	return [
		headers.join(","),
		...rows.map((row) => headers.map((h) => quote(row[h])).join(",")),
	].join("\n");
}

export function downloadCsv(filename: string, csv: string) {
	const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	link.click();
	URL.revokeObjectURL(url);
}
