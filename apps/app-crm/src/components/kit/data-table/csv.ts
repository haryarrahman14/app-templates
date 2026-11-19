const quote = (value: string) => (/[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value);

export function toCsv(header: string[], rows: string[][]) {
	return [header, ...rows].map((row) => row.map(quote).join(",")).join("\n");
}

export function downloadCsv(fileName: string, csv: string) {
	const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = fileName.endsWith(".csv") ? fileName : `${fileName}.csv`;
	link.click();
	URL.revokeObjectURL(url);
}
