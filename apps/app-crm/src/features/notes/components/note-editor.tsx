import { Button } from "@repo/ui/components/button";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@repo/ui/components/select";
import { Tabs, TabsList, TabsTrigger } from "@repo/ui/components/tabs";
import { Textarea } from "@repo/ui/components/textarea";
import { Link } from "@tanstack/react-router";
import { Check, ChevronLeft, Loader2, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ConfirmDialog } from "@/components/kit/confirm-dialog";
import { RecordGlyph } from "@/components/kit/record-glyph";
import { useDeleteNote, useUpdateNote } from "@/features/notes/api/mutations";
import { NotePreview } from "@/features/notes/components/note-preview";
import type { Note } from "@/features/notes/schemas/note";
import { formatAgo } from "@/lib/format";
import { recordLink, recordRefSchema } from "@/lib/records";
import { useLookups } from "@/lib/use-lookups";

const NONE = "none";
const SAVE_AFTER_MS = 700;

/** Editor for one note. Mount it with `key={note.id}` so the draft resets per note. */
export function NoteEditor({
	note,
	onBack,
	onDeleted,
}: {
	note: Note;
	onBack: () => void;
	onDeleted: () => void;
}) {
	const { companies, people, recordLabel, memberName } = useLookups();
	const updateNote = useUpdateNote();
	const deleteNote = useDeleteNote();
	const [title, setTitle] = useState(note.title);
	const [body, setBody] = useState(note.body);
	const [mode, setMode] = useState<"write" | "preview">("write");
	const [dirty, setDirty] = useState(false);
	const [confirmOpen, setConfirmOpen] = useState(false);
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const { mutate } = updateNote;

	// Debounced autosave of title and body.
	useEffect(() => {
		if (!dirty) return;
		timer.current = setTimeout(() => {
			mutate({ id: note.id, title: title.trim() || "Untitled", body });
			setDirty(false);
		}, SAVE_AFTER_MS);
		return () => {
			if (timer.current) clearTimeout(timer.current);
		};
	}, [dirty, title, body, note.id, mutate]);

	const saving = dirty || updateNote.isPending;

	return (
		<div className="flex h-full min-h-0 flex-col">
			<div className="flex flex-wrap items-center gap-2 border-b px-4 py-2.5">
				<Button
					variant="ghost"
					size="icon-sm"
					className="md:hidden"
					onClick={onBack}
					aria-label="Back to notes"
				>
					<ChevronLeft />
				</Button>
				<Select
					value={note.record ? `${note.record.type}:${note.record.id}` : NONE}
					onValueChange={(value) => {
						const [type, id] = value.split(":");
						const parsed = recordRefSchema.safeParse({ type, id });
						mutate({ id: note.id, record: value === NONE || !parsed.success ? null : parsed.data });
					}}
				>
					<SelectTrigger size="sm" className="max-w-56" aria-label="Linked record">
						<SelectValue placeholder="Link a record" />
					</SelectTrigger>
					<SelectContent className="max-h-72">
						<SelectItem value={NONE}>No linked record</SelectItem>
						<SelectGroup>
							<SelectLabel>Companies</SelectLabel>
							{companies.map((company) => (
								<SelectItem key={company.id} value={`company:${company.id}`}>
									{company.name}
								</SelectItem>
							))}
						</SelectGroup>
						<SelectGroup>
							<SelectLabel>People</SelectLabel>
							{people.map((person) => (
								<SelectItem key={person.id} value={`person:${person.id}`}>
									{person.firstName} {person.lastName}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
				{note.record ? (
					<Link
						{...recordLink(note.record)}
						className="hidden items-center gap-1.5 rounded-full px-2 py-0.5 text-muted-foreground text-xs hover:bg-muted hover:text-foreground sm:inline-flex"
					>
						<RecordGlyph type={note.record.type} size="xs" /> Open {recordLabel(note.record)}
					</Link>
				) : null}
				<span
					className="ml-auto flex items-center gap-1 text-muted-foreground text-xs"
					aria-live="polite"
				>
					{saving ? (
						<>
							<Loader2 className="size-3 animate-spin" /> Saving…
						</>
					) : (
						<>
							<Check className="size-3" /> Saved
						</>
					)}
				</span>
				<Tabs value={mode} onValueChange={(value) => setMode(value as "write" | "preview")}>
					<TabsList>
						<TabsTrigger value="write" className="px-2.5">
							Write
						</TabsTrigger>
						<TabsTrigger value="preview" className="px-2.5">
							Preview
						</TabsTrigger>
					</TabsList>
				</Tabs>
				<Button
					variant="ghost"
					size="icon-sm"
					onClick={() => setConfirmOpen(true)}
					aria-label="Delete note"
				>
					<Trash2 />
				</Button>
			</div>

			<div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-5 py-5 md:px-8">
				<label htmlFor="note-title" className="sr-only">
					Title
				</label>
				<input
					id="note-title"
					value={title}
					onChange={(event) => {
						setTitle(event.target.value);
						setDirty(true);
					}}
					placeholder="Untitled"
					maxLength={80}
					className="w-full bg-transparent font-semibold text-2xl tracking-tight outline-none placeholder:text-muted-foreground/60"
				/>
				<p className="text-muted-foreground text-xs">
					{memberName(note.authorId)} · edited {formatAgo(note.updatedAt)}
				</p>
				{mode === "write" ? (
					<>
						<label htmlFor="note-body" className="sr-only">
							Note
						</label>
						<Textarea
							id="note-body"
							value={body}
							onChange={(event) => {
								setBody(event.target.value);
								setDirty(true);
							}}
							placeholder={"Write here. # for a heading, - for a bullet, **bold**."}
							className="min-h-[50dvh] flex-1 resize-none border-0 bg-transparent px-0 text-[15px] leading-relaxed shadow-none focus-visible:ring-0 dark:bg-transparent"
						/>
					</>
				) : (
					<div className="pt-2">
						<NotePreview body={body} />
					</div>
				)}
			</div>

			<ConfirmDialog
				open={confirmOpen}
				onOpenChange={setConfirmOpen}
				title="Delete this note?"
				description={`“${note.title || "Untitled"}” will be removed. This cannot be undone.`}
				onConfirm={() => {
					deleteNote.mutate(note.id);
					onDeleted();
				}}
			/>
		</div>
	);
}
