import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/cn";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronLeft, Folder, Inbox, Pin, Search } from "lucide-react";
import { type RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Markdown } from "@/components/kit/markdown";
import { notebookQuery } from "@/features/notes/api/queries";
import { NoteFooter } from "@/features/notes/components/note-footer";
import { NoteOutline } from "@/features/notes/components/note-outline";
import { PictureViewer } from "@/features/notes/components/picture-viewer";
import type { Note } from "@/features/notes/schemas/note";
import { excerpt } from "@/features/notes/utils/excerpt";
import {
	HEADING_ID_PREFIX,
	noteHeadings,
	notePictures,
} from "@/features/notes/utils/note-structure";
import { sortNotes } from "@/features/notes/utils/sort-notes";
import type { AppViewProps } from "@/lib/apps";
import { formatDate } from "@/lib/format";

const ALL = "all";

/**
 * Three panes when wide (folders · list · note), two in a medium pane, one at a time when narrow.
 * Sizes follow the pane (container queries), so Notes also works in a 30% split.
 */
export function NotesPage({ itemId, onItemChange }: AppViewProps) {
	const { data } = useSuspenseQuery(notebookQuery);
	const [folder, setFolder] = useState<string>(ALL);
	const [query, setQuery] = useState("");

	const visible = useMemo(() => {
		const q = query.trim().toLowerCase();
		return sortNotes(
			data.notes
				.filter((n) => folder === ALL || n.folder === folder)
				.filter((n) => !q || `${n.title} ${n.body}`.toLowerCase().includes(q)),
		);
	}, [data.notes, folder, query]);

	const selected = data.notes.find((n) => n.id === itemId) ?? visible[0] ?? data.notes[0];
	// Previous / next follow the list as shown; when the open note is filtered out, the full list.
	const order =
		selected && visible.some((n) => n.id === selected.id) ? visible : sortNotes(data.notes);
	const position = selected ? order.findIndex((n) => n.id === selected.id) : -1;
	const previous = position > 0 ? order[position - 1] : undefined;
	const next = position >= 0 ? order[position + 1] : undefined;

	const headings = useMemo(() => (selected ? noteHeadings(selected.body) : []), [selected]);
	const pictures = useMemo(() => (selected ? notePictures(selected.body) : []), [selected]);
	const [pictureIndex, setPictureIndex] = useState<number | null>(null);
	const pictureTrigger = useRef<HTMLElement | null>(null);
	const openPicture = useCallback(
		(src: string, trigger: HTMLElement) => {
			const index = pictures.findIndex((p) => p.src === src);
			if (index < 0) return;
			pictureTrigger.current = trigger;
			setPictureIndex(index);
		},
		[pictures],
	);

	// A new note starts at the top of the reading pane; opened from Previous / Next, focus follows.
	const readingPane = useRef<HTMLElement>(null);
	const focusAfterOpen = useRef(false);
	const selectedId = selected?.id;
	useEffect(() => {
		if (!selectedId) return;
		const pane = readingPane.current;
		pane?.scrollTo({ top: 0 });
		setPictureIndex(null);
		if (focusAfterOpen.current) {
			focusAfterOpen.current = false;
			pane?.focus({ preventScroll: true });
		}
	}, [selectedId]);
	const openStep = (id: string) => {
		focusAfterOpen.current = true;
		onItemChange(id);
	};
	const activeHeading = useActiveHeading(readingPane, headings, selectedId);
	const jumpTo = (id: string) => {
		const pane = readingPane.current;
		const target = document.getElementById(id);
		if (!pane || !target) return;
		const top =
			target.getBoundingClientRect().top - pane.getBoundingClientRect().top + pane.scrollTop - 24;
		const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
		pane.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
		target.focus({ preventScroll: true });
	};
	const hasSelection = itemId !== undefined;
	const folders = [{ id: ALL, name: "All notes" }, ...data.folders];
	const count = (id: string) =>
		id === ALL ? data.notes.length : data.notes.filter((n) => n.folder === id).length;

	return (
		<div className="@container/notes h-full min-h-0">
			<div className="flex h-full min-h-0">
				{/* Folders: only on wide panes. */}
				<nav
					aria-label="Folders"
					className="scrollbar-none hidden h-full w-52 shrink-0 overflow-y-auto border-border/60 border-r bg-secondary/50 px-3 py-4 @5xl/notes:block"
				>
					<p className="px-3 pb-2 font-medium text-[11px] text-muted-foreground uppercase tracking-[0.08em]">
						Folders
					</p>
					{folders.map((f) => (
						<button
							key={f.id}
							type="button"
							onClick={() => setFolder(f.id)}
							aria-current={folder === f.id ? "true" : undefined}
							className={cn(
								"flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[14px] outline-none focus-visible:ring-2 focus-visible:ring-ring",
								folder === f.id ? "bg-tint/25 font-medium text-tint-text" : "hover:bg-shade/5",
							)}
						>
							{f.id === ALL ? <Inbox className="size-4" /> : <Folder className="size-4" />}
							<span className="flex-1 truncate">{f.name}</span>
							<span className="text-[12px] text-muted-foreground tabular-nums">{count(f.id)}</span>
						</button>
					))}
				</nav>

				{/* Note list. */}
				<section
					aria-label="Notes"
					className={cn(
						"flex h-full w-full shrink-0 flex-col border-border/60 @2xl/notes:w-72 @2xl/notes:border-r",
						hasSelection && "hidden @2xl/notes:flex",
					)}
				>
					<div className="space-y-2.5 px-3 pt-4 pb-2">
						<label className="flex h-9 items-center gap-2 rounded-xl bg-shade/5 px-3 text-muted-foreground focus-within:ring-2 focus-within:ring-ring">
							<Search className="size-4 shrink-0" />
							<span className="sr-only">Search notes</span>
							<input
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								placeholder="Search"
								className="w-full bg-transparent text-[14px] text-foreground outline-none placeholder:text-muted-foreground"
							/>
						</label>
						<div className="scrollbar-none -mx-3 flex gap-1.5 overflow-x-auto px-3 @5xl/notes:hidden">
							{folders.map((f) => (
								<button
									key={f.id}
									type="button"
									onClick={() => setFolder(f.id)}
									aria-pressed={folder === f.id}
									className={cn(
										"shrink-0 rounded-full px-3 py-1.5 font-medium text-[12.5px] outline-none focus-visible:ring-2 focus-visible:ring-ring",
										folder === f.id
											? "bg-tint text-tint-foreground"
											: "bg-shade/6 hover:bg-shade/10",
									)}
								>
									{f.name}
								</button>
							))}
						</div>
					</div>
					<ul className="scrollbar-none min-h-0 flex-1 space-y-1 overflow-y-auto px-3 pb-4">
						{visible.length === 0 ? (
							<li className="px-3 py-10 text-center text-[14px] text-muted-foreground">
								No notes match.
							</li>
						) : (
							visible.map((note) => (
								<li key={note.id}>
									<NoteRow
										note={note}
										active={selected?.id === note.id}
										onClick={() => onItemChange(note.id)}
									/>
								</li>
							))
						)}
					</ul>
				</section>

				{/* The note. */}
				<article
					ref={readingPane}
					tabIndex={-1}
					aria-label={selected?.title}
					className={cn(
						"h-full min-w-0 flex-1 overflow-y-auto outline-none",
						!hasSelection && "hidden @2xl/notes:block",
					)}
				>
					<div className="sticky top-0 z-10 px-3 pt-3 @2xl/notes:hidden">
						<Button
							variant="secondary"
							size="sm"
							onClick={() => onItemChange(undefined)}
							className="glass shadow-soft"
						>
							<ChevronLeft />
							Notes
						</Button>
					</div>
					{selected ? (
						<div
							key={selected.id}
							className="mx-auto flex max-w-[62rem] justify-center gap-10 px-6 pt-6 pb-20 @2xl/notes:px-10 @2xl/notes:pt-10"
						>
							<div className="min-w-0 max-w-[44rem] flex-1">
								<p className="mb-1 text-center text-[12.5px] text-muted-foreground">
									{[
										selected.date ? formatDate(selected.date) : null,
										data.folders.find((f) => f.id === selected.folder)?.name,
									]
										.filter(Boolean)
										.join(" · ")}
								</p>
								<Markdown
									className="mx-auto"
									headingIdPrefix={HEADING_ID_PREFIX}
									onImageOpen={openPicture}
								>
									{selected.body}
								</Markdown>
								<div className="mx-auto max-w-[68ch]">
									<NoteFooter
										stack={selected.stack}
										previous={previous}
										next={next}
										onOpen={openStep}
									/>
								</div>
							</div>
							{/* Beside the text, never over it: only when the sheet is wide (not split, not a phone). */}
							{headings.length >= 2 ? (
								<aside className="hidden w-48 shrink-0 @6xl/notes:block">
									<div className="sticky top-10 max-h-[calc(100dvh-16rem)] overflow-y-auto pt-8">
										<NoteOutline headings={headings} activeId={activeHeading} onJump={jumpTo} />
									</div>
								</aside>
							) : null}
						</div>
					) : null}
				</article>
				<PictureViewer
					pictures={pictures}
					index={pictureIndex}
					onIndexChange={setPictureIndex}
					onClose={() => setPictureIndex(null)}
					returnFocusTo={pictureTrigger.current}
				/>
			</div>
		</div>
	);
}

