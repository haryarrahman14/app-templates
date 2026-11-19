import { Spinner } from "@repo/ui/components/spinner";
import { cn } from "@repo/ui/lib/cn";
import { AnimatePresence, motion } from "motion/react";
import {
	type KeyboardEvent,
	type PointerEvent,
	type ReactNode,
	Suspense,
	useRef,
	useState,
} from "react";
import { PaneTitleBar } from "@/features/stage/components/pane-title-bar";
import type { Stage } from "@/features/stage/hooks/use-stage";
import { nearestRatio, type Pane, RATIOS, type Side } from "@/features/stage/utils/stage-model";
import { APPS, type AppId, type AppViewProps } from "@/lib/apps";

const SHEET_SPRING = { type: "spring", bounce: 0.18, duration: 0.45 } as const;

/**
 * Open apps as large sheets over the home screen. One app fills the stage; two sit side by side with
 * a draggable divider that snaps to 30 / 50 / 70.
 */
export function StageView({
	stage,
	isPhone,
	renderApp,
}: {
	stage: Stage;
	isPhone: boolean;
	renderApp: (app: AppId, props: AppViewProps) => ReactNode;
}) {
	const { left, right, ratio } = stage.layout;
	const containerRef = useRef<HTMLDivElement>(null);
	const [liveRatio, setLiveRatio] = useState<number | null>(null);
	const isSplit = Boolean(left && right);
	const leftPercent = liveRatio ?? ratio;

	const onDividerDown = (e: PointerEvent<HTMLDivElement>) => {
		e.currentTarget.setPointerCapture(e.pointerId);
		setLiveRatio(ratio);
	};
	const onDividerMove = (e: PointerEvent<HTMLDivElement>) => {
		if (liveRatio === null || !containerRef.current) return;
		const rect = containerRef.current.getBoundingClientRect();
		const percent = ((e.clientX - rect.left) / rect.width) * 100;
		setLiveRatio(Math.min(78, Math.max(22, percent)));
	};
	const onDividerUp = () => {
		if (liveRatio === null) return;
		stage.setRatio(nearestRatio(liveRatio));
		setLiveRatio(null);
	};
	const onDividerKey = (e: KeyboardEvent<HTMLDivElement>) => {
		const index = RATIOS.indexOf(ratio);
		const next =
			e.key === "ArrowLeft"
				? RATIOS[index - 1]
				: e.key === "ArrowRight"
					? RATIOS[index + 1]
					: undefined;
		if (next) {
			e.preventDefault();
			stage.setRatio(next);
		}
	};

	const renderPane = (pane: Pane, side: Side) => {
		const meta = APPS[pane.app];
		return (
			<motion.section
				key={pane.app}
				initial={{ opacity: 0, scale: 0.9, y: 28 }}
				animate={{ opacity: 1, scale: 1, y: 0 }}
				exit={{ opacity: 0, scale: 0.94, y: 16, transition: { duration: 0.18 } }}
				transition={SHEET_SPRING}
				aria-label={meta.name}
				className={cn(
					"@container/pane pointer-events-auto flex h-full min-h-0 min-w-0 flex-col overflow-hidden",
					"rounded-[22px] border border-black/8 bg-card shadow-float backdrop-blur-2xl md:rounded-[28px] dark:border-white/10",
				)}
				style={{ gridColumn: side === "left" ? 1 : 3 }}
			>
				<PaneTitleBar
					app={meta}
					side={side}
					isSplit={isSplit}
					canSplit={!isPhone}
					onFullscreen={() => stage.fullscreen(side)}
					onPlace={(target, partner) => stage.place(side, target, partner)}
					onClose={() => stage.close(side)}
				/>
				<div className="relative min-h-0 flex-1">
					<Suspense
						fallback={
							<div className="flex h-full items-center justify-center">
								<Spinner />
							</div>
						}
					>
						{renderApp(pane.app, {
							itemId: pane.id,
							onItemChange: (id) => stage.setItem(side, id),
							openApp: (app, id) => stage.openBeside(side, app, id),
						})}
					</Suspense>
				</div>
			</motion.section>
		);
	};

	const open = Boolean(left || right);

	return (
		<>
			<AnimatePresence initial={false}>
				{open ? (
					<motion.div
						key="backdrop"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						onClick={() => stage.home()}
						aria-hidden
						className="fixed inset-0 z-30 bg-black/20 backdrop-blur-md dark:bg-black/45"
					/>
				) : null}
			</AnimatePresence>
			<div
				ref={containerRef}
				className={cn(
					"pointer-events-none fixed inset-x-2 top-10 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-35 grid md:inset-x-5 md:top-12 md:bottom-28",
					liveRatio === null && "transition-[grid-template-columns] duration-300 ease-sheet",
				)}
				style={{
					gridTemplateColumns: isSplit
						? `minmax(0, ${leftPercent}fr) 14px minmax(0, ${100 - leftPercent}fr)`
						: "minmax(0, 1fr)",
				}}
			>
				<AnimatePresence initial={false} mode="popLayout">
					{left ? renderPane(left, "left") : null}
					{isSplit ? (
						<motion.div
							key="divider"
							role="separator"
							aria-orientation="vertical"
							aria-label="Resize split view"
							aria-valuenow={ratio}
							aria-valuemin={30}
							aria-valuemax={70}
							tabIndex={0}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onPointerDown={onDividerDown}
							onPointerMove={onDividerMove}
							onPointerUp={onDividerUp}
							onPointerCancel={onDividerUp}
							onKeyDown={onDividerKey}
							className="group pointer-events-auto flex cursor-col-resize touch-none items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
							style={{ gridColumn: 2 }}
						>
							<span
								className={cn(
									"h-12 w-1.5 rounded-full bg-shade/25 transition-[height,background-color] group-hover:h-16 group-hover:bg-shade/45",
									liveRatio !== null && "h-20 bg-tint",
								)}
							/>
						</motion.div>
					) : null}
					{isSplit && right ? renderPane(right, "right") : null}
				</AnimatePresence>
			</div>
		</>
	);
}
