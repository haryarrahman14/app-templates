import { cn } from "@repo/ui/lib/cn";
import { AppTile } from "@/components/kit/app-tile";
import { APPS, type AppId, DESKTOP_APPS, DOCK_APPS } from "@/lib/apps";
import { useWindows } from "@/lib/window-store";

/** Desktop shortcuts. A column on the left on desktop, a grid of every app on phones. */
export function DesktopIcons({ className }: { className?: string }) {
	const { open } = useWindows();

	const icon = (id: AppId, extraClass?: string) => {
		const app = APPS[id];
		return (
			<li key={id} className={extraClass}>
				<button
					type="button"
					onClick={() => open(id)}
					className="group flex w-[84px] flex-col items-center gap-1.5 rounded-xl p-1.5 outline-none focus-visible:bg-card/40 dark:focus-visible:bg-foreground/10"
				>
					<AppTile
						icon={app.icon}
						color={app.color}
						size={52}
						className="transition-transform duration-200 group-hover:scale-105 group-active:scale-95"
					/>
					<span className="max-w-full truncate rounded px-1 font-medium text-[12px] text-foreground/90 [text-shadow:0_1px_2px_#ffffff99] dark:[text-shadow:0_1px_2px_#00000099]">
						{app.title}
					</span>
				</button>
			</li>
		);
	};

	return (
		<nav aria-label="Desktop shortcuts" className={className}>
			<ul className="grid grid-cols-4 justify-items-center gap-y-3 md:flex md:flex-col md:gap-3">
				{DOCK_APPS.map((id) => icon(id, cn(!DESKTOP_APPS.includes(id) && "md:hidden")))}
			</ul>
		</nav>
	);
}
