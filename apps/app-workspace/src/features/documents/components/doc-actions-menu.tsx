import { Button } from "@repo/ui/components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { toast } from "@repo/ui/components/sonner";
import { cn } from "@repo/ui/lib/cn";
import { useNavigate } from "@tanstack/react-router";
import {
	CopyIcon,
	ExternalLinkIcon,
	LinkIcon,
	MoreHorizontalIcon,
	StarIcon,
	Trash2Icon,
} from "lucide-react";
import { useDuplicateDoc, useToggleStar, useTrashDocs } from "@/features/documents/api/mutations";
import type { Doc } from "@/features/documents/schemas/document";
import { docTitle } from "@/features/documents/utils/doc-helpers";

export function DocActionsMenu({ doc, className }: { doc: Doc; className?: string }) {
	const navigate = useNavigate();
	const star = useToggleStar();
	const duplicate = useDuplicateDoc();
	const trash = useTrashDocs();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon-sm"
					aria-label={`Actions for ${docTitle(doc)}`}
					className={cn("text-muted-foreground", className)}
				>
					<MoreHorizontalIcon />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-48">
				<DropdownMenuItem
					onSelect={() => navigate({ to: "/docs/$docId", params: { docId: doc.id } })}
				>
					<ExternalLinkIcon /> Open
				</DropdownMenuItem>
				<DropdownMenuItem onSelect={() => star.mutate({ ids: [doc.id], starred: !doc.starred })}>
					<StarIcon /> {doc.starred ? "Remove star" : "Star"}
				</DropdownMenuItem>
				<DropdownMenuItem onSelect={() => duplicate.mutate(doc.id)}>
					<CopyIcon /> Duplicate
				</DropdownMenuItem>
				<DropdownMenuItem
					onSelect={() => {
						void navigator.clipboard
							?.writeText(`${window.location.origin}/docs/${doc.id}`)
							.then(() => toast.success("Link copied"));
					}}
				>
					<LinkIcon /> Copy link
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem variant="destructive" onSelect={() => trash.mutate([doc.id])}>
					<Trash2Icon /> Move to trash
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
