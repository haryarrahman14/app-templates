import type { ReactNode } from "react";

/** **bold** → <strong>. */
function inline(text: string, keyPrefix: string): ReactNode[] {
	let offset = 0;
	return text
		.split(/(\*\*[^*]+\*\*)/g)
		.filter(Boolean)
		.map((part) => {
			const at = offset;
			offset += part.length;
			return { part, key: `${keyPrefix}-${at}` };
		})
		.map(({ part, key }) =>
			part.startsWith("**") && part.endsWith("**") ? (
				<strong key={key} className="font-semibold">
					{part.slice(2, -2)}
				</strong>
			) : (
				part
			),
		);
}

/** A deliberately tiny markdown-ish renderer: `#` headings, `- ` bullets, **bold**, paragraphs. */
export function NotePreview({ body }: { body: string }) {
	const blocks: ReactNode[] = [];
	let bullets: { line: number; text: string }[] = [];
	const lines = body.split("\n");

	const flush = (key: string) => {
		if (bullets.length === 0) return;
		const items = bullets;
		bullets = [];
		blocks.push(
			<ul key={key} className="my-2 list-disc space-y-1 pl-5">
				{items.map((item) => (
					<li key={`line-${item.line}`}>{inline(item.text, `line-${item.line}`)}</li>
				))}
			</ul>,
		);
	};

	lines.forEach((line, index) => {
		const key = `b${index}`;
		if (line.startsWith("- ")) {
			bullets.push({ line: index, text: line.slice(2) });
			return;
		}
		flush(`ul${index}`);
		if (line.startsWith("## ")) {
			blocks.push(
				<h4 key={key} className="mt-4 mb-1 font-semibold text-base">
					{inline(line.slice(3), key)}
				</h4>,
			);
		} else if (line.startsWith("# ")) {
			blocks.push(
				<h3 key={key} className="mt-4 mb-1 font-semibold text-lg">
					{inline(line.slice(2), key)}
				</h3>,
			);
		} else if (line.trim()) {
			blocks.push(
				<p key={key} className="my-2">
					{inline(line, key)}
				</p>,
			);
		}
	});
	flush("ul-end");

	if (blocks.length === 0) {
		return <p className="text-muted-foreground">Nothing to preview yet.</p>;
	}
	return <div className="text-[15px] leading-relaxed">{blocks}</div>;
}
