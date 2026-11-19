import { cn } from "@repo/ui/lib/cn";
import type { Block } from "@/features/documents/schemas/document";

/** Table of contents built live from the heading blocks. */
export function DocOutline({
	blocks,
	onJump,
	className,
}: {
	blocks: Block[];
	onJump: (id: string) => void;
	className?: string;
}) {
	const headings = blocks.filter(
		(b) => (b.type === "heading1" || b.type === "heading2") && b.text.trim(),
	);
	return (
		<nav aria-label="Outline" className={cn("space-y-2", className)}>
			<p className="px-2 font-medium text-muted-foreground text-xs uppercase tracking-wide">
				Outline
			</p>
			{headings.length === 0 ? (
				<p className="px-2 text-muted-foreground text-sm">Add a heading and it shows up here.</p>
			) : (
				<ul className="space-y-0.5">
					{headings.map((heading) => (
						<li key={heading.id}>
							<button
								type="button"
								onClick={() => onJump(heading.id)}
								className={cn(
									"w-full truncate rounded-lg px-2 py-1 text-left text-sm outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring",
									heading.type === "heading2" ? "pl-5 text-muted-foreground" : "font-medium",
								)}
							>
								{heading.text}
							</button>
						</li>
					))}
				</ul>
			)}
		</nav>
	);
}
