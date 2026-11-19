import type { Experience } from "@/features/experience/schemas/experience";

/** Plain-text CV built from the experience data. Used when no cvUrl is set. */
export function cvText(owner: { name: string; role: string; email: string }, data: Experience) {
	const lines = [
		owner.name,
		`${owner.role} · ${owner.email}`,
		"",
		data.headline,
		"",
		"EXPERIENCE",
		...data.roles.flatMap((role) => [
			"",
			`${role.title}, ${role.company} (${[role.period, role.location].filter(Boolean).join(", ")})`,
			...role.groups.flatMap((group) => [
				...(group.title ? [`  ${group.title}${group.ongoing ? " (in development)" : ""}`] : []),
				...group.highlights.map((item) => `  - ${item}`),
			]),
		]),
		"",
		"EDUCATION",
		...data.education.flatMap((item) => [
			`${item.degree}, ${item.school} (${item.period})`,
			...item.detail.map((line) => `  - ${line}`),
		]),
	];
	return lines.join("\n");
}

export function downloadText(filename: string, text: string) {
	const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	link.click();
	URL.revokeObjectURL(url);
}
