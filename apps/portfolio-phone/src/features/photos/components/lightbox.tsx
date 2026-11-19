import { ArrowUpRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import type { Shot } from "@/features/photos/schemas/shot";
import { usePhoneNav } from "@/lib/phone-nav";

export function Lightbox({ shots, activeId }: { shots: Shot[]; activeId: string | undefined }) {
	const nav = usePhoneNav();
	const index = shots.findIndex((s) => s.id === activeId);
	const shot = shots[index];

	const step = (delta: number) => {
		const next = shots[(index + delta + shots.length) % shots.length];
		if (next) nav.swap(next.id);
	};

	useEffect(() => {
		if (!shot) return;
		const onKey = (event: KeyboardEvent) => {
			if (event.key === "ArrowRight") step(1);
			if (event.key === "ArrowLeft") step(-1);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	});

	return (
		<AnimatePresence>
			{shot ? (
				<motion.div
					key="lightbox"
					role="dialog"
					aria-modal
					aria-label={`${shot.title}, ${shot.project}`}
					className="absolute inset-0 z-30 flex flex-col bg-black text-white"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.22 }}
				>
					<div className="flex items-center justify-between px-3 pt-(--status-h)">
						<button
							type="button"
							onClick={nav.back}
							aria-label="Close"
							className="grid size-10 place-items-center rounded-full bg-white/10 outline-none backdrop-blur focus-visible:ring-2 focus-visible:ring-white/60"
						>
							<X className="size-5" />
						</button>
						<p className="text-[13px] text-white/70 tabular-nums">
							{index + 1} of {shots.length}
						</p>
						<span className="size-10" />
					</div>

					<div className="relative flex flex-1 items-center justify-center overflow-hidden px-8 py-4">
						<AnimatePresence mode="popLayout" initial={false}>
							<motion.div
								key={shot.id}
								className="flex h-full max-h-[520px] w-full cursor-grab items-center justify-center active:cursor-grabbing"
								initial={{ opacity: 0, scale: 0.96 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.96 }}
								transition={{ duration: 0.2 }}
								drag="x"
								dragConstraints={{ left: 0, right: 0 }}
								dragElastic={0.5}
								onDragEnd={(_, info) => {
									if (info.offset.x < -60 || info.velocity.x < -400) step(1);
									else if (info.offset.x > 60 || info.velocity.x > 400) step(-1);
								}}
							>
								<img
									src={shot.src}
									alt={shot.alt}
									className={
										shot.kind === "phone"
											? "max-h-full max-w-full rounded-[22px] object-contain"
											: "max-h-full max-w-full rounded-[12px] object-contain"
									}
									draggable={false}
								/>
							</motion.div>
						</AnimatePresence>
						<button
							type="button"
							onClick={() => step(-1)}
							aria-label="Previous shot"
							className="absolute left-2 grid size-9 place-items-center rounded-full bg-white/10 outline-none backdrop-blur hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white/60"
						>
							<ChevronLeft className="size-5" />
						</button>
						<button
							type="button"
							onClick={() => step(1)}
							aria-label="Next shot"
							className="absolute right-2 grid size-9 place-items-center rounded-full bg-white/10 outline-none backdrop-blur hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white/60"
						>
							<ChevronRight className="size-5" />
						</button>
					</div>

					<div className="flex items-center justify-between gap-3 px-5 pb-[calc(var(--home-h)+0.75rem)]">
						<div className="min-w-0">
							<p className="line-clamp-2 font-semibold text-[15px] leading-snug">{shot.title}</p>
							<p className="text-[13px] text-white/60">{shot.project}</p>
						</div>
						{shot.projectSlug ? (
							<button
								type="button"
								onClick={() => nav.open("projects", shot.projectSlug)}
								className="flex shrink-0 items-center gap-1 rounded-full bg-white/15 px-3.5 py-2 font-medium text-[13px] outline-none backdrop-blur hover:bg-white/25 focus-visible:ring-2 focus-visible:ring-white/60"
							>
								Case study <ArrowUpRight className="size-3.5" />
							</button>
						) : null}
					</div>
				</motion.div>
			) : null}
		</AnimatePresence>
	);
}
