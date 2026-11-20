import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronRight, Pin, SearchX, Share } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AppScreen } from "@/components/kit/app-screen";
import { InsetRow, InsetSection } from "@/components/kit/inset-list";
import { PushView } from "@/components/kit/push-view";
import { notesQuery } from "@/features/notes/api/queries";
import { NoteBody } from "@/features/notes/components/note-body";
import { PictureViewer } from "@/features/notes/components/picture-viewer";
import type { Note } from "@/features/notes/schemas/note";
import { formatDate, readingMinutes } from "@/lib/format";
import { usePhoneNav } from "@/lib/phone-nav";
import { useShareLink } from "@/lib/share";

export function NotesApp() {
	const { data: notes } = useSuspenseQuery(notesQuery);
	const nav = usePhoneNav();
	const note = nav.id ? notes.find((n) => n.slug === nav.id) : undefined;

	const row = (item: Note) => (
		<InsetRow
			key={item.slug}
			label={<span className="font-semibold">{item.title}</span>}
			detail={
				<span className="line-clamp-2">
					{item.pinned ? <PinnedMark /> : null}
					<span className="text-foreground/70">{formatDate(item.date, "short")}</span>
					{"  "}
					{item.excerpt}
				</span>
			}
			onClick={() => nav.open("notes", item.slug)}
		/>
	);

	return (
		<PushView viewKey={nav.id ?? "list"} depth={nav.id ? 1 : 0}>
			{nav.id ? (
				<NoteDetail note={note} notes={notes} />
			) : (
				<AppScreen
					title="Notes"
					subtitle={`${notes.length} ${notes.length === 1 ? "post" : "posts"} in English`}
					back={{ label: "Home", onClick: nav.back }}
				>
					<InsetSection header="Recent">{notes.map(row)}</InsetSection>
				</AppScreen>
			)}
		</PushView>
	);
}

/** A small, quiet "Pinned" mark for a pinned note. */
function PinnedMark() {
	return (
		<span className="mr-1.5 inline-flex items-center gap-1 align-[-1px] font-medium text-[12px] text-foreground/70">
			<Pin className="size-3 rotate-45" strokeWidth={2.4} aria-hidden />
			Pinned
			<span aria-hidden className="text-muted-foreground">
				·
			</span>
		</span>
	);
}

/** Set by Previous / Next, so the note they open moves focus to its title. */
let focusTitleOnOpen = false;

function NoteDetail({ note, notes }: { note: Note | undefined; notes: Note[] }) {
	const nav = usePhoneNav();
	const share = useShareLink();
	const back = { label: "Notes", onClick: nav.back };
	const [picture, setPicture] = useState<number | null>(null);
	const title = useRef<HTMLHeadingElement>(null);

	useEffect(() => {
		if (!focusTitleOnOpen) return;
		focusTitleOnOpen = false;
		title.current?.focus({ preventScroll: true });
	}, []);

	if (!note) {
		return (
			<AppScreen title="Not found" back={back} largeTitle={false}>
				<div className="flex flex-col items-center px-8 pt-24 text-center">
					<SearchX className="size-10 text-muted-foreground" />
					<p className="mt-3 font-semibold text-[17px]">This note isn't here</p>
				</div>
			</AppScreen>
		);
	}

	const at = notes.findIndex((n) => n.slug === note.slug);
	const previous = notes[at - 1];
	const next = notes[at + 1];
	const goTo = (target: Note) => {
		focusTitleOnOpen = true;
		nav.swap(target.slug);
	};

	return (
		<>
			<AppScreen
				title={note.title}
				back={back}
				largeTitle={false}
				className="bg-(--grouped-card)"
				trailing={
					<button
						type="button"
						aria-label="Share this note"
						onClick={() => share(note.title, "notes", note.slug)}
						className="grid size-9 place-items-center rounded-lg text-tint-text outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
					>
						<Share className="size-[19px]" />
					</button>
				}
			>
				<article className="px-6 pt-2">
					<p className="text-[12.5px] text-muted-foreground">
						{note.pinned ? <PinnedMark /> : null}
						{formatDate(note.date)} · {readingMinutes(note.body)} min read
					</p>
					<h1
						ref={title}
						tabIndex={-1}
						className="mt-1 rounded-md font-bold outline-none focus-visible:ring-2 focus-visible:ring-ring/50 text-[27px] leading-[1.15] tracking-[-0.02em]"
					>
						{note.title}
					</h1>
					<p className="mt-2 text-[16px] text-muted-foreground leading-snug">{note.excerpt}</p>
					{note.tags.length ? (
						<p className="mt-3 flex flex-wrap gap-1.5">
							{note.tags.map((tag) => (
								<span
									key={tag}
									className="rounded-full bg-foreground/[0.06] px-2.5 py-0.5 text-[12.5px] text-foreground/80"
								>
									{tag}
								</span>
							))}
						</p>
					) : null}
					<hr className="my-5 border-(--grouped-line)" />
					<NoteBody
						markdown={note.body}
						onOpenPicture={(src) => {
							const index = note.pictures.findIndex((p) => p.src === src);
							if (index >= 0) setPicture(index);
						}}
					/>
					<p className="mt-10 text-center text-[13px] text-muted-foreground">· · ·</p>
					{note.stack.length ? (
						<section aria-labelledby="built-with" className="mt-8">
							<h2
								id="built-with"
								className="font-medium text-[12.5px] text-muted-foreground uppercase tracking-wide"
							>
								Built with
							</h2>
							<ul className="mt-2.5 flex flex-wrap gap-1.5">
								{note.stack.map((item) => (
									<li
										key={item}
										className="rounded-full border border-(--grouped-line) px-2.5 py-[3px] text-[12.5px] text-foreground/75"
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
							className="mt-8 overflow-hidden rounded-[14px] bg-(--grouped) shadow-[0_0_0_0.5px_var(--grouped-line)]"
						>
							{previous ? (
								<SiblingRow label="Previous" note={previous} onClick={() => goTo(previous)} />
							) : null}
							{next ? <SiblingRow label="Next" note={next} onClick={() => goTo(next)} /> : null}
						</nav>
					) : null}
				</article>
			</AppScreen>
			<PictureViewer
				pictures={note.pictures}
				index={picture}
				onIndex={setPicture}
				onClose={() => setPicture(null)}
			/>
		</>
	);
}

/** One of the two rows at a note's end: the note before or after it in the list. */
function SiblingRow({
	label,
	note,
	onClick,
}: {
	label: "Previous" | "Next";
	note: Note;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="group/row flex w-full items-center gap-3 pl-4 text-left outline-none transition-colors hover:bg-foreground/[0.03] focus-visible:bg-foreground/[0.06] active:bg-foreground/[0.07]"
		>
			<span className="flex min-w-0 flex-1 items-center gap-3 border-(--grouped-line) border-b py-3 pr-3 group-last/row:border-b-0">
				<span className="min-w-0 flex-1">
					<span className="block text-[12.5px] text-muted-foreground">{label}</span>
					<span className="mt-0.5 line-clamp-2 font-semibold text-[15px] leading-snug">
						{note.title}
					</span>
				</span>
				<ChevronRight className="size-4 shrink-0 text-muted-foreground/60" strokeWidth={2.5} />
			</span>
		</button>
	);
}
