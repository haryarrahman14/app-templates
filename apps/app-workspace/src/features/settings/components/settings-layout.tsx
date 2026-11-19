import { cn } from "@repo/ui/lib/cn";
import { Link, useLocation } from "@tanstack/react-router";
import {
	BellIcon,
	CreditCardIcon,
	PaletteIcon,
	TriangleAlertIcon,
	UserIcon,
	UsersIcon,
} from "lucide-react";
import { type ReactNode, useEffect, useRef } from "react";

const NAV = [
	{ href: "/settings/profile", label: "Profile", icon: UserIcon },
	{ href: "/settings/appearance", label: "Appearance", icon: PaletteIcon },
	{ href: "/settings/notifications", label: "Notifications", icon: BellIcon },
	{ href: "/settings/members", label: "Members", icon: UsersIcon },
	{ href: "/settings/billing", label: "Billing", icon: CreditCardIcon },
	{ href: "/settings/danger", label: "Danger zone", icon: TriangleAlertIcon },
];

export function SettingsLayout({ children }: { children: ReactNode }) {
	const pathname = useLocation({ select: (location) => location.pathname });
	const navRef = useRef<HTMLElement>(null);

	// On phones the nav scrolls sideways; keep the current page's link in view.
	useEffect(() => {
		navRef.current
			?.querySelector(`a[href="${pathname}"]`)
			?.scrollIntoView({ block: "nearest", inline: "nearest" });
	}, [pathname]);

	return (
		<div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-8 sm:py-10">
			<h1 className="mb-6 font-semibold text-2xl tracking-tight sm:text-3xl">Settings</h1>
			<div className="flex flex-col gap-6 md:flex-row md:gap-10">
				<nav
					aria-label="Settings"
					className="-mx-4 overflow-x-auto px-4 md:mx-0 md:w-52 md:shrink-0 md:px-0"
				>
					<ul className="flex gap-1 md:flex-col">
						{NAV.map((item) => {
							const active = pathname === item.href;
							return (
								<li key={item.href}>
									<Link
										to={item.href}
										aria-current={active ? "page" : undefined}
										className={cn(
											"flex items-center gap-2.5 whitespace-nowrap rounded-xl px-3 py-2 text-sm outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring",
											active
												? "bg-card font-medium text-foreground shadow-soft"
												: "text-muted-foreground",
											item.href.endsWith("danger") && !active && "text-destructive/80",
										)}
									>
										<item.icon className="size-4" />
										{item.label}
									</Link>
								</li>
							);
						})}
					</ul>
				</nav>
				<div className="min-w-0 flex-1 space-y-6">{children}</div>
			</div>
		</div>
	);
}
