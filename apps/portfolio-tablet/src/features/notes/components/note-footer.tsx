import { cn } from "@repo/ui/lib/cn";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Note } from "@/features/notes/schemas/note";

/** After a note's text: what it was built with, then the notes either side of it in the list. */
export function NoteFooter({
	stack,
	previous,
	next,
	onOpen,
}: {
	stack: string[];
	previous?: Note;
	next?: Note;
	onOpen: (id: string) => void;
}) {
	return (
		<div className="mt-10 space-y-8">
			{stack.length > 0 ? (
				<section aria-labelledby="note-stack-label">
					<h2
						id="note-stack-label"
						className="pb-2.5 font-medium text-[11px] text-muted-foreground uppercase tracking-[0.08em]"
					>
						Built with
					</h2>
					<ul className="flex flex-wrap gap-1.5">
						{stack.map((item) => (
							<li
								key={item}
								className="rounded-full bg-shade/6 px-2.5 py-1 font-medium text-[12.5px] text-foreground/80"
							>
								{item}
							</li>
						))}
					</ul>
				</section>
			) : null}

			{previous || next ? (
				<nav
					aria-label="More notes"
					className="grid gap-2 border-border/70 border-t pt-6 @lg/notes:grid-cols-2"
				>
					{previous ? <StepLink note={previous} direction="previous" onOpen={onOpen} /> : null}
					{next ? <StepLink note={next} direction="next" onOpen={onOpen} /> : null}
				</nav>
			) : null}
		</div>
	);
}

function StepLink({
	note,
	direction,
	onOpen,
}: {
	note: Note;
	direction: "previous" | "next";
	onOpen: (id: string) => void;
}) {
	const isNext = direction === "next";
	const Icon = isNext ? ChevronRight : ChevronLeft;
	return (
		<button
			type="button"
			onClick={() => onOpen(note.id)}
			className={cn(
				"group flex min-h-16 items-center gap-3 rounded-2xl bg-shade/4 px-4 py-3 text-left outline-none transition-colors hover:bg-shade/8 focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none",
				isNext && "flex-row-reverse text-right @lg/notes:col-start-2",
			)}
		>
			<Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
			<span className="min-w-0 flex-1">
				<span className="block font-medium text-[11px] text-muted-foreground uppercase tracking-[0.08em]">
					{isNext ? "Next" : "Previous"}
				</span>
				<span className="mt-0.5 line-clamp-2 font-medium text-[14px] leading-snug">
					{note.title}
				</span>
			</span>
		</button>
	);
}
