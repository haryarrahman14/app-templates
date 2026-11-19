import { cn } from "@repo/ui/lib/cn";
import type { BlockType } from "@/features/documents/schemas/document";
import { BLOCK_OPTIONS } from "@/features/editor/constants/block-options";

export const slashOptions = (query: string) => {
	const q = query.trim().toLowerCase();
	return q
		? BLOCK_OPTIONS.filter((o) => o.label.toLowerCase().includes(q) || o.keywords.includes(q))
		: BLOCK_OPTIONS;
};

/** The "/" block menu. Keyboard is handled by the editor; this renders the list and takes clicks. */
export function SlashMenu({
	query,
	activeIndex,
	onHover,
	onPick,
}: {
	query: string;
	activeIndex: number;
	onHover: (index: number) => void;
	onPick: (type: BlockType) => void;
}) {
	const options = slashOptions(query);
	return (
		<div
			role="listbox"
			aria-label="Block types"
			className="absolute top-full left-0 z-30 mt-1 w-64 overflow-hidden rounded-xl border bg-popover p-1 text-popover-foreground shadow-float"
		>
			{options.length === 0 ? (
				<p className="px-3 py-2 text-muted-foreground text-sm">No block matches “{query}”</p>
			) : (
				options.map((option, index) => (
					<div
						key={option.type}
						role="option"
						tabIndex={-1}
						aria-selected={index === activeIndex}
						onMouseEnter={() => onHover(index)}
						onMouseDown={(event) => {
							event.preventDefault();
							onPick(option.type);
						}}
						onKeyDown={() => {}}
						className={cn(
							"flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5",
							index === activeIndex && "bg-accent",
						)}
					>
						<span className="flex size-8 items-center justify-center rounded-lg border bg-background">
							<option.icon className="size-4" />
						</span>
						<span className="min-w-0">
							<span className="block font-medium text-sm">{option.label}</span>
							<span className="block text-muted-foreground text-xs">{option.hint}</span>
						</span>
					</div>
				))
			)}
		</div>
	);
}
