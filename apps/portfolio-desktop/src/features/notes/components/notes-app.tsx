import { cn } from "@repo/ui/lib/cn";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronLeftIcon, PinIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import { notesQuery } from "@/features/notes/api/queries";
import { NoteMarkdown } from "@/features/notes/components/note-markdown";
import type { Note } from "@/features/notes/schemas/note";
import { excerpt } from "@/features/notes/utils/excerpt";
import { formatDate, formatShortDate } from "@/lib/format";

/** Two panes: the list of notes and the selected note, rendered from Markdown on white paper. */
export function NotesApp() {
	const { data: notes } = useSuspenseQuery(notesQuery);
	const [selectedId, setSelectedId] = useState(notes[0]?.id);
	const [query, setQuery] = useState("");
	// Phones show one pane at a time.
	const [showNoteOnPhone, setShowNoteOnPhone] = useState(false);

	const needle = query.trim().toLowerCase();
	const filtered = needle
		? notes.filter((note) =>
				`${note.title} ${note.body} ${note.tags.join(" ")}`.toLowerCase().includes(needle),
			)
		: notes;
	const selected = notes.find((note) => note.id === selectedId) ?? notes[0];
	const groups = [
		{ label: "Pinned", items: filtered.filter((note) => note.pinned) },
		{ label: "Notes", items: filtered.filter((note) => !note.pinned) },
	].filter((group) => group.items.length > 0);

	const select = (note: Note) => {
		setSelectedId(note.id);
		setShowNoteOnPhone(true);
	};

	return (
		<div className="flex h-full">
			<aside
				className={cn(
					"flex w-full shrink-0 flex-col border-foreground/5 border-r bg-paper-list md:w-72",
					showNoteOnPhone && "max-md:hidden",
				)}
			>
				<div className="flex flex-col gap-3 p-4 pb-3">
					<div className="flex items-baseline justify-between">
						<h2 className="font-semibold text-lg tracking-tight">Notes</h2>
						<span className="text-muted-foreground text-xs tabular-nums">
							{notes.length} {notes.length === 1 ? "note" : "notes"}
						</span>
					</div>
					<label className="relative">
						<span className="sr-only">Search notes</span>
						<SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
						<input
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							placeholder="Search"
							className="h-8 w-full rounded-lg bg-foreground/[0.06] pr-2 pl-8 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
						/>
					</label>
				</div>
				<div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
					{groups.length === 0 && (
						<p className="px-3 py-8 text-center text-muted-foreground text-sm">Nothing found.</p>
					)}
					{groups.map((group) => (
						<section key={group.label} className="mb-2">
							<h3 className="flex items-center gap-1.5 px-3 pt-2 pb-1 font-semibold text-[11px] text-muted-foreground uppercase tracking-[0.12em]">
								{group.label === "Pinned" && <PinIcon className="size-3" />}
								{group.label}
							</h3>
							<ul className="flex flex-col gap-0.5">
								{group.items.map((note) => {
									const active = note.id === selected?.id;
									return (
										<li key={note.id}>
											<button
												type="button"
												onClick={() => select(note)}
												aria-current={active ? "true" : undefined}
												className={cn(
													"flex w-full flex-col gap-0.5 rounded-xl px-3 py-2.5 text-left transition-colors",
													active ? "bg-yellow/30 dark:bg-yellow/20" : "hover:bg-foreground/[0.04]",
												)}
											>
												<span className="truncate font-semibold text-sm">{note.title}</span>
												<span className="flex gap-2 text-[13px]">
													<span className="shrink-0 text-foreground/70 tabular-nums">
														{formatShortDate(note.date)}
													</span>
													<span className="truncate text-muted-foreground">
														{note.excerpt ?? excerpt(note.body)}
													</span>
												</span>
											</button>
										</li>
									);
								})}
							</ul>
						</section>
					))}
				</div>
			</aside>

			<article
				className={cn(
					"min-w-0 flex-1 overflow-y-auto bg-paper",
					!showNoteOnPhone && "max-md:hidden",
				)}
			>
				<button
					type="button"
					onClick={() => setShowNoteOnPhone(false)}
					className="sticky top-0 z-10 flex w-full items-center gap-1 bg-inherit px-3 py-2 font-medium text-tint-text text-sm md:hidden"
				>
					<ChevronLeftIcon className="size-5" />
					All notes
				</button>
				{selected && (
					<div className="mx-auto max-w-[64ch] px-7 pt-8 pb-16 md:px-12 md:pt-10">
						<p className="text-center text-muted-foreground text-xs">{formatDate(selected.date)}</p>
						<h1 className="mt-5 font-semibold font-serif text-[2rem] leading-tight tracking-tight">
							{selected.title}
						</h1>
						{selected.tags.length > 0 && (
							<div className="mt-3 flex flex-wrap gap-1.5">
								{selected.tags.map((tag) => (
									<span
										key={tag}
										className="rounded-full bg-foreground/[0.06] px-2.5 py-0.5 text-muted-foreground text-xs"
									>
										#{tag}
									</span>
								))}
							</div>
						)}
						<NoteMarkdown>{selected.body}</NoteMarkdown>
					</div>
				)}
			</article>
		</div>
	);
}