function NoteRow({ note, active, onClick }: { note: Note; active: boolean; onClick: () => void }) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-current={active ? "true" : undefined}
			className={cn(
				"w-full rounded-xl px-3 py-2.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring",
				active ? "bg-tint/25" : "hover:bg-shade/5",
			)}
		>
			{note.pinned ? (
				<span className="mb-0.5 flex items-center gap-1 font-medium text-[11px] text-muted-foreground">
					<Pin className="size-3 shrink-0 text-tint-text" aria-hidden />
					Pinned
				</span>
			) : null}
			<span className="block truncate font-semibold text-[14px]">{note.title}</span>
			<span className="mt-0.5 flex gap-2 text-[12.5px]">
				{note.date ? (
					<span className="shrink-0 text-foreground/70">{formatDate(note.date)}</span>
				) : null}
				<span className="line-clamp-1 text-muted-foreground">
					{note.excerpt ?? excerpt(note.body)}
				</span>
			</span>
		</button>
	);
}

/** The outline entry for the heading nearest the top of the reading pane, updated as it scrolls. */
function useActiveHeading(
	pane: RefObject<HTMLElement | null>,
	headings: { id: string }[],
	noteId: string | undefined,
) {
	const [active, setActive] = useState<string | undefined>(undefined);
	useEffect(() => {
		const el = pane.current;
		setActive(undefined);
		if (!el || headings.length < 2 || noteId === undefined) return;
		let frame = 0;
		const update = () => {
			frame = 0;
			const limit = el.getBoundingClientRect().top + 96;
			let current: string | undefined;
			for (const h of headings) {
				const target = document.getElementById(h.id);
				if (target && target.getBoundingClientRect().top <= limit) current = h.id;
			}
			setActive(current);
		};
		const onScroll = () => {
			if (!frame) frame = requestAnimationFrame(update);
		};
		update();
		el.addEventListener("scroll", onScroll, { passive: true });
		return () => {
			el.removeEventListener("scroll", onScroll);
			if (frame) cancelAnimationFrame(frame);
		};
	}, [pane, headings, noteId]);
	return active;
}
