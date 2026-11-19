import { cn } from "@repo/ui/lib/cn";
import { DocCover } from "@/components/kit/doc-cover";
import type { Doc } from "@/features/documents/schemas/document";
import { docTitle } from "@/features/documents/utils/doc-helpers";

const FONT = { sans: "font-sans", serif: "font-serif", mono: "font-mono" } as const;

/** A miniature, non-interactive rendering of the first blocks of a document. */
export function DocPreview({ doc, className }: { doc: Doc; className?: string }) {
	return (
		<div
			aria-hidden
			className={cn(
				"doc-preview relative overflow-hidden bg-card text-foreground/80",
				FONT[doc.font],
				className,
			)}
		>
			{doc.cover.enabled ? <DocCover tint={doc.cover.tint} className="h-8" /> : null}
			<div className="space-y-[3px] px-4 pt-3">
				<p className="mb-1 font-semibold text-[9px] text-foreground leading-tight">
					{doc.emoji} {docTitle(doc)}
				</p>
				{doc.blocks.slice(0, 12).map((block) => {
					switch (block.type) {
						case "heading1":
							return (
								<p key={block.id} className="pt-0.5 font-semibold text-[7.5px] text-foreground">
									{block.text}
								</p>
							);
						case "heading2":
							return (
								<p key={block.id} className="font-semibold text-foreground">
									{block.text}
								</p>
							);
						case "todo":
							return (
								<p key={block.id} className="flex items-center gap-1">
									<span
										className={cn(
											"inline-block size-[6px] shrink-0 rounded-[2px] border border-foreground/40",
											block.checked && "border-tint bg-tint",
										)}
									/>
									<span className={cn(block.checked && "line-through opacity-60")}>
										{block.text}
									</span>
								</p>
							);
						case "bullet":
							return (
								<p key={block.id} className="pl-1">
									• {block.text}
								</p>
							);
						case "quote":
							return (
								<p key={block.id} className="border-primary/60 border-l-2 pl-1.5 italic">
									{block.text}
								</p>
							);
						case "callout":
							return (
								<p key={block.id} className="rounded-[3px] bg-muted px-1.5 py-0.5">
									{block.text}
								</p>
							);
						case "divider":
							return <hr key={block.id} className="my-1 border-border" />;
						case "image":
							return <div key={block.id} className="h-6 rounded-[3px] bg-muted" />;
						default:
							return <p key={block.id}>{block.text}</p>;
					}
				})}
			</div>
			<div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-card to-transparent" />
		</div>
	);
}
