import { AppIcon } from "@/components/kit/app-icon";
import type { AppId, AppMeta } from "@/lib/apps";

/** The icon grid under the widgets. */
export function AppGrid({ apps, onOpen }: { apps: AppMeta[]; onOpen: (id: AppId) => void }) {
	return (
		<nav aria-label="Apps" className="mt-8 md:mt-10">
			<ul className="grid grid-cols-4 gap-x-2 gap-y-5 sm:grid-cols-8">
				{apps.map((app) => (
					<li key={app.id} className="flex justify-center">
						<button
							type="button"
							onClick={() => onOpen(app.id)}
							className="group flex w-20 flex-col items-center gap-1.5 rounded-2xl p-1 outline-none focus-visible:ring-2 focus-visible:ring-ring"
						>
							<AppIcon
								icon={app.icon}
								swatch={app.swatch}
								size="lg"
								className="transition-transform duration-200 ease-sheet group-hover:-translate-y-0.5 group-active:scale-95"
							/>
							<span className="font-medium text-[12.5px] text-foreground/80">{app.name}</span>
						</button>
					</li>
				))}
			</ul>
		</nav>
	);
}
