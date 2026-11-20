import { cn } from "@repo/ui/lib/cn";
import { type RefObject, useEffect, useState } from "react";
import type { NoteHeading } from "@/features/notes/schemas/note";
import { scrollBehavior } from "@/features/notes/utils/note-structure";

type NoteOutlineProps = {
	headings: NoteHeading[];
	/** The reading pane that scrolls. */
	paneRef: RefObject<HTMLElement | null>;
};

/** "On this note": the note's `##` headings; each jumps to its heading inside the reading pane. */
export function NoteOutline({ headings, paneRef }: NoteOutlineProps) {
	const [activeId, setActiveId] = useState(headings[0]?.id);

	// Marks the last heading that has scrolled past the top of the pane.
	useEffect(() => {
		const pane = paneRef.current;
		if (!pane) return;
		const update = () => {
			const top = pane.getBoundingClientRect().top + 96;
			let current = headings[0]?.id;
			for (const heading of headings) {
				const el = document.getElementById(heading.id);
				if (el && el.getBoundingClientRect().top <= top) current = heading.id;
			}
			setActiveId(current);
		};
		update();
		pane.addEventListener("scroll", update, { passive: true });
		return () => pane.removeEventListener("scroll", update);
	}, [headings, paneRef]);

	return (
		<nav aria-labelledby="note-outline-title" className="flex flex-col gap-2">
			<h2
				id="note-outline-title"
				className="font-semibold text-[11px] text-muted-foreground uppercase tracking-[0.12em]"
			>
				On this note
			</h2>
			<ul className="flex flex-col border-foreground/10 border-l">
				{headings.map((heading) => {
					const active = heading.id === activeId;
					return (
						<li key={heading.id}>
							<a
								href={`#${heading.id}`}
								aria-current={active ? "location" : undefined}
								onClick={(event) => {
									const target = document.getElementById(heading.id);
									if (!target) return;
									event.preventDefault();
									target.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
									target.focus({ preventScroll: true });
									// Pictures above load while scrolling and push the heading down: settle on it once more.
									paneRef.current?.addEventListener(
										"scrollend",
										() => target.scrollIntoView({ block: "start" }),
										{ once: true },
									);
								}}
								className={cn(
									"-ml-px block border-l py-1 pr-1 pl-3 text-[13px] leading-snug outline-none transition-colors focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring",
									active
										? "border-tint font-medium text-foreground"
										: "border-transparent text-muted-foreground hover:text-foreground",
								)}
							>
								{heading.text}
							</a>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}
