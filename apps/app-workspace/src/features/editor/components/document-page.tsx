import { Button } from "@repo/ui/components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/components/popover";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@repo/ui/components/sheet";
import { Skeleton } from "@repo/ui/components/skeleton";
import { toast } from "@repo/ui/components/sonner";
import { Spinner } from "@repo/ui/components/spinner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@repo/ui/components/tooltip";
import { cn } from "@repo/ui/lib/cn";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import {
	AlertCircleIcon,
	CheckIcon,
	CopyIcon,
	DownloadIcon,
	FileQuestionIcon,
	LinkIcon,
	ListTreeIcon,
	MoreHorizontalIcon,
	PanelRightIcon,
	RotateCcwIcon,
	Share2Icon,
	StarIcon,
	Trash2Icon,
} from "lucide-react";
import { useRef, useState } from "react";
import { DocCover } from "@/components/kit/doc-cover";
import { StateScreen } from "@/components/kit/state-screen";
import { useShell } from "@/components/layout/shell-context";
import {
	useDuplicateDoc,
	useRestoreDocs,
	useToggleStar,
	useTrashDocs,
	useUpdateDoc,
} from "@/features/documents/api/mutations";
import { docQuery } from "@/features/documents/api/queries";
import type { Block, Doc, DocPatch } from "@/features/documents/schemas/document";
import { AutoTextarea } from "@/features/editor/components/auto-textarea";
import { BlockEditor, type BlockEditorHandle } from "@/features/editor/components/block-editor";
import { DocInspector, type InspectorTab } from "@/features/editor/components/doc-inspector";
import { DocOutline } from "@/features/editor/components/doc-outline";
import { EMOJI_CHOICES } from "@/features/editor/constants/block-options";
import { type SaveStatus, useAutosave } from "@/features/editor/hooks/use-autosave";
import { countWords } from "@/features/editor/utils/blocks";
import { downloadMarkdown } from "@/features/editor/utils/export-markdown";
import { formatRelative, pluralize } from "@/lib/format";
import { APP_NAME } from "@/lib/site";
import { useMediaQuery } from "@/lib/use-media-query";

const WIDTHS = { narrow: "max-w-xl", normal: "max-w-2xl", wide: "max-w-4xl" } as const;
const FONTS = { sans: "font-sans", serif: "font-serif", mono: "font-mono" } as const;

export function DocumentPage({ docId }: { docId: string }) {
	const doc = useQuery(docQuery(docId));

	if (doc.isPending) return <DocumentSkeleton />;
	if (doc.isError) {
		return (
			<div className="p-6 sm:p-10">
				<StateScreen
					icon={AlertCircleIcon}
					title="This document could not load"
					description="Check your connection and try again."
				>
					<Button onClick={() => doc.refetch()}>Try again</Button>
				</StateScreen>
			</div>
		);
	}
	if (!doc.data) {
		return (
			<div className="p-6 sm:p-10">
				<StateScreen
					icon={FileQuestionIcon}
					title="Document not found"
					description="It may have been deleted, or the link is wrong."
				>
					<Button asChild>
						<Link to="/">Back to all documents</Link>
					</Button>
				</StateScreen>
			</div>
		);
	}
	return <DocumentWorkspace key={doc.data.id} doc={doc.data} />;
}

