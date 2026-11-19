import { Button } from "@repo/ui/components/button";
import { Checkbox } from "@repo/ui/components/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { toast } from "@repo/ui/components/sonner";
import { cn } from "@repo/ui/lib/cn";
import {
	ArrowDownIcon,
	ArrowUpIcon,
	CopyIcon,
	GripVerticalIcon,
	ImageIcon,
	LightbulbIcon,
	PlusIcon,
	Trash2Icon,
	UploadIcon,
} from "lucide-react";
import { type DragEvent, type KeyboardEvent, useEffect, useRef, useState } from "react";
import type { Block, BlockType } from "@/features/documents/schemas/document";
import { AutoTextarea } from "@/features/editor/components/auto-textarea";
import { BLOCK_OPTIONS } from "@/features/editor/constants/block-options";

const TEXT_STYLES: Partial<Record<BlockType, string>> = {
	paragraph: "text-[16px] leading-7",
	heading1: "text-[1.6rem] font-semibold leading-tight tracking-tight",
	heading2: "text-lg font-semibold leading-snug tracking-tight",
	todo: "text-[16px] leading-7",
	bullet: "text-[16px] leading-7",
	quote: "text-[17px] italic leading-7 text-foreground/80",
	callout: "text-[15px] leading-6",
};

const PLACEHOLDERS: Partial<Record<BlockType, string>> = {
	paragraph: "Type “/” for blocks",
	heading1: "Heading",
	heading2: "Subheading",
	todo: "To-do",
	bullet: "List item",
	quote: "Quote",
	callout: "Write a note",
};

export type BlockRowActions = {
	register: (id: string, element: HTMLElement | null) => void;
	change: (block: Block, text: string) => void;
	toggle: (id: string, checked: boolean) => void;
	keyDown: (event: KeyboardEvent<HTMLElement>, block: Block) => void;
	insertAfter: (id: string, type: BlockType) => void;
	turnInto: (id: string, type: BlockType) => void;
	move: (id: string, delta: number) => void;
	duplicate: (id: string) => void;
	remove: (id: string) => void;
	dragStart: (id: string) => void;
	dragOver: (id: string, position: "before" | "after") => void;
	drop: () => void;
	dragEnd: () => void;
	blur: (id: string) => void;
};

