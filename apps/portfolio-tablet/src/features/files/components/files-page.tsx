import { Button } from "@repo/ui/components/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@repo/ui/components/dialog";
import { cn } from "@repo/ui/lib/cn";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Download, FileText } from "lucide-react";
import { type ReactNode, useState } from "react";
import { Markdown } from "@/components/kit/markdown";
import { fileSystemQuery } from "@/features/files/api/queries";
import type { FileFolder, FileItem } from "@/features/files/schemas/file";
import type { AppViewProps } from "@/lib/apps";
import { formatDate } from "@/lib/format";
import { swatchVar } from "@/lib/palette";

/** A Finder-like grid: folders at the root, files inside. Opening a file shows a quick-look preview. */
export function FilesPage({ itemId, onItemChange }: AppViewProps) {
	const { data } = useSuspenseQuery(fileSystemQuery);
	const folder = data.folders.find((f) => f.id === itemId);
	const files = folder ? data.files.filter((f) => f.folder === folder.id) : [];
	const recent = data.files
		.filter((f) => f.modified)
		.sort((a, b) => (b.modified ?? "").localeCompare(a.modified ?? ""))
		.slice(0, 4);
	const [preview, setPreview] = useState<{ list: FileItem[]; index: number } | null>(null);

	return (
		<div className="h-full overflow-y-auto">
			<div className="sticky top-0 z-10 flex items-center gap-2 border-border/50 border-b bg-background/80 px-4 py-2.5 backdrop-blur-xl">
				<Button
					variant="ghost"
					size="icon-sm"
					aria-label="Back to all folders"
					disabled={!folder}
					onClick={() => onItemChange(undefined)}
				>
					<ChevronLeft />
				</Button>
				<nav aria-label="Path" className="flex min-w-0 items-center gap-1 text-[14px]">
					<button
						type="button"
						onClick={() => onItemChange(undefined)}
						className={cn(
							"rounded-md px-1.5 py-0.5 hover:bg-shade/5",
							folder ? "text-muted-foreground" : "font-semibold",
						)}
					>
						Files
					</button>
					{folder ? (
						<>
							<ChevronRight className="size-3.5 text-muted-foreground" />
							<span className="truncate px-1.5 font-semibold">{folder.name}</span>
						</>
					) : null}
				</nav>
				<span className="ml-auto text-[12.5px] text-muted-foreground">
					{folder ? `${files.length} items` : `${data.folders.length} folders`}
				</span>
			</div>

			<div className="px-4 py-6 @2xl/pane:px-8">
				{folder ? (
					<Grid>
						{files.map((file, index) => (
							<FileTile
								key={file.id}
								file={file}
								onOpen={() => setPreview({ list: files, index })}
							/>
						))}
					</Grid>
				) : (
					<>
						<Grid>
							{data.folders.map((f) => (
								<FolderTile
									key={f.id}
									folder={f}
									count={data.files.filter((file) => file.folder === f.id).length}
									onOpen={() => onItemChange(f.id)}
								/>
							))}
						</Grid>
						<h3 className="mt-10 mb-4 font-medium text-[12px] text-muted-foreground uppercase tracking-[0.08em]">
							Recent
						</h3>
						<Grid>
							{recent.map((file, index) => (
								<FileTile
									key={file.id}
									file={file}
									onOpen={() => setPreview({ list: recent, index })}
								/>
							))}
						</Grid>
					</>
				)}
			</div>

			<QuickLook
				state={preview}
				onChange={(index) => setPreview((p) => (p ? { ...p, index } : p))}
				onClose={() => setPreview(null)}
			/>
		</div>
	);
}

function Grid({ children }: { children: ReactNode }) {
	return (
		<div className="grid grid-cols-[repeat(auto-fill,minmax(7.5rem,1fr))] gap-x-3 gap-y-6">
			{children}
		</div>
	);
}

const tileClass =
	"group flex flex-col items-center gap-2 rounded-2xl p-2 text-center outline-none hover:bg-shade/4 focus-visible:ring-2 focus-visible:ring-ring";

function FolderTile({
	folder,
	count,
	onOpen,
}: {
	folder: FileFolder;
	count: number;
	onOpen: () => void;
}) {
	return (
		<button type="button" className={tileClass} onClick={onOpen} title={folder.description}>
			<FolderGlyph />
			<span className="font-medium text-[13.5px]">{folder.name}</span>
			<span className="-mt-1.5 text-[12px] text-muted-foreground">{count} items</span>
		</button>
	);
}

