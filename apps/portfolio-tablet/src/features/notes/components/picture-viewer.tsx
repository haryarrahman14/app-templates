import { Button } from "@repo/ui/components/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "@repo/ui/components/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { KeyboardEvent, MouseEvent } from "react";
import type { NotePicture } from "@/features/notes/schemas/note";

/**
 * A note's pictures, one at a time, large over the whole page. Esc, a tap on the dark backdrop or
 * Close shuts it (focus goes back to the picture that opened it); arrow keys or the buttons step.
 */
export function PictureViewer({
	pictures,
	index,
	onIndexChange,
	onClose,
	returnFocusTo,
}: {
	pictures: NotePicture[];
	/** The open picture, or null when closed. */
	index: number | null;
	onIndexChange: (index: number) => void;
	onClose: () => void;
	returnFocusTo?: HTMLElement | null;
}) {
	const picture = index === null ? undefined : pictures[index];
	const count = pictures.length;
	const step = (by: number) => {
		if (index === null || count < 2) return;
		onIndexChange((index + by + count) % count);
	};
	const onKeyDown = (e: KeyboardEvent) => {
		if (e.key === "ArrowRight") {
			e.preventDefault();
			step(1);
		} else if (e.key === "ArrowLeft") {
			e.preventDefault();
			step(-1);
		}
	};
	// The content covers the page; a tap on its empty backdrop (not the picture or a control) closes.
	const onBackdrop = (e: MouseEvent) => {
		if (e.target === e.currentTarget) onClose();
	};
	const caption = picture?.caption ?? picture?.alt;

	return (
		<Dialog open={picture !== undefined} onOpenChange={(open) => !open && onClose()}>
			<DialogContent
				showCloseButton={false}
				onKeyDown={onKeyDown}
				onCloseAutoFocus={(e) => {
					if (returnFocusTo?.isConnected) {
						e.preventDefault();
						returnFocusTo.focus();
					}
				}}
				className="inset-0 top-0 left-0 flex h-dvh w-screen max-w-none translate-x-0 translate-y-0 flex-col gap-0 rounded-none bg-black/88 p-0 text-white ring-0 backdrop-blur-xl sm:max-w-none motion-reduce:animate-none dark:bg-black/92"
			>
				{/* biome-ignore lint/a11y/noStaticElementInteractions: same backdrop shortcut as below. */}
				{/* biome-ignore lint/a11y/useKeyWithClickEvents: keyboard users close with Esc or the Close button. */}
				<div
					onClick={onBackdrop}
					className="flex items-center justify-between gap-3 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-2"
				>
					<DialogTitle className="font-medium text-[13px] text-white/70 tabular-nums">
						{count > 1 && index !== null ? `Picture ${index + 1} of ${count}` : "Picture"}
					</DialogTitle>
					<DialogClose asChild>
						<Button
							variant="ghost"
							size="sm"
							className="rounded-full bg-white/12 text-white hover:bg-white/20 hover:text-white focus-visible:ring-white/60"
						>
							<X />
							Close
						</Button>
					</DialogClose>
				</div>

				{/* biome-ignore lint/a11y/noStaticElementInteractions: the backdrop tap is a pointer shortcut; Esc and Close do the same. */}
				{/* biome-ignore lint/a11y/useKeyWithClickEvents: keyboard users close with Esc or the Close button. */}
				<div
					onClick={onBackdrop}
					className="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-20"
				>
					{picture ? (
						<img
							key={picture.src}
							src={picture.src}
							alt={picture.alt}
							className="max-h-full max-w-full rounded-xl object-contain shadow-float"
						/>
					) : null}
					{count > 1 ? (
						<>
							<StepButton side="left" onClick={() => step(-1)} />
							<StepButton side="right" onClick={() => step(1)} />
						</>
					) : null}
				</div>

				{/* biome-ignore lint/a11y/noStaticElementInteractions: same backdrop shortcut as the top bar. */}
				{/* biome-ignore lint/a11y/useKeyWithClickEvents: keyboard users close with Esc or the Close button. */}
				<div
					onClick={onBackdrop}
					className="flex min-h-16 items-start justify-center px-6 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
				>
					<DialogDescription className="max-w-[60ch] text-center text-[14px] text-white/80 leading-relaxed">
						{caption || " "}
					</DialogDescription>
				</div>
			</DialogContent>
		</Dialog>
	);
}

function StepButton({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
	const Icon = side === "left" ? ChevronLeft : ChevronRight;
	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={onClick}
			aria-label={side === "left" ? "Previous picture" : "Next picture"}
			className={
				side === "left"
					? "absolute bottom-3 left-4 size-11 rounded-full bg-white/12 text-white hover:bg-white/20 hover:text-white focus-visible:ring-white/60 md:top-1/2 md:bottom-auto md:-translate-y-1/2"
					: "absolute right-4 bottom-3 size-11 rounded-full bg-white/12 text-white hover:bg-white/20 hover:text-white focus-visible:ring-white/60 md:top-1/2 md:bottom-auto md:-translate-y-1/2"
			}
		>
			<Icon className="size-5" />
		</Button>
	);
}
