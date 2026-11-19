import { cn } from "@repo/ui/lib/cn";
import { useSuspenseQuery } from "@tanstack/react-query";
import { animate, motion, useMotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { homeWidgetsQuery } from "@/features/home-screen/api/queries";
import { AppIcon } from "@/features/home-screen/components/app-icon";
import {
	AskWidget,
	AvailabilityWidget,
	FeaturedWidget,
	type HomeOwner,
	NoteWidget,
	ProfileWidget,
	StatsWidget,
} from "@/features/home-screen/components/widgets";
import { DOCK_APPS, PAGE_ONE_APPS } from "@/lib/apps";

const PAGES = 2;
const SPRING = { type: "spring", stiffness: 380, damping: 40 } as const;

type Props = {
	owner: HomeOwner;
	/** Keyboard paging and focus only while the home screen is what's on screen. */
	active: boolean;
	/** An app is open on top: the home screen recedes. */
	covered: boolean;
	locked: boolean;
};

export function HomeScreen({ owner, active, covered, locked }: Props) {
	const { data: widgets } = useSuspenseQuery(homeWidgetsQuery);
	const [page, setPage] = useState(0);
	const x = useMotionValue(0);
	const viewport = useRef<HTMLDivElement>(null);
	const dragged = useRef(false);

	const width = () => viewport.current?.clientWidth ?? 0;

	const goTo = (next: number) => {
		const clamped = Math.max(0, Math.min(PAGES - 1, next));
		setPage(clamped);
		animate(x, -clamped * width(), SPRING);
	};

	// Keep the page aligned when the screen resizes.
	useEffect(() => {
		const parent = viewport.current;
		if (!parent) return;
		const observer = new ResizeObserver(() => x.set(-page * parent.clientWidth));
		observer.observe(parent);
		return () => observer.disconnect();
	}, [page, x]);

	useEffect(() => {
		if (!active) return;
		const onKey = (event: KeyboardEvent) => {
			const target = event.target as HTMLElement;
			if (target.closest("input, textarea, [role=menu]")) return;
			if (event.key === "ArrowRight") goTo(page + 1);
			if (event.key === "ArrowLeft") goTo(page - 1);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	});

	return (
		<motion.div
			className="wallpaper absolute inset-0 flex flex-col overflow-hidden"
			inert={!active}
			animate={{ scale: locked ? 1.08 : covered ? 0.94 : 1 }}
			transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
		>
			<h2 className="sr-only">Home screen</h2>
			<motion.div
				aria-hidden
				className="pointer-events-none absolute inset-0 z-10 bg-black"
				initial={false}
				animate={{ opacity: covered ? 0.25 : 0 }}
				transition={{ duration: 0.35 }}
			/>
			<div
				ref={viewport}
				className="relative flex-1 overflow-hidden pt-[calc(var(--status-h)+0.75rem)]"
			>
				<motion.div
					className="flex h-full w-[200%] touch-pan-y"
					style={{ x }}
					drag="x"
					dragDirectionLock
					dragConstraints={viewport}
					dragElastic={0.18}
					dragMomentum={false}
					onDragStart={() => {
						dragged.current = true;
					}}
					onDragEnd={(_, info) => {
						setTimeout(() => {
							dragged.current = false;
						}, 50);
						const swipe = info.offset.x + info.velocity.x * 0.2;
						const threshold = width() * 0.18;
						goTo(swipe < -threshold ? page + 1 : swipe > threshold ? page - 1 : page);
					}}
					onClickCapture={(event) => {
						if (dragged.current) {
							event.stopPropagation();
							event.preventDefault();
						}
					}}
				>
					<section
						aria-label="Page 1 of 2"
						inert={page !== 0}
						className="grid h-max w-1/2 grid-cols-4 content-start gap-x-3 gap-y-3.5 px-5"
					>
						<ProfileWidget owner={owner} />
						{owner.availability ? <AvailabilityWidget owner={owner} /> : null}
						<StatsWidget stats={widgets.stats} />
						<div className="col-span-4 mt-2 grid grid-cols-4 gap-y-4">
							{PAGE_ONE_APPS.map((id) => (
								<AppIcon key={id} id={id} />
							))}
						</div>
					</section>
					<section
						aria-label="Page 2 of 2"
						inert={page !== 1}
						className="grid h-max w-1/2 grid-cols-4 content-start gap-3.5 px-5"
					>
						{widgets.featured ? <FeaturedWidget featured={widgets.featured} /> : null}
						{widgets.latestNote ? <NoteWidget note={widgets.latestNote} /> : null}
						<AskWidget prompt={widgets.askPrompt} />
					</section>
				</motion.div>
			</div>

			<div className="flex justify-center pb-3" role="tablist" aria-label="Home pages">
				<div className="flex gap-2 rounded-full bg-on-wall/10 px-2.5 py-1.5">
					{Array.from({ length: PAGES }, (_, index) => (
						<button
							// biome-ignore lint/suspicious/noArrayIndexKey: pages are positional
							key={index}
							type="button"
							role="tab"
							aria-selected={page === index}
							aria-label={`Page ${index + 1}`}
							onClick={() => goTo(index)}
							className={cn(
								"size-[7px] rounded-full outline-none transition-colors focus-visible:ring-2 focus-visible:ring-on-wall",
								page === index ? "bg-on-wall" : "bg-on-wall/35",
							)}
						/>
					))}
				</div>
			</div>

			<nav
				aria-label="Dock"
				className="mx-3 mb-[calc(var(--home-h)-6px)] grid grid-cols-4 justify-items-center rounded-[32px] border border-(--dock-border) bg-(--dock) px-3 py-3 backdrop-blur-2xl"
			>
				{DOCK_APPS.map((id) => (
					<AppIcon key={id} id={id} label={false} />
				))}
			</nav>
		</motion.div>
	);
}
