import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "@repo/ui/components/context-menu";
import { cn } from "@repo/ui/lib/cn";
import { AppWindow, Link2 } from "lucide-react";
import { useRef } from "react";
import { AppTile } from "@/components/kit/app-tile";
import { APPS, type AppId } from "@/lib/apps";
import { setLaunchOrigin, usePhoneNav } from "@/lib/phone-nav";
import { useShareLink } from "@/lib/share";

/** A home-screen icon. Click opens; right-click or long-press shows Open / Share link. */
export function AppIcon({
	id,
	label = true,
	size = 60,
}: {
	id: AppId;
	label?: boolean;
	size?: number;
}) {
	const app = APPS[id];
	const nav = usePhoneNav();
	const share = useShareLink();
	const trigger = useRef<HTMLButtonElement>(null);

	const open = () => {
		setLaunchOrigin(trigger.current);
		nav.open(id);
	};

	return (
		<ContextMenu>
			<ContextMenuTrigger asChild>
				<button
					ref={trigger}
					type="button"
					onClick={open}
					aria-label={`Open ${app.label}`}
					className="group flex flex-col items-center gap-1.5 rounded-[18px] outline-none [-webkit-touch-callout:none] focus-visible:ring-2 focus-visible:ring-on-wall/80 focus-visible:ring-offset-4 focus-visible:ring-offset-transparent"
				>
					<span className="transition-transform duration-150 group-active:scale-90 group-data-[state=open]:scale-110">
						<AppTile icon={app.icon} color={app.color} size={size} />
					</span>
					{label ? (
						<span className={cn("text-on-wall max-w-[76px] truncate font-medium text-[11.5px]")}>
							{app.label}
						</span>
					) : null}
				</button>
			</ContextMenuTrigger>
			<ContextMenuContent className="min-w-44 rounded-[14px] border-0 bg-popover/85 p-1 shadow-float backdrop-blur-xl">
				<ContextMenuItem onSelect={open} className="gap-2.5 rounded-[10px] px-3 py-2 text-[14px]">
					<AppWindow /> Open
				</ContextMenuItem>
				<ContextMenuItem
					onSelect={() => share(app.label, id)}
					className="gap-2.5 rounded-[10px] px-3 py-2 text-[14px]"
				>
					<Link2 /> Share link
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}
