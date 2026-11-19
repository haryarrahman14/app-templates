import { Button } from "@repo/ui/components/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

export function TablePagination({
	pageIndex,
	pageCount,
	total,
	pageSize,
	onPrevious,
	onNext,
	canPrevious,
	canNext,
	noun = "rows",
}: {
	pageIndex: number;
	pageCount: number;
	total: number;
	pageSize: number;
	onPrevious: () => void;
	onNext: () => void;
	canPrevious: boolean;
	canNext: boolean;
	noun?: string;
}) {
	const from = total === 0 ? 0 : pageIndex * pageSize + 1;
	const to = Math.min(total, (pageIndex + 1) * pageSize);
	return (
		<div className="flex items-center justify-between gap-4 border-t px-4 py-3 text-muted-foreground text-sm">
			<p aria-live="polite">
				{from}–{to} of {total} {noun}
			</p>
			<div className="flex items-center gap-2">
				<span className="hidden sm:inline">
					Page {Math.min(pageIndex + 1, Math.max(pageCount, 1))} of {Math.max(pageCount, 1)}
				</span>
				<Button
					variant="outline"
					size="icon-sm"
					onClick={onPrevious}
					disabled={!canPrevious}
					aria-label="Previous page"
				>
					<ChevronLeftIcon />
				</Button>
				<Button
					variant="outline"
					size="icon-sm"
					onClick={onNext}
					disabled={!canNext}
					aria-label="Next page"
				>
					<ChevronRightIcon />
				</Button>
			</div>
		</div>
	);
}
