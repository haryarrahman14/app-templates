import { cn } from "@repo/ui/lib/cn";
import { Link, useLocation } from "@tanstack/react-router";
import {
	Bell,
	Building,
	CreditCard,
	KeyRound,
	type LucideIcon,
	SlidersHorizontal,
	TriangleAlert,
	User,
	Users,
} from "lucide-react";
import type { ReactNode } from "react";

const NAV: { href: string; label: string; icon: LucideIcon; group: string }[] = [
	{ href: "/settings/profile", label: "Profile", icon: User, group: "Account" },
	{ href: "/settings/notifications", label: "Notifications", icon: Bell, group: "Account" },
	{ href: "/settings/workspace", label: "Workspace", icon: Building, group: "Workspace" },
	{ href: "/settings/members", label: "Members", icon: Users, group: "Workspace" },
	{ href: "/settings/fields", label: "Custom fields", icon: SlidersHorizontal, group: "Workspace" },
	{ href: "/settings/billing", label: "Billing", icon: CreditCard, group: "Workspace" },
	{ href: "/settings/api-keys", label: "API keys", icon: KeyRound, group: "Developers" },
	{ href: "/settings/danger", label: "Danger zone", icon: TriangleAlert, group: "Developers" },
];

const GROUPS = ["Account", "Workspace", "Developers"];

export function SettingsLayout({ children }: { children: ReactNode }) {
	const pathname = useLocation({ select: (location) => location.pathname });
	return (
		<div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 md:flex-row md:gap-10 md:px-8">
			<nav aria-label="Settings" className="shrink-0 md:w-52">
				<h1 className="mb-4 font-semibold text-2xl">Settings</h1>
				{/* Phone: one scrollable row. Desktop: grouped column. */}
				<div className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-col md:gap-4 md:overflow-visible md:px-0">
					{GROUPS.map((group) => (
						<div key={group} className="flex gap-1 md:flex-col">
							<p className="hidden px-2 pb-1 font-medium text-muted-foreground text-xs md:block">
								{group}
							</p>
							{NAV.filter((item) => item.group === group).map((item) => {
								const active = pathname === item.href;
								return (
									<Link
										key={item.href}
										to={item.href}
										aria-current={active ? "page" : undefined}
										className={cn(
											"flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-sm outline-none transition focus-visible:ring-3 focus-visible:ring-ring/50",
											active
												? "bg-muted font-medium text-foreground"
												: "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
										)}
									>
										<item.icon className="size-4" />
										{item.label}
									</Link>
								);
							})}
						</div>
					))}
				</div>
			</nav>
			<div className="min-w-0 flex-1">{children}</div>
		</div>
	);
}

/** A titled settings section: heading + description, then a card. */
export function SettingsSection({
	title,
	description,
	actions,
	children,
	className,
}: {
	title: string;
	description?: ReactNode;
	actions?: ReactNode;
	children: ReactNode;
	className?: string;
}) {
	return (
		<section className={cn("flex flex-col gap-4", className)}>
			<div className="flex flex-wrap items-end justify-between gap-3">
				<div>
					<h2 className="font-semibold text-lg">{title}</h2>
					{description ? <p className="text-muted-foreground text-sm">{description}</p> : null}
				</div>
				{actions}
			</div>
			{children}
		</section>
	);
}

export function SettingsCard({ children, className }: { children: ReactNode; className?: string }) {
	return (
		<div className={cn("rounded-2xl border bg-card p-5 shadow-soft sm:p-6", className)}>
			{children}
		</div>
	);
}
