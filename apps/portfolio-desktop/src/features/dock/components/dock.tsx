import { Tooltip, TooltipContent, TooltipTrigger } from "@repo/ui/components/tooltip";
import { cn } from "@repo/ui/lib/cn";
import {
	type MotionValue,
	motion,
	useMotionValue,
	useReducedMotion,
	useSpring,
	useTransform,
} from "motion/react";
import { useRef } from "react";
import { AppTile } from "@/components/kit/app-tile";
import { APPS, type AppId, DOCK_APPS } from "@/lib/apps";
import { usePreferences } from "@/lib/preferences";
import { useWindows } from "@/lib/window-store";

const BASE = 48;
const MAX = 72;
const RANGE = 150;

function RunningDot({ visible }: { visible: boolean }) {
	return (
		<span
			aria-hidden
			className={cn(
				"size-1 rounded-full bg-foreground/70 transition-opacity",
				visible ? "opacity-100" : "opacity-0",
			)}
		/>
	);
}

function DockItem({
	id,
	mouseX,
	magnify,
}: {
	id: AppId;
	mouseX: MotionValue<number>;
	magnify: boolean;
}) {
	const ref = useRef<HTMLButtonElement>(null);
	const { state, activate } = useWindows();
	const app = APPS[id];
	const running = Boolean(state.windows[id]);

	const distance = useTransform(mouseX, (x) => {
		const rect = ref.current?.getBoundingClientRect();
		return rect ? x - (rect.left + rect.width / 2) : RANGE;
	});
	const target = useTransform(distance, [-RANGE, 0, RANGE], [BASE, MAX, BASE]);
	const size = useSpring(target, { mass: 0.1, stiffness: 170, damping: 14 });
	const scale = useTransform(size, (value) => value / MAX);

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<button
					ref={ref}
					type="button"
					aria-label={`${app.title}${running ? " (open)" : ""}`}
					onClick={() => activate(id)}
					className="flex flex-col items-center gap-1 outline-none focus-visible:[&>div]:ring-2 focus-visible:[&>div]:ring-ring"
				>
					<motion.div
						style={magnify ? { width: size, height: size } : { width: BASE, height: BASE }}
						className="relative rounded-[24%] active:brightness-90"
					>
						<motion.div
							style={{ scale: magnify ? scale : BASE / MAX, transformOrigin: "0 0" }}
							className="absolute top-0 left-0"
						>
							<AppTile icon={app.icon} color={app.color} size={MAX} />
						</motion.div>
					</motion.div>
					<RunningDot visible={running} />
				</button>
			</TooltipTrigger>
			<TooltipContent side="top" sideOffset={10}>
				{app.title}
			</TooltipContent>
		</Tooltip>
	);
}

/** Glass dock. Desktop: centred with hover magnification. Phone: a scrollable bottom bar. */
export function Dock() {
	const mouseX = useMotionValue(Number.POSITIVE_INFINITY);
	const { reduceMotion } = usePreferences();
	const systemReduced = useReducedMotion();
	const magnify = !reduceMotion && !systemReduced;
	const { state, activate } = useWindows();

	return (
		<>
			<nav
				aria-label="Dock"
				onMouseMove={(event) => mouseX.set(event.clientX)}
				onMouseLeave={() => mouseX.set(Number.POSITIVE_INFINITY)}
				className="glass fixed bottom-3 left-1/2 z-40 hidden -translate-x-1/2 items-end gap-2.5 rounded-[22px] px-2.5 pt-2.5 pb-1 shadow-float md:flex"
			>
				{DOCK_APPS.map((id, index) => (
					<div key={id} className="flex items-end gap-2.5">
						{index === DOCK_APPS.length - 2 && (
							<span aria-hidden className="mb-3 h-10 w-px self-center bg-foreground/15" />
						)}
						<DockItem id={id} mouseX={mouseX} magnify={magnify} />
					</div>
				))}
			</nav>

			<nav
				aria-label="Apps"
				className="glass fixed inset-x-2 bottom-2 z-40 flex h-[72px] items-center gap-4 overflow-x-auto rounded-[22px] px-4 shadow-float [scrollbar-width:none] md:hidden"
			>
				{DOCK_APPS.map((id) => {
					const app = APPS[id];
					return (
						<button
							key={id}
							type="button"
							aria-label={app.title}
							onClick={() => activate(id)}
							className="flex shrink-0 flex-col items-center gap-1 pt-1 active:scale-95"
						>
							<AppTile icon={app.icon} color={app.color} size={46} />
							<RunningDot visible={Boolean(state.windows[id])} />
						</button>
					);
				})}
			</nav>
		</>
	);
}
