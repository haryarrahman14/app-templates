import { cn } from "@repo/ui/lib/cn";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronLeftIcon, PinIcon, SearchIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { notesQuery } from "@/features/notes/api/queries";
import { NoteFooter } from "@/features/notes/components/note-footer";
import { NoteMarkdown } from "@/features/notes/components/note-markdown";
import { NoteOutline } from "@/features/notes/components/note-outline";
import { PictureViewer } from "@/features/notes/components/picture-viewer";
import type { Note } from "@/features/notes/schemas/note";
import { excerpt } from "@/features/notes/utils/excerpt";
import { noteHeadings, notePictures } from "@/features/notes/utils/note-structure";
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
	const body = selected?.body ?? "";
	const headings = useMemo(() => noteHeadings(body), [body]);
	const pictures = useMemo(() => notePictures(body), [body]);
	const [pictureIndex, setPictureIndex] = useState<number | null>(null);
	const pictureFrom = useRef<HTMLElement | null>(null);
	const openPicture = useCallback((index: number, from: HTMLElement) => {
		pictureFrom.current = from;
		setPictureIndex(index);
	}, []);
	const closePicture = useCallback(() => setPictureIndex(null), []);

	// Previous / Next follow the list as shown (pinned first, then newest first).
	const order = filtered.some((note) => note.id === selected?.id) ? filtered : notes;
	const at = order.findIndex((note) => note.id === selected?.id);
	const previous = at > 0 ? order[at - 1] : undefined;
	const next = at >= 0 ? order[at + 1] : undefined;

	const paneRef = useRef<HTMLElement>(null);
	const titleRef = useRef<HTMLHeadingElement>(null);
	const focusTitle = useRef(false);

	// A newly opened note starts at its top; opened from Previous / Next, focus moves to its title.
	// biome-ignore lint/correctness/useExhaustiveDependencies: runs when the note changes.
	useEffect(() => {
		paneRef.current?.scrollTo({ top: 0 });
		setPictureIndex(null);
		if (focusTitle.current) titleRef.current?.focus({ preventScroll: true });
		focusTitle.current = false;
	}, [selected?.id]);

	const select = (note: Note) => {
		setSelectedId(note.id);
		setShowNoteOnPhone(true);
	};
	const openFromFooter = (note: Note) => {
		focusTitle.current = true;
		select(note);
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
					{filtered.length === 0 && (
						<p className="px-3 py-8 text-center text-muted-foreground text-sm">Nothing found.</p>
					)}
					<ul className="flex flex-col gap-0.5">
						{filtered.map((note) => {
							const active = note.id === selected?.id;
							return (
								<li key={note.id}>
									<button
										type="button"
										onClick={() => select(note)}
										aria-current={active ? "true" : undefined}
										className={cn(
											"flex w-full flex-col gap-0.5 rounded-xl px-3 py-2.5 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
											active ? "bg-yellow/30 dark:bg-yellow/20" : "hover:bg-foreground/[0.04]",
										)}
									>
										<span className="flex items-baseline gap-2">
											<span className="min-w-0 flex-1 truncate font-semibold text-sm">
												{note.title}
											</span>
											{note.pinned && <PinnedMark />}
										</span>
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
				</div>
			</aside>

			<article
				ref={paneRef}
				className={cn(
					"@container min-w-0 flex-1 overflow-y-auto bg-paper",
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
					<div className="mx-auto flex max-w-[64ch] justify-center gap-12 @4xl:max-w-[calc(64ch+15rem)]">
						<div className="min-w-0 max-w-[64ch] flex-1 px-7 pt-8 pb-16 md:px-12 md:pt-10">
							<p className="flex items-center justify-center gap-2 text-muted-foreground text-xs">
								{formatDate(selected.date)}
								{selected.pinned && (
									<>
										<span aria-hidden>·</span>
										<PinnedMark />
									</>
								)}
							</p>
							<h1
								ref={titleRef}
								tabIndex={-1}
								className="mt-5 font-semibold font-serif text-[2rem] leading-tight tracking-tight focus:outline-none"
							>
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
							<NoteMarkdown headings={headings} pictures={pictures} onOpenPicture={openPicture}>
								{selected.body}
							</NoteMarkdown>
							<NoteFooter note={selected} previous={previous} next={next} onOpen={openFromFooter} />
						</div>
						{/* The outline gets its own column, so it never sits over the text. */}
						{headings.length >= 2 && (
							<aside className="hidden w-48 shrink-0 pt-24 pr-6 @4xl:block">
								<div className="sticky top-10">
									<NoteOutline key={selected.id} headings={headings} paneRef={paneRef} />
								</div>
							</aside>
						)}
					</div>
				)}
			</article>
			<PictureViewer
				pictures={pictures}
				index={pictureIndex}
				onIndexChange={setPictureIndex}
				onClose={closePicture}
				returnFocusTo={pictureFrom.current}
			/>
		</div>
	);
}

/** A small, quiet mark for pinned notes. */
function PinnedMark() {
	return (
		<span className="inline-flex shrink-0 items-center gap-1 font-normal text-[11px] text-muted-foreground">
			<PinIcon aria-hidden className="size-3" />
			Pinned
		</span>
	);
}
