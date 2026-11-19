import { Button } from "@repo/ui/components/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@repo/ui/components/dialog";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/kit/page";
import { artworksQuery } from "@/features/gallery/api/queries";
import type { AppViewProps } from "@/lib/apps";

/** Masonry of real screenshots; the open artwork is in the URL (`id`), so a lightbox can be shared. */
export function GalleryPage({ itemId, onItemChange }: AppViewProps) {
	const { data: artworks } = useSuspenseQuery(artworksQuery);
	const index = artworks.findIndex((a) => a.id === itemId);
	const open = index >= 0 ? artworks[index] : undefined;
	const go = (delta: number) => {
		const next = artworks[(index + delta + artworks.length) % artworks.length];
		if (next) onItemChange(next.id);
	};

	return (
		<div className="h-full overflow-y-auto px-4 pt-6 pb-12 @2xl/pane:px-8">
			<PageHeader
				title="Gallery"
				description="Screenshots of the work, with their captions. Tap one to look closer."
			/>
			<ul className="columns-2 gap-3 @2xl/pane:columns-3 @5xl/pane:columns-4">
				{artworks.map((art) => (
					<li key={art.id} className="mb-3 break-inside-avoid">
						<button
							type="button"
							onClick={() => onItemChange(art.id)}
							className="group block w-full overflow-hidden rounded-2xl text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
						>
							<span className="relative block overflow-hidden rounded-2xl border border-border/50 bg-secondary">
								<img
									src={art.src}
									alt={art.alt}
									loading="lazy"
									style={{ aspectRatio: art.ratio }}
									className="block w-full object-cover transition-transform duration-300 ease-sheet group-hover:scale-[1.02]"
								/>
								<span className="absolute inset-x-0 bottom-0 bg-black/55 p-3 font-medium text-[13px] text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
									{art.source}
								</span>
							</span>
						</button>
					</li>
				))}
			</ul>

			<Dialog open={open !== undefined} onOpenChange={(o) => !o && onItemChange(undefined)}>
				<DialogContent
					className="gap-0 overflow-hidden rounded-[24px] p-0 sm:max-w-3xl"
					onKeyDown={(e) => {
						if (e.key === "ArrowRight") go(1);
						if (e.key === "ArrowLeft") go(-1);
					}}
				>
					{open ? (
						<>
							<div className="flex max-h-[65dvh] justify-center bg-secondary">
								<img
									src={open.src}
									alt={open.alt}
									style={{ aspectRatio: open.ratio }}
									className="max-h-[65dvh] w-auto max-w-full object-contain"
								/>
							</div>
							<div className="flex items-center gap-3 px-4 py-3">
								<div className="min-w-0 flex-1">
									<DialogTitle className="text-[15px]">{open.source}</DialogTitle>
									<DialogDescription className="text-[13px]">{open.caption}</DialogDescription>
								</div>
								<Button variant="ghost" size="icon" aria-label="Previous" onClick={() => go(-1)}>
									<ChevronLeft />
								</Button>
								<span className="text-[12.5px] text-muted-foreground tabular-nums">
									{index + 1}/{artworks.length}
								</span>
								<Button variant="ghost" size="icon" aria-label="Next" onClick={() => go(1)}>
									<ChevronRight />
								</Button>
							</div>
						</>
					) : null}
				</DialogContent>
			</Dialog>
		</div>
	);
}
