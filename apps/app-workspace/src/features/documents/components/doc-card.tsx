import { Button } from "@repo/ui/components/button";
import { Skeleton } from "@repo/ui/components/skeleton";
import { cn } from "@repo/ui/lib/cn";
import { Link } from "@tanstack/react-router";
import { StarIcon } from "lucide-react";
import { useToggleStar } from "@/features/documents/api/mutations";
import { DocActionsMenu } from "@/features/documents/components/doc-actions-menu";
import { DocPreview } from "@/features/documents/components/doc-preview";
import type { Doc } from "@/features/documents/schemas/document";
import { docTitle } from "@/features/documents/utils/doc-helpers";
import { formatRelative } from "@/lib/format";

export function DocCard({ doc, folderName }: { doc: Doc; folderName?: string }) {
	const star = useToggleStar();
	return (
		<article className="group relative flex flex-col overflow-hidden rounded-2xl border bg-card shadow-soft transition-[box-shadow,transform] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] focus-within:ring-2 focus-within:ring-ring hover:-translate-y-0.5 hover:shadow-float motion-reduce:hover:translate-y-0">
			<DocPreview doc={doc} className="aspect-[4/3] border-b" />
			<div className="flex items-start gap-2 p-3.5">
				<div className="min-w-0 flex-1">
					<h3 className="truncate font-medium text-sm">
						<Link
							to="/docs/$docId"
							params={{ docId: doc.id }}
							className="outline-none after:absolute after:inset-0 after:content-['']"
						>
							{docTitle(doc)}
						</Link>
					</h3>
					<p className="truncate text-muted-foreground text-xs">
						Edited {formatRelative(doc.updatedAt)}
						{folderName ? ` · ${folderName}` : ""}
					</p>
				</div>
				<div className="relative z-10 flex items-center opacity-100 transition-opacity sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
					<Button
						variant="ghost"
						size="icon-sm"
						aria-label={doc.starred ? "Remove star" : "Star"}
						aria-pressed={doc.starred}
						onClick={() => star.mutate({ ids: [doc.id], starred: !doc.starred })}
						className={cn("text-muted-foreground", doc.starred && "text-primary")}
					>
						<StarIcon className={cn(doc.starred && "fill-current")} />
					</Button>
					<DocActionsMenu doc={doc} />
				</div>
				{doc.starred ? (
					<StarIcon
						aria-hidden
						className="absolute top-3 right-3 size-4 fill-primary text-primary drop-shadow-sm"
					/>
				) : null}
			</div>
		</article>
	);
}

export function DocCardSkeleton() {
	return (
		<div className="overflow-hidden rounded-2xl border bg-card shadow-soft">
			<div className="aspect-[4/3] space-y-2 border-b p-4">
				<Skeleton className="h-3 w-2/3" />
				<Skeleton className="h-2 w-full" />
				<Skeleton className="h-2 w-5/6" />
				<Skeleton className="h-2 w-3/4" />
			</div>
			<div className="space-y-1.5 p-3.5">
				<Skeleton className="h-3.5 w-1/2" />
				<Skeleton className="h-3 w-1/3" />
			</div>
		</div>
	);
}
