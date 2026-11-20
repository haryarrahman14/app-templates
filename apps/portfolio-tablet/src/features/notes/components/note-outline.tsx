import { cn } from "@repo/ui/lib/cn";
import type { MouseEvent } from "react";
import type { NoteHeading } from "@/features/notes/schemas/note";

/** "On this note": the note's `##` headings; each jumps to its heading inside the reading pane. */
export function NoteOutline({
	headings,
	activeId,
	onJump,
}: {
	headings: NoteHeading[];
	activeId?: string;
	onJump: (id: string) => void;
}) {
	const jump = (e: MouseEvent, id: string) => {
		e.preventDefault();
		onJump(id);
	};
	return (
		<nav aria-labelledby="note-outline-label">
			<p
				id="note-outline-label"
				className="pb-2 font-medium text-[11px] text-muted-foreground uppercase tracking-[0.08em]"
			>
				On this note
			</p>
			<ul className="space-y-0.5 border-border/70 border-l">
				{headings.map((h) => {
					const active = h.id === activeId;
					return (
						<li key={h.id}>
							<a
								href={`#${h.id}`}
								onClick={(e) => jump(e, h.id)}
								aria-current={active ? "location" : undefined}
								className={cn(
									"-ml-px block border-l-2 py-1 pr-1 pl-3 text-[12.5px] leading-snug outline-none transition-colors focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none",
									active
										? "border-tint-text font-medium text-foreground"
										: "border-transparent text-muted-foreground hover:text-foreground",
								)}
							>
								{h.text}
							</a>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}
