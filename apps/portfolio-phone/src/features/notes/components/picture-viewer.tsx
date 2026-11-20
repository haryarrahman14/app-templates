import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type ReactNode, useEffect, useRef } from "react";
import type { NotePicture } from "@/features/notes/schemas/note";

/**
 * A note's picture, large, over the whole phone screen: dark backdrop, Close (or Esc) to leave,
 * buttons, arrow keys or a swipe to step through the note's pictures. Focus moves in on open,
 * stays inside while open, and goes back to the picture that opened it on close.
 */
export function PictureViewer({
	pictures,
	index,
	onIndex,
	onClose,
}: {
	pictures: NotePicture[];
	index: number | null;
	onIndex: (index: number) => void;
	onClose: () => void;
}) {
	const reduced = useReducedMotion();
	const dialog = useRef<HTMLDivElement>(null);
	const closeButton = useRef<HTMLButtonElement>(null);
	const opener = useRef<HTMLElement | null>(null);
	const open = index !== null;
	const picture = index === null ? undefined : pictures[index];
	const many = pictures.length > 1;

	const step = (delta: number) => {
		if (index === null || !many) return;
		onIndex((index + delta + pictures.length) % pictures.length);
	};

	// Focus in on open; back to the opener on close.
	useEffect(() => {
		if (!open) return;
		opener.current = document.activeElement as HTMLElement | null;
		closeButton.current?.focus({ preventScroll: true });
		return () => opener.current?.focus({ preventScroll: true });
	}, [open]);

	useEffect(() => {
		if (!open) return;
		const onKey = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				// The app layer skips Escape while a [role=dialog][data-state=open] is up.
				event.preventDefault();
				onClose();
			} else if (event.key === "ArrowRight") step(1);
			else if (event.key === "ArrowLeft") step(-1);
			else if (event.key === "Tab" && dialog.current) {
				const items = [...dialog.current.querySelectorAll<HTMLElement>("button")];
				const first = items[0];
				const last = items.at(-1);
				if (event.shiftKey && document.activeElement === first) {
					event.preventDefault();
					last?.focus();
				} else if (!event.shiftKey && document.activeElement === last) {
					event.preventDefault();
					first?.focus();
				}
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	});

	const label = picture ? (picture.caption ?? picture.alt) : "";

	return (
		<AnimatePresence>
			{picture && index !== null ? (
				<motion.div
					ref={dialog}
					key="picture-viewer"
					role="dialog"
					aria-modal
					aria-label={`Picture ${index + 1} of ${pictures.length}`}
					data-state="open"
					data-dark-overlay=""
					className="absolute inset-0 z-30 flex flex-col bg-black/95 text-white backdrop-blur-sm"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: reduced ? 0.1 : 0.2 }}
				>
					<div className="flex items-center justify-between px-3 pt-(--status-h)">
						<button
							ref={closeButton}
							type="button"
							onClick={onClose}
							className="flex h-9 items-center gap-1 rounded-full bg-white/12 pr-3.5 pl-2.5 font-medium text-[14px] outline-none backdrop-blur hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white/60"
						>
							<X className="size-[18px]" />
							Close
						</button>
						{many ? (
							<p className="text-[13px] text-white/70 tabular-nums" aria-live="polite">
								{index + 1} of {pictures.length}
							</p>
						) : null}
						<span className="w-[76px]" />
					</div>

					<div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-3 py-4">
						<AnimatePresence mode="popLayout" initial={false}>
							<motion.div
								key={index}
								className="flex h-full w-full touch-pan-y items-center justify-center"
								initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
								transition={{ duration: reduced ? 0.1 : 0.2 }}
								drag={many ? "x" : false}
								dragConstraints={{ left: 0, right: 0 }}
								dragElastic={0.5}
								onDragEnd={(_, info) => {
									if (info.offset.x < -60 || info.velocity.x < -400) step(1);
									else if (info.offset.x > 60 || info.velocity.x > 400) step(-1);
								}}
							>
								<img
									src={picture.src}
									alt={picture.alt}
									draggable={false}
									className="max-h-full max-w-full select-none rounded-[10px] object-contain"
								/>
							</motion.div>
						</AnimatePresence>
					</div>

					<div className="flex items-center gap-3 px-4 pb-[calc(var(--home-h)+0.75rem)]">
						{many ? (
							<StepButton label="Previous picture" onClick={() => step(-1)}>
								<ChevronLeft className="size-5" />
							</StepButton>
						) : null}
						<p className="min-w-0 flex-1 text-center text-[14px] text-white/85 leading-snug">
							{label}
						</p>
						{many ? (
							<StepButton label="Next picture" onClick={() => step(1)}>
								<ChevronRight className="size-5" />
							</StepButton>
						) : null}
					</div>
				</motion.div>
			) : null}
		</AnimatePresence>
	);
}

function StepButton({
	label,
	onClick,
	children,
}: {
	label: string;
	onClick: () => void;
	children: ReactNode;
}) {
	return (
		<button
			type="button"
			aria-label={label}
			onClick={onClick}
			className="grid size-10 shrink-0 place-items-center rounded-full bg-white/12 outline-none backdrop-blur hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white/60"
		>
			{children}
		</button>
	);
}
