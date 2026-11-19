import { Tooltip, TooltipContent, TooltipTrigger } from "@repo/ui/components/tooltip";
import { cn } from "@repo/ui/lib/cn";
import { AppIcon } from "@/components/kit/app-icon";
import type { AppId, AppMeta } from "@/lib/apps";

/**
 * Tablet and desktop: a floating glass dock with pinned apps, a divider, then recent apps.
 * Phone: a bottom tab bar with the pinned apps only.
 */
export function Dock({
	pinned,
	recent,
	active,
	onOpen,
}: {
	pinned: AppMeta[];
	recent: AppMeta[];
	/** Apps currently on screen (get a dot / highlighted tab). */
	active: AppId[];
	onOpen: (id: AppId) => void;
}) {
	return (
		<>
			<nav
				aria-label="Dock"
				className="glass-strong fixed bottom-4 left-1/2 z-40 hidden -translate-x-1/2 items-center gap-2 rounded-[28px] p-2.5 shadow-float md:flex"
			>
				{pinned.map((app) => (
					<DockItem key={app.id} app={app} active={active.includes(app.id)} onOpen={onOpen} />
				))}
				{recent.length > 0 ? (
					<>
						<span aria-hidden className="mx-1 h-10 w-px bg-shade/12" />
						<span className="sr-only">Recent apps</span>
						{recent.map((app) => (
							<DockItem key={app.id} app={app} active={active.includes(app.id)} onOpen={onOpen} />
						))}
					</>
				) : null}
			</nav>

			<nav
				aria-label="Tab bar"
				className="glass-strong fixed inset-x-0 bottom-0 z-40 flex justify-around rounded-none border-x-0 border-b-0 px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:hidden"
			>
				{pinned.map((app) => {
					const isActive = active.includes(app.id);
					return (
						<button
							key={app.id}
							type="button"
							onClick={() => onOpen(app.id)}
							aria-current={isActive ? "page" : undefined}
							className="flex min-w-14 flex-col items-center gap-0.5 rounded-xl px-2 py-1 outline-none focus-visible:ring-2 focus-visible:ring-ring"
						>
							<AppIcon
								icon={app.icon}
								swatch={app.swatch}
								size="sm"
								className={cn(!isActive && "opacity-90")}
							/>
							<span
								className={cn(
									"font-medium text-[10.5px]",
									isActive ? "text-tint-text" : "text-muted-foreground",
								)}
							>
								{app.name}
							</span>
						</button>
					);
				})}
			</nav>
		</>
	);
}

function DockItem({
	app,
	active,
	onOpen,
}: {
	app: AppMeta;
	active: boolean;
	onOpen: (id: AppId) => void;
}) {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<button
					type="button"
					onClick={() => onOpen(app.id)}
					aria-label={app.name}
					className="group relative rounded-[16px] outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
				>
					<AppIcon
						icon={app.icon}
						swatch={app.swatch}
						size="lg"
						className="transition-transform duration-200 ease-sheet group-hover:-translate-y-1 group-active:scale-95"
					/>
					<span
						aria-hidden
						className={cn(
							"absolute -bottom-1.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-shade/60 transition-opacity",
							active ? "opacity-100" : "opacity-0",
						)}
					/>
				</button>
			</TooltipTrigger>
			<TooltipContent side="top" sideOffset={10}>
				{app.name}
			</TooltipContent>
		</Tooltip>
	);
}