export function BlockRow({
	block,
	index,
	total,
	actions,
	dropIndicator,
	isDragging,
	children,
}: {
	block: Block;
	index: number;
	total: number;
	actions: BlockRowActions;
	dropIndicator: "before" | "after" | null;
	isDragging: boolean;
	children?: React.ReactNode;
}) {
	const rowRef = useRef<HTMLDivElement>(null);
	const handleRef = useRef<HTMLButtonElement>(null);
	const [menuOpen, setMenuOpen] = useState(false);
	const spacing =
		block.type === "heading1" ? "mt-6" : block.type === "heading2" ? "mt-4" : "mt-0.5";

	const onDragOver = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		const rect = event.currentTarget.getBoundingClientRect();
		actions.dragOver(block.id, event.clientY < rect.top + rect.height / 2 ? "before" : "after");
	};

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: a drop target for the drag handle; keyboard users move blocks with ⌥⇧↑/↓.
		<div
			ref={rowRef}
			data-block-id={block.id}
			onDragOver={onDragOver}
			onDrop={(event) => {
				event.preventDefault();
				actions.drop();
			}}
			className={cn(
				"group/block relative -ml-6 flex items-start sm:-ml-16",
				spacing,
				isDragging && "opacity-40",
			)}
		>
			{dropIndicator ? (
				<div
					aria-hidden
					className={cn(
						"pointer-events-none absolute right-0 left-6 h-0.5 sm:left-16 rounded-full bg-tint",
						dropIndicator === "before" ? "-top-px" : "-bottom-px",
					)}
				/>
			) : null}

			{/* Gutter: add a block, drag handle with its menu. */}
			<div
				className={cn(
					"flex w-6 shrink-0 items-center justify-end gap-0.5 pr-1 sm:w-16 sm:pr-1.5 opacity-50 transition-opacity sm:opacity-0 sm:group-focus-within/block:opacity-100 sm:group-hover/block:opacity-100",
					block.type === "heading1" ? "pt-1" : block.type === "heading2" ? "pt-0.5" : "pt-0.5",
					menuOpen && "sm:opacity-100",
				)}
			>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							size="icon-xs"
							aria-label="Add a block below"
							className="hidden text-muted-foreground sm:inline-flex"
						>
							<PlusIcon />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="w-56">
						<DropdownMenuLabel>Add below</DropdownMenuLabel>
						{BLOCK_OPTIONS.map((option) => (
							<DropdownMenuItem
								key={option.type}
								onSelect={() => actions.insertAfter(block.id, option.type)}
							>
								<option.icon /> {option.label}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>

				<DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
					<DropdownMenuTrigger asChild>
						<span aria-hidden className="pointer-events-none absolute left-1 h-6 w-0 sm:left-9" />
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="start"
						className="w-52"
						onCloseAutoFocus={(event) => {
							event.preventDefault();
							handleRef.current?.focus();
						}}
					>
						<DropdownMenuSub>
							<DropdownMenuSubTrigger>Turn into</DropdownMenuSubTrigger>
							<DropdownMenuSubContent className="w-48">
								{BLOCK_OPTIONS.map((option) => (
									<DropdownMenuItem
										key={option.type}
										onSelect={() => actions.turnInto(block.id, option.type)}
									>
										<option.icon /> {option.label}
									</DropdownMenuItem>
								))}
							</DropdownMenuSubContent>
						</DropdownMenuSub>
						<DropdownMenuSeparator />
						<DropdownMenuItem disabled={index === 0} onSelect={() => actions.move(block.id, -1)}>
							<ArrowUpIcon /> Move up <DropdownMenuShortcut>⌥⇧↑</DropdownMenuShortcut>
						</DropdownMenuItem>
						<DropdownMenuItem
							disabled={index === total - 1}
							onSelect={() => actions.move(block.id, 1)}
						>
							<ArrowDownIcon /> Move down <DropdownMenuShortcut>⌥⇧↓</DropdownMenuShortcut>
						</DropdownMenuItem>
						<DropdownMenuItem onSelect={() => actions.duplicate(block.id)}>
							<CopyIcon /> Duplicate
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem variant="destructive" onSelect={() => actions.remove(block.id)}>
							<Trash2Icon /> Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
				<button
					ref={handleRef}
					type="button"
					draggable
					aria-label="Drag to move, or click for block options"
					aria-haspopup="menu"
					aria-expanded={menuOpen}
					onClick={() => setMenuOpen(true)}
					onKeyDown={(event) => {
						if (
							event.altKey &&
							event.shiftKey &&
							(event.key === "ArrowUp" || event.key === "ArrowDown")
						) {
							event.preventDefault();
							actions.move(block.id, event.key === "ArrowUp" ? -1 : 1);
						}
					}}
					onDragStart={(event) => {
						event.dataTransfer.effectAllowed = "move";
						event.dataTransfer.setData("text/plain", block.id);
						if (rowRef.current) event.dataTransfer.setDragImage(rowRef.current, 24, 12);
						actions.dragStart(block.id);
					}}
					onDragEnd={actions.dragEnd}
					className="flex h-6 w-5 cursor-grab items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing"
				>
					<GripVerticalIcon className="size-4" />
				</button>
			</div>

			<div className="relative min-w-0 flex-1">
				<BlockContent block={block} actions={actions} />
				{children}
			</div>
		</div>
	);
}

function BlockContent({ block, actions }: { block: Block; actions: BlockRowActions }) {
	const textarea = (className?: string) => (
		<AutoTextarea
			elementRef={(element) => actions.register(block.id, element)}
			value={block.text}
			aria-label={`${BLOCK_OPTIONS.find((o) => o.type === block.type)?.label ?? "Text"} block`}
			placeholder={PLACEHOLDERS[block.type]}
			onChange={(event) => actions.change(block, event.target.value)}
			onKeyDown={(event) => actions.keyDown(event, block)}
			onBlur={() => actions.blur(block.id)}
			className={cn(
				TEXT_STYLES[block.type],
				block.type === "paragraph" &&
					"placeholder:text-transparent focus:placeholder:text-muted-foreground/50",
				className,
			)}
		/>
	);

	switch (block.type) {
		case "todo":
			return (
				<div className="flex items-start gap-2.5">
					<Checkbox
						aria-label={block.checked ? "Mark as not done" : "Mark as done"}
						checked={block.checked ?? false}
						onCheckedChange={(value) => actions.toggle(block.id, value === true)}
						className="mt-1.5"
					/>
					{textarea(cn(block.checked && "text-muted-foreground line-through"))}
				</div>
			);
		case "bullet":
			return (
				<div className="flex items-start gap-2.5">
					<span
						aria-hidden
						className="mt-[0.6rem] size-1.5 shrink-0 rounded-full bg-foreground/70"
					/>
					{textarea()}
				</div>
			);
		case "quote":
			return <div className="border-primary/60 border-l-[3px] pl-4">{textarea()}</div>;
		case "callout":
			return (
				<div className="flex items-start gap-3 rounded-xl bg-muted px-4 py-3">
					<LightbulbIcon aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
					{textarea()}
				</div>
			);
		case "divider":
			return (
				<button
					ref={(element) => actions.register(block.id, element)}
					type="button"
					aria-label="Divider. Backspace removes it, Enter adds text below."
					onKeyDown={(event) => actions.keyDown(event, block)}
					className="block w-full rounded-md py-3 outline-none focus-visible:ring-2 focus-visible:ring-ring"
				>
					<hr className="border-border" />
				</button>
			);
		case "image":
			return <ImageBlock block={block} actions={actions} />;
		default:
			return textarea();
	}
}

/** An image placeholder. The preview stays in memory; wire `onFile` to your storage to keep it. */
function ImageBlock({ block, actions }: { block: Block; actions: BlockRowActions }) {
	const [preview, setPreview] = useState<string | null>(null);
	const fileRef = useRef<HTMLInputElement>(null);

	useEffect(() => () => (preview ? URL.revokeObjectURL(preview) : undefined), [preview]);

	return (
		<figure className="space-y-2 py-1">
			{preview ? (
				<img
					src={preview}
					alt={block.text || "Uploaded image"}
					className="max-h-96 w-full rounded-xl object-cover"
				/>
			) : (
				<div className="flex aspect-[16/7] w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-muted/50 text-muted-foreground">
					<ImageIcon className="size-6" />
					<Button
						ref={(element) => actions.register(block.id, element)}
						variant="outline"
						size="sm"
						onKeyDown={(event) => {
							if (event.key === "Backspace" || event.key === "Delete")
								actions.keyDown(event, block);
						}}
						onClick={() => fileRef.current?.click()}
					>
						<UploadIcon /> Choose an image
					</Button>
				</div>
			)}
			<input
				ref={fileRef}
				type="file"
				accept="image/*"
				className="sr-only"
				tabIndex={-1}
				aria-hidden
				onChange={(event) => {
					const file = event.target.files?.[0];
					if (!file) return;
					setPreview(URL.createObjectURL(file));
					toast("Image shown as a preview", {
						description: "Connect file storage to keep images with the document.",
					});
				}}
			/>
			<figcaption>
				<AutoTextarea
					value={block.text}
					aria-label="Image caption"
					placeholder="Add a caption"
					onChange={(event) => actions.change(block, event.target.value)}
					className="text-center text-muted-foreground text-sm"
				/>
			</figcaption>
		</figure>
	);
}
