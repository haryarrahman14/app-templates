import { Button } from "@repo/ui/components/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "@repo/ui/components/dialog";
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react";
import type { KeyboardEvent } from "react";
import type { NotePicture } from "@/features/notes/schemas/note";

type PictureViewerProps = {
	pictures: NotePicture[];
	/** The picture shown, or null when closed. */
	index: number | null;
	onIndexChange: (index: number) => void;
	onClose: () => void;
	/** Where focus goes back to when the viewer closes. */
	returnFocusTo?: HTMLElement | null;
};

const control =
	"rounded-full text-white hover:bg-white/12 hover:text-white focus-visible:ring-white/60 dark:hover:bg-white/12";

/** A note's pictures large over the whole page. Esc, a click beside the picture or Close shuts it. */
export function PictureViewer({
	pictures,
	index,
	onIndexChange,
	onClose,
	returnFocusTo,
}: PictureViewerProps) {
	const picture = index === null ? undefined : pictures[index];
	const count = pictures.length;
	const step = (by: number) => {
		if (index !== null && count > 1) onIndexChange((index + by + count) % count);
	};
	const onKeyDown = (event: KeyboardEvent) => {
		if (event.key === "ArrowLeft") step(-1);
		else if (event.key === "ArrowRight") step(1);
		else return;
		event.preventDefault();
	};

	return (
		<Dialog open={picture !== undefined} onOpenChange={(open) => !open && onClose()}>
			<DialogContent
				showCloseButton={false}
				onKeyDown={onKeyDown}
				onCloseAutoFocus={(event) => {
					if (!returnFocusTo) return;
					event.preventDefault();
					returnFocusTo.focus({ preventScroll: true });
				}}
				className="top-0 left-0 flex h-dvh w-screen max-w-none translate-x-0 translate-y-0 flex-col gap-0 rounded-none bg-black/90 p-0 text-white ring-0 sm:max-w-none"
			>
				<div className="flex items-center justify-between gap-4 px-4 py-3">
					<DialogTitle className="font-normal text-sm text-white/70 tabular-nums">
						Picture {(index ?? 0) + 1} of {count}
					</DialogTitle>
					<DialogClose asChild>
						<Button variant="ghost" size="sm" className={control}>
							<XIcon />
							Close
						</Button>
					</DialogClose>
				</div>
				{/* A click on the dark space around the picture closes, like a click outside. */}
				{/* biome-ignore lint/a11y/noStaticElementInteractions: a pointer shortcut; Esc and Close do the same from the keyboard. */}
				{/* biome-ignore lint/a11y/useKeyWithClickEvents: see above. */}
				<div
					className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20"
					onClick={(event) => event.target === event.currentTarget && onClose()}
				>
					{picture && (
						<img
							key={picture.src}
							src={picture.src}
							alt={picture.alt}
							className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
						/>
					)}
					{count > 1 && (
						<>
							<Button
								variant="ghost"
								size="icon-lg"
								onClick={() => step(-1)}
								className={`${control} absolute top-1/2 left-3 -translate-y-1/2 bg-black/40 max-sm:top-auto max-sm:bottom-3 max-sm:translate-y-0`}
							>
								<ChevronLeftIcon className="size-5" />
								<span className="sr-only">Previous picture</span>
							</Button>
							<Button
								variant="ghost"
								size="icon-lg"
								onClick={() => step(1)}
								className={`${control} absolute top-1/2 right-3 -translate-y-1/2 bg-black/40 max-sm:top-auto max-sm:bottom-3 max-sm:translate-y-0`}
							>
								<ChevronRightIcon className="size-5" />
								<span className="sr-only">Next picture</span>
							</Button>
						</>
					)}
				</div>
				<DialogDescription className="mx-auto min-h-14 max-w-[70ch] px-6 pt-3 pb-5 text-center text-sm text-white/80 italic">
					{picture?.caption ?? picture?.alt}
				</DialogDescription>
			</DialogContent>
		</Dialog>
	);
}
