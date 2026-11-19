/** Minimal CSV parser: commas, quoted fields, escaped quotes ("") and CRLF. */
export function parseCsv(text: string): { headers: string[]; rows: string[][] } {
	const records: string[][] = [];
	let field = "";
	let record: string[] = [];
	let quoted = false;

	for (let index = 0; index < text.length; index++) {
		const char = text[index];
		if (quoted) {
			if (char === '"' && text[index + 1] === '"') {
				field += '"';
				index++;
			} else if (char === '"') quoted = false;
			else field += char;
		} else if (char === '"') quoted = true;
		else if (char === ",") {
			record.push(field);
			field = "";
		} else if (char === "\n" || char === "\r") {
			if (char === "\r" && text[index + 1] === "\n") index++;
			record.push(field);
			records.push(record);
			record = [];
			field = "";
		} else field += char;
	}
	if (field || record.length) {
		record.push(field);
		records.push(record);
	}

	const nonEmpty = records.filter((row) => row.some((cell) => cell.trim()));
	const [headers = [], ...rows] = nonEmpty;
	return { headers: headers.map((header) => header.trim()), rows };
}