/** Our own folder drawing: two rounded shapes in the category yellow, like a manila folder. */
function FolderGlyph() {
	return (
		<svg
			viewBox="0 0 80 64"
			className="h-16 w-20 drop-shadow-[0_2px_3px_#0000001a] transition-transform group-hover:-translate-y-0.5"
			aria-hidden
		>
			<path d="M4 10a6 6 0 0 1 6-6h18l7 7h35a6 6 0 0 1 6 6v3H4z" fill="var(--cat-yellow)" />
			<path d="M4 10a6 6 0 0 1 6-6h18l7 7h35a6 6 0 0 1 6 6v3H4z" fill="#000000" opacity="0.12" />
			<rect x="4" y="16" width="72" height="44" rx="7" fill="var(--cat-yellow)" />
			<rect x="4" y="16" width="72" height="10" rx="5" fill="#ffffff" opacity="0.25" />
		</svg>
	);
}

const KIND = {
	doc: { icon: FileText, label: "Document", swatch: "blue" },
	pdf: { icon: FileText, label: "PDF", swatch: "red" },
} as const;

function FileTile({ file, onOpen }: { file: FileItem; onOpen: () => void }) {
	return (
		<button type="button" className={tileClass} onClick={onOpen}>
			<FileThumb file={file} />
			<span className="line-clamp-2 break-words font-medium text-[13px] leading-snug">
				{file.name}
			</span>
			<span className="-mt-1.5 text-[12px] text-muted-foreground">
				{file.modified ? formatDate(file.modified) : file.size}
			</span>
		</button>
	);
}

function FileThumb({ file }: { file: FileItem }) {
	const kind = KIND[file.kind];
	return (
		<span className="relative flex h-16 w-13 flex-col gap-1 rounded-md border border-border bg-card px-2 pt-3 shadow-soft transition-transform group-hover:-translate-y-0.5">
			{[80, 100, 60, 90].map((w) => (
				<span key={w} className="h-0.5 rounded-full bg-shade/12" style={{ width: `${w}%` }} />
			))}
			<span
				className="absolute right-1 bottom-1 left-1 rounded-[4px] py-0.5 text-center font-bold text-[8px] uppercase tracking-wide"
				style={{
					backgroundColor: swatchVar(kind.swatch),
					color: swatchVar(kind.swatch, "ink"),
				}}
			>
				{file.kind}
			</span>
		</span>
	);
}

function QuickLook({
	state,
	onChange,
	onClose,
}: {
	state: { list: FileItem[]; index: number } | null;
	onChange: (index: number) => void;
	onClose: () => void;
}) {
	const file = state ? state.list[state.index] : undefined;
	const total = state?.list.length ?? 0;
	const go = (delta: number) => {
		if (!state) return;
		onChange((state.index + delta + total) % total);
	};

	return (
		<Dialog open={file !== undefined} onOpenChange={(open) => !open && onClose()}>
			<DialogContent
				className="gap-0 overflow-hidden rounded-[22px] p-0 sm:max-w-2xl"
				onKeyDown={(e) => {
					if (e.key === "ArrowRight") go(1);
					if (e.key === "ArrowLeft") go(-1);
				}}
			>
				{file ? (
					<>
						<div className="flex items-center gap-3 border-border/60 border-b px-4 py-3 pr-12">
							<div className="min-w-0">
								<DialogTitle className="truncate text-[15px]">{file.name}</DialogTitle>
								<DialogDescription className="text-[12.5px]">
									{[KIND[file.kind].label, file.size, file.modified && formatDate(file.modified)]
										.filter(Boolean)
										.join(" · ")}
								</DialogDescription>
							</div>
						</div>
						<div className="max-h-[60dvh] overflow-y-auto bg-background/60">
							<Preview file={file} />
						</div>
						{total > 1 ? (
							<div className="flex items-center justify-between border-border/60 border-t px-3 py-2">
								<Button variant="ghost" size="sm" onClick={() => go(-1)}>
									<ChevronLeft />
									Previous
								</Button>
								<span className="text-[12.5px] text-muted-foreground tabular-nums">
									{(state?.index ?? 0) + 1} of {total}
								</span>
								<Button variant="ghost" size="sm" onClick={() => go(1)}>
									Next
									<ChevronRight />
								</Button>
							</div>
						) : null}
					</>
				) : null}
			</DialogContent>
		</Dialog>
	);
}

function Preview({ file }: { file: FileItem }) {
	const preview = file.preview;
	if (preview.type === "pdf") {
		return (
			<div className="flex flex-col">
				<iframe
					src={preview.href}
					title={preview.fileName}
					className="h-[50dvh] w-full border-0 bg-card"
				/>
				<div className="flex justify-end border-border/60 border-t px-4 py-3">
					<Button asChild size="sm">
						<a href={preview.href} download={preview.fileName}>
							<Download />
							Download
						</a>
					</Button>
				</div>
			</div>
		);
	}
	return (
		<div className="mx-auto bg-card px-8 py-8">
			<Markdown>{preview.body}</Markdown>
		</div>
	);
}