function DocumentWorkspace({ doc }: { doc: Doc }) {
	const navigate = useNavigate();
	const shell = useShell();
	const isLarge = useMediaQuery("(min-width: 1024px)");
	const isWide = useMediaQuery("(min-width: 1280px)");
	const [title, setTitle] = useState(doc.title);
	const [blocks, setBlocks] = useState<Block[]>(doc.blocks);
	const [inspectorOpen, setInspectorOpen] = useState(true);
	const [outlineOpen, setOutlineOpen] = useState(true);
	const [sheet, setSheet] = useState<"inspector" | "outline" | null>(null);
	const [tab, setTab] = useState<InspectorTab>("style");
	const editorRef = useRef<BlockEditorHandle>(null);
	const titleRef = useRef<HTMLTextAreaElement | null>(null);

	const status = useAutosave(doc.id, title, blocks);
	const update = useUpdateDoc();
	const star = useToggleStar();
	const trash = useTrashDocs();
	const restore = useRestoreDocs();
	const duplicate = useDuplicateDoc();
	const words = countWords(title, blocks);
	const patch = (change: DocPatch) => update.mutate({ id: doc.id, patch: change });

	const jumpTo = (id: string) => {
		const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
		document
			.querySelector(`[data-block-id="${id}"]`)
			?.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
		editorRef.current?.focusBlock(id);
		setSheet(null);
	};

	const toggleInspector = () => {
		if (isLarge) setInspectorOpen((open) => !open);
		else setSheet("inspector");
	};
	const toggleOutline = () => {
		if (isWide) setOutlineOpen((open) => !open);
		else setSheet("outline");
	};

	const inspector = (
		<DocInspector doc={doc} onPatch={patch} tab={tab} onTabChange={setTab} wordCount={words} />
	);

	return (
		<div className="flex min-h-[calc(100dvh-3.5rem)]">
			<title>{`${title.trim() || "Untitled"} · ${APP_NAME}`}</title>
			{isWide && outlineOpen ? (
				<aside className="sticky top-14 h-[calc(100dvh-3.5rem)] w-60 shrink-0 overflow-y-auto border-r px-3 py-6">
					<DocOutline blocks={blocks} onJump={jumpTo} />
				</aside>
			) : null}

			<div className="min-w-0 flex-1">
				<div className="glass sticky top-14 z-20 flex h-11 items-center gap-1 border-x-0 border-t-0 px-3 sm:px-5">
					<SaveIndicator status={status} />
					<span className="hidden text-muted-foreground text-xs sm:inline">
						· {pluralize(words, "word")}
					</span>
					<div className="ml-auto flex items-center gap-0.5">
						<ToolbarButton label="Outline" onClick={toggleOutline} pressed={isWide && outlineOpen}>
							<ListTreeIcon />
						</ToolbarButton>
						<ToolbarButton
							label={doc.starred ? "Remove star" : "Star"}
							onClick={() => star.mutate({ ids: [doc.id], starred: !doc.starred })}
							pressed={doc.starred}
						>
							<StarIcon className={cn(doc.starred && "fill-primary text-primary")} />
						</ToolbarButton>
						<ToolbarButton
							label="Share"
							onClick={() => shell.openShare({ id: doc.id, title: title || "Untitled" })}
						>
							<Share2Icon />
						</ToolbarButton>
						<ToolbarButton
							label="Inspector"
							onClick={toggleInspector}
							pressed={isLarge && inspectorOpen}
						>
							<PanelRightIcon />
						</ToolbarButton>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="icon-sm" aria-label="More actions">
									<MoreHorizontalIcon />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-52">
								<DropdownMenuItem
									onSelect={() =>
										duplicate.mutate(doc.id, {
											onSuccess: (copy) =>
												navigate({ to: "/docs/$docId", params: { docId: copy.id } }),
										})
									}
								>
									<CopyIcon /> Duplicate
								</DropdownMenuItem>
								<DropdownMenuItem
									onSelect={() =>
										void navigator.clipboard
											?.writeText(window.location.href)
											.then(() => toast.success("Link copied"))
									}
								>
									<LinkIcon /> Copy link
								</DropdownMenuItem>
								<DropdownMenuItem onSelect={() => downloadMarkdown(title, blocks)}>
									<DownloadIcon /> Export as Markdown
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									variant="destructive"
									onSelect={() => {
										trash.mutate([doc.id]);
										navigate({ to: "/" });
									}}
								>
									<Trash2Icon /> Move to trash
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>

				{doc.trashedAt ? (
					<div className="flex flex-wrap items-center justify-center gap-3 bg-destructive/10 px-4 py-2 text-sm">
						This document is in the trash.
						<Button size="xs" variant="outline" onClick={() => restore.mutate([doc.id])}>
							<RotateCcwIcon /> Restore
						</Button>
					</div>
				) : null}

				<article
					className={cn(
						"mx-auto w-full px-6 pt-8 sm:px-12 sm:pt-12",
						WIDTHS[doc.width],
						FONTS[doc.font],
					)}
				>
					{doc.cover.enabled ? (
						<DocCover tint={doc.cover.tint} className="mb-8 h-36 rounded-3xl shadow-soft sm:h-48" />
					) : null}
					<Popover>
						<PopoverTrigger asChild>
							<button
								type="button"
								aria-label="Change icon"
								className="mb-2 rounded-xl p-1 text-4xl leading-none outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
							>
								{doc.emoji}
							</button>
						</PopoverTrigger>
						<PopoverContent align="start" className="w-64">
							<div className="grid grid-cols-8 gap-1">
								{EMOJI_CHOICES.map((emoji) => (
									<button
										key={emoji}
										type="button"
										aria-label={`Use ${emoji}`}
										onClick={() => patch({ emoji })}
										className="rounded-lg p-1 text-xl outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
									>
										{emoji}
									</button>
								))}
							</div>
						</PopoverContent>
					</Popover>
					<AutoTextarea
						elementRef={(element) => {
							titleRef.current = element;
						}}
						value={title}
						aria-label="Title"
						placeholder="Untitled"
						onChange={(event) => setTitle(event.target.value.replace(/\n/g, ""))}
						onKeyDown={(event) => {
							const target = event.currentTarget;
							if (
								event.key === "Enter" ||
								(event.key === "ArrowDown" && target.selectionStart === target.value.length)
							) {
								event.preventDefault();
								editorRef.current?.focusFirst();
							}
						}}
						className="mb-4 font-bold text-[2.25rem] leading-tight tracking-tight placeholder:text-muted-foreground/40"
					/>
					<p className="mb-6 text-muted-foreground text-xs">
						Edited {formatRelative(doc.updatedAt)}
					</p>
					<BlockEditor
						ref={editorRef}
						blocks={blocks}
						setBlocks={setBlocks}
						onExitTop={() => {
							const element = titleRef.current;
							if (!element) return;
							element.focus();
							element.setSelectionRange(element.value.length, element.value.length);
						}}
					/>
				</article>
			</div>

			{isLarge && inspectorOpen ? (
				<aside
					aria-label="Inspector"
					className="sticky top-14 h-[calc(100dvh-3.5rem)] w-80 shrink-0 overflow-y-auto border-l bg-sidebar/60 p-5 backdrop-blur-xl"
				>
					{inspector}
				</aside>
			) : null}

			<Sheet open={sheet !== null} onOpenChange={(open) => !open && setSheet(null)}>
				<SheetContent
					side={sheet === "outline" ? "left" : "right"}
					className="w-[88%] overflow-y-auto p-5 sm:max-w-sm"
				>
					<SheetHeader className="p-0">
						<SheetTitle>{sheet === "outline" ? "Outline" : "Inspector"}</SheetTitle>
						<SheetDescription className="sr-only">
							{sheet === "outline" ? "Headings in this document" : "Style, info and comments"}
						</SheetDescription>
					</SheetHeader>
					{sheet === "outline" ? <DocOutline blocks={blocks} onJump={jumpTo} /> : inspector}
				</SheetContent>
			</Sheet>
		</div>
	);
}

