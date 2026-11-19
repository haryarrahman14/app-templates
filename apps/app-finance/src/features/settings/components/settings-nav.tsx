import { cn } from "@repo/ui/lib/cn";
import { Link, useLocation } from "@tanstack/react-router";
import {
	BellIcon,
	CreditCardIcon,
	LinkIcon,
	PaletteIcon,
	ShieldCheckIcon,
	TriangleAlertIcon,
	UserIcon,
} from "lucide-react";

const ITEMS = [
	{ href: "/settings/profile", label: "Profile", icon: UserIcon },
	{ href: "/settings/appearance", label: "Appearance", icon: PaletteIcon },
	{ href: "/settings/notifications", label: "Notifications", icon: BellIcon },
	{ href: "/settings/security", label: "Security", icon: ShieldCheckIcon },
	{ href: "/settings/accounts", label: "Connected accounts", icon: LinkIcon },
	{ href: "/settings/billing", label: "Billing", icon: CreditCardIcon },
	{ href: "/settings/danger", label: "Danger zone", icon: TriangleAlertIcon },
] as const;

export function SettingsNav() {
	const pathname = useLocation({ select: (location) => location.pathname });
	return (
		<nav
			aria-label="Settings"
			className="-mx-4 overflow-x-auto px-4 lg:mx-0 lg:overflow-visible lg:px-0"
		>
			<ul className="flex gap-1 lg:flex-col">
				{ITEMS.map((item) => {
					const active = pathname === item.href;
					return (
						<li key={item.href}>
							<Link
								to={item.href}
								aria-current={active ? "page" : undefined}
								ref={(node) => {
									// On phones the nav scrolls sideways; keep the current section in view.
									if (active && node) node.scrollIntoView({ block: "nearest", inline: "nearest" });
								}}
								className={cn(
									"flex items-center gap-2.5 whitespace-nowrap rounded-xl px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
									active
										? "bg-foreground/[0.07] font-medium text-foreground"
										: "text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground",
									item.href.endsWith("danger") && !active && "text-loss/80",
								)}
							>
								<item.icon aria-hidden className="size-4" />
								{item.label}
							</Link>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}
