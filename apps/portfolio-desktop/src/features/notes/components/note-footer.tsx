import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import type { Note } from "@/features/notes/schemas/note";

type NoteFooterProps = {
	note: Note;
	previous?: Note;
	next?: Note;
	onOpen: (note: Note) => void;
};

/** After the text: what the note was built with, then the notes either side of it in the list. */
export function NoteFooter({ note, previous, next, onOpen }: NoteFooterProps) {
	return (
		<footer className="mt-12 flex flex-col gap-10">
			{note.stack.length > 0 && (
				<section aria-labelledby="note-stack-title">
					<h2
						id="note-stack-title"
						className="font-semibold text-[11px] text-muted-foreground uppercase tracking-[0.12em]"
					>
						Built with
					</h2>
					<ul className="mt-3 flex flex-wrap gap-1.5">
						{note.stack.map((item) => (
							<li
								key={item}
								className="rounded-full border border-foreground/10 px-2.5 py-0.5 text-foreground/75 text-xs"
							>
								{item}
							</li>
						))}
					</ul>
				</section>
			)}
			{(previous || next) && (
				<nav
					aria-label="More notes"
					className="grid gap-3 border-foreground/10 border-t pt-6 sm:grid-cols-2"
				>
					{previous && (
						<NoteLink
							note={previous}
							direction="Previous"
							onOpen={onOpen}
							className="sm:col-start-1"
						/>
					)}
					{next && (
						<NoteLink
							note={next}
							direction="Next"
							onOpen={onOpen}
							className="sm:col-start-2 sm:items-end sm:text-right"
						/>
					)}
				</nav>
			)}
		</footer>
	);
}

type NoteLinkProps = {
	note: Note;
	direction: "Previous" | "Next";
	onOpen: (note: Note) => void;
	className?: string;
};

function NoteLink({ note, direction, onOpen, className }: NoteLinkProps) {
	const Icon = direction === "Previous" ? ArrowLeftIcon : ArrowRightIcon;
	return (
		<a
			href={`?app=notes#${note.id}`}
			onClick={(event) => {
				event.preventDefault();
				onOpen(note);
			}}
			className={`flex flex-col gap-1 rounded-xl px-4 py-3 outline-none transition-colors hover:bg-foreground/[0.04] focus-visible:ring-2 focus-visible:ring-ring ${className ?? ""}`}
		>
			<span className="flex items-center gap-1 text-muted-foreground text-xs">
				{direction === "Previous" && <Icon className="size-3.5" />}
				{direction} note
				{direction === "Next" && <Icon className="size-3.5" />}
			</span>
			<span className="font-medium font-serif text-[15px] text-foreground leading-snug">
				{note.title}
			</span>
		</a>
	);
}