function ToolbarButton({
	label,
	onClick,
	pressed,
	children,
}: {
	label: string;
	onClick: () => void;
	pressed?: boolean;
	children: React.ReactNode;
}) {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					variant="ghost"
					size="icon-sm"
					aria-label={label}
					aria-pressed={pressed}
					onClick={onClick}
					className={cn("text-muted-foreground", pressed && "bg-accent text-foreground")}
				>
					{children}
				</Button>
			</TooltipTrigger>
			<TooltipContent>{label}</TooltipContent>
		</Tooltip>
	);
}

function SaveIndicator({ status }: { status: SaveStatus }) {
	const content = {
		saved: (
			<>
				<CheckIcon className="size-3.5 text-primary" /> Saved
			</>
		),
		editing: <>Edited</>,
		saving: (
			<>
				<Spinner className="size-3.5" /> Saving…
			</>
		),
		error: (
			<>
				<AlertCircleIcon className="size-3.5 text-destructive" /> Not saved
			</>
		),
	}[status];
	return (
		<span role="status" className="flex items-center gap-1.5 text-muted-foreground text-xs">
			{content}
		</span>
	);
}

function DocumentSkeleton() {
	return (
		<div className="mx-auto w-full max-w-2xl space-y-4 px-6 pt-20 sm:px-12">
			<Skeleton className="size-10 rounded-xl" />
			<Skeleton className="h-10 w-3/4" />
			<Skeleton className="h-3 w-24" />
			<div className="space-y-3 pt-6">
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-11/12" />
				<Skeleton className="h-4 w-4/5" />
				<Skeleton className="mt-6 h-6 w-1/2" />
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-2/3" />
			</div>
		</div>
	);
}
