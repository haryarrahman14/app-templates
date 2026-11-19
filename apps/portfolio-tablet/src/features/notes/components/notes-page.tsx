import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/cn";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronLeft, Folder, Inbox, Pin, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Markdown } from "@/components/kit/markdown";
import { notebookQuery } from "@/features/notes/api/queries";
import type { Note } from "@/features/notes/schemas/note";
import { excerpt } from "@/features/notes/utils/excerpt";
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
		return data.notes
			.filter((n) => folder === ALL || n.folder === folder)
			.filter((n) => !q || `${n.title} ${n.body}`.toLowerCase().includes(q))
			.sort(
				(a, b) => Number(b.pinned) - Number(a.pinned) || (b.date ?? "").localeCompare(a.date ?? ""),
			);
	}, [data.notes, folder, query]);

	const selected = data.notes.find((n) => n.id === itemId) ?? visible[0] ?? data.notes[0];
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
					className={cn(
						"h-full min-w-0 flex-1 overflow-y-auto",
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
							className="mx-auto max-w-[44rem] px-6 pt-6 pb-20 @2xl/notes:px-10 @2xl/notes:pt-10"
						>
							<p className="mb-1 text-center text-[12.5px] text-muted-foreground">
								{[
									selected.date ? formatDate(selected.date) : null,
									data.folders.find((f) => f.id === selected.folder)?.name,
								]
									.filter(Boolean)
									.join(" · ")}
							</p>
							<Markdown className="mx-auto">{selected.body}</Markdown>
						</div>
					) : null}
				</article>
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
			<span className="flex items-center gap-1.5 font-semibold text-[14px]">
				{note.pinned ? (
					<Pin className="size-3 shrink-0 text-tint-text" aria-label="Pinned" />
				) : null}
				<span className="truncate">{note.title}</span>
			</span>
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
