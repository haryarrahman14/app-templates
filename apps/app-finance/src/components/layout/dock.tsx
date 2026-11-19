import { Tooltip, TooltipContent, TooltipTrigger } from "@repo/ui/components/tooltip";
import { cn } from "@repo/ui/lib/cn";
import { Link, useLocation } from "@tanstack/react-router";
import { SearchIcon } from "lucide-react";
import { motion } from "motion/react";
import { isActive, NAV_ITEMS, SETTINGS_ITEM } from "@/components/layout/nav-items";

const itemClass =
	"relative flex size-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:size-11";

/** Floating glass dock: primary navigation at the bottom centre (a full-width bar on phones). */
export function Dock({ onSearch }: { onSearch: () => void }) {
	const pathname = useLocation({ select: (location) => location.pathname });
	const items = [...NAV_ITEMS, SETTINGS_ITEM];

	return (
		<nav
			aria-label="Primary"
			className="glass fixed inset-x-2 bottom-2 z-40 flex items-center justify-between gap-0.5 rounded-2xl px-1.5 py-1.5 shadow-float sm:inset-x-auto sm:bottom-5 sm:left-1/2 sm:-translate-x-1/2 sm:justify-center sm:gap-1 sm:px-2"
			style={{ paddingBottom: "max(0.375rem, env(safe-area-inset-bottom))" }}
		>
			{items.map((item, index) => {
				const active = isActive(pathname, item.href);
				return (
					<div
						key={item.href}
						className={cn("flex items-center", item === SETTINGS_ITEM && "hidden sm:flex")}
					>
						{index === NAV_ITEMS.length ? (
							<span aria-hidden className="mx-1 hidden h-6 w-px bg-border sm:block" />
						) : null}
						<Tooltip>
							<TooltipTrigger asChild>
								<Link
									to={item.href}
									aria-label={item.label}
									aria-current={active ? "page" : undefined}
									className={cn(itemClass, active && "text-foreground")}
								>
									{active ? (
										<motion.span
											layoutId="dock-active"
											className="absolute inset-0 rounded-xl bg-foreground/[0.08]"
											transition={{ type: "spring", bounce: 0.2, duration: 0.35 }}
										/>
									) : null}
									<item.icon aria-hidden className="relative size-[18px]" />
									{active ? (
										<span className="absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-tint" />
									) : null}
								</Link>
							</TooltipTrigger>
							<TooltipContent side="top" sideOffset={10}>
								{item.label}
							</TooltipContent>
						</Tooltip>
					</div>
				);
			})}
			<Tooltip>
				<TooltipTrigger asChild>
					<button type="button" onClick={onSearch} aria-label="Search (⌘K)" className={itemClass}>
						<SearchIcon aria-hidden className="size-[18px]" />
					</button>
				</TooltipTrigger>
				<TooltipContent side="top" sideOffset={10}>
					Search <span className="ml-1 opacity-60">⌘K</span>
				</TooltipContent>
			</Tooltip>
		</nav>
	);
}
