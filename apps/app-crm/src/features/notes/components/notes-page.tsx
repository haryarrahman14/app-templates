import { Button } from "@repo/ui/components/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@repo/ui/components/empty-state";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@repo/ui/components/input-group";
import { cn } from "@repo/ui/lib/cn";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { NotebookPen, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { RecordGlyph } from "@/components/kit/record-glyph";
import { useCreateNote } from "@/features/notes/api/mutations";
import { notesQuery } from "@/features/notes/api/queries";
import { NoteEditor } from "@/features/notes/components/note-editor";
import { formatAgo } from "@/lib/format";
import { useLookups } from "@/lib/use-lookups";

export function NotesPage({ selectedId: selectedParam }: { selectedId?: string }) {
	const { data: notes } = useSuspenseQuery(notesQuery);
	const { recordLabel } = useLookups();
	const createNote = useCreateNote();
	const navigate = useNavigate({ from: "/notes" });
	const [query, setQuery] = useState("");

	const activeId = selectedParam ?? notes[0]?.id ?? null;
	const active = notes.find((note) => note.id === activeId) ?? null;

	const select = (id: string | null) =>
		navigate({ search: { note: id ?? undefined }, replace: true, resetScroll: false });

	const visible = useMemo(() => {
		const needle = query.trim().toLowerCase();
		if (!needle) return notes;
		return notes.filter((note) =>
			`${note.title} ${note.body} ${recordLabel(note.record)}`.toLowerCase().includes(needle),
		);
	}, [notes, query, recordLabel]);

	async function newNote() {
		const note = await createNote.mutateAsync({ title: "Untitled note", body: "", record: null });
		select(note.id);
	}

	return (
		<div className="flex h-[calc(100dvh-3.5rem)] min-h-0 md:h-[calc(100dvh-3.5rem-1rem)]">
			<aside
				className={cn(
					"min-h-0 w-full flex-col border-r md:flex md:w-80 md:shrink-0",
					selectedParam ? "hidden" : "flex",
				)}
				aria-label="Notes"
			>
				<div className="flex flex-col gap-3 border-b p-4">
					<div className="flex items-center justify-between">
						<h1 className="font-semibold text-xl">Notes</h1>
						<Button size="sm" onClick={newNote} disabled={createNote.isPending}>
							<Plus /> New note
						</Button>
					</div>
					<InputGroup>
						<InputGroupAddon>
							<Search />
						</InputGroupAddon>
						<InputGroupInput
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							placeholder="Search notes"
							aria-label="Search notes"
						/>
					</InputGroup>
				</div>
				<ul className="min-h-0 flex-1 overflow-y-auto p-2">
					{visible.length === 0 ? (
						<li className="px-3 py-10 text-center text-muted-foreground text-sm">
							{query ? `No notes match “${query}”.` : "No notes yet."}
						</li>
					) : null}
					{visible.map((note) => (
						<li key={note.id}>
							<button
								type="button"
								onClick={() => select(note.id)}
								aria-current={note.id === activeId ? "true" : undefined}
								className={cn(
									"flex w-full flex-col gap-1 rounded-xl px-3 py-2.5 text-left outline-none transition focus-visible:ring-3 focus-visible:ring-ring/50",
									note.id === activeId ? "bg-muted" : "hover:bg-muted/60",
								)}
							>
								<span className="flex w-full items-baseline justify-between gap-2">
									<span className="truncate font-medium text-sm">{note.title || "Untitled"}</span>
									<span className="shrink-0 text-muted-foreground text-xs">
										{formatAgo(note.updatedAt)}
									</span>
								</span>
								<span className="line-clamp-2 text-muted-foreground text-sm">
									{note.body.replace(/[#*-]/g, "").trim() || "Empty note"}
								</span>
								{note.record ? (
									<span className="mt-0.5 inline-flex max-w-full items-center gap-1.5 text-muted-foreground text-xs">
										<RecordGlyph type={note.record.type} size="xs" />
										<span className="truncate">{recordLabel(note.record)}</span>
									</span>
								) : null}
							</button>
						</li>
					))}
				</ul>
			</aside>

			<section
				className={cn("min-h-0 min-w-0 flex-1 md:block", selectedParam ? "block" : "hidden")}
				aria-label="Editor"
			>
				{active ? (
					<NoteEditor
						key={active.id}
						note={active}
						onBack={() => select(null)}
						onDeleted={() => select(notes.find((note) => note.id !== active.id)?.id ?? null)}
					/>
				) : (
					<Empty className="h-full">
						<EmptyHeader>
							<EmptyMedia variant="icon">
								<NotebookPen />
							</EmptyMedia>
							<EmptyTitle>No note selected</EmptyTitle>
							<EmptyDescription>Pick a note on the left, or start a new one.</EmptyDescription>
						</EmptyHeader>
						<EmptyContent>
							<Button onClick={newNote}>
								<Plus /> New note
							</Button>
						</EmptyContent>
					</Empty>
				)}
			</section>
		</div>
	);
}
