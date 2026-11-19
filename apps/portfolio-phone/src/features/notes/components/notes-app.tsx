import { useSuspenseQuery } from "@tanstack/react-query";
import { SearchX, Share } from "lucide-react";
import { AppScreen } from "@/components/kit/app-screen";
import { InsetRow, InsetSection } from "@/components/kit/inset-list";
import { PushView } from "@/components/kit/push-view";
import { notesQuery } from "@/features/notes/api/queries";
import { NoteBody } from "@/features/notes/components/note-body";
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
				<NoteDetail note={note} />
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

function NoteDetail({ note }: { note: Note | undefined }) {
	const nav = usePhoneNav();
	const share = useShareLink();
	const back = { label: "Notes", onClick: nav.back };

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

	return (
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
					{formatDate(note.date)} · {readingMinutes(note.body)} min read
				</p>
				<h1 className="mt-1 font-bold text-[27px] leading-[1.15] tracking-[-0.02em]">
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
				<NoteBody markdown={note.body} />
				<p className="mt-10 text-center text-[13px] text-muted-foreground">· · ·</p>
			</article>
		</AppScreen>
	);
}
