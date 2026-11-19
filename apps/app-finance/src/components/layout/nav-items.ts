import {
	ArrowLeftRightIcon,
	BellRingIcon,
	BriefcaseBusinessIcon,
	ChartCandlestickIcon,
	LayoutDashboardIcon,
	PieChartIcon,
	SettingsIcon,
	StarIcon,
} from "lucide-react";
import type { AppPath } from "@/lib/app-path";

/** Primary navigation, shared by the dock and the command palette. */
export const NAV_ITEMS = [
	{ href: "/", label: "Overview", icon: LayoutDashboardIcon },
	{ href: "/markets", label: "Markets", icon: ChartCandlestickIcon },
	{ href: "/portfolio", label: "Portfolio", icon: BriefcaseBusinessIcon },
	{ href: "/watchlist", label: "Watchlist", icon: StarIcon },
	{ href: "/transactions", label: "Transactions", icon: ArrowLeftRightIcon },
	{ href: "/reports", label: "Reports", icon: PieChartIcon },
	{ href: "/alerts", label: "Alerts", icon: BellRingIcon },
] satisfies { href: AppPath; label: string; icon: unknown }[];

export const SETTINGS_ITEM = {
	href: "/settings/profile",
	label: "Settings",
	icon: SettingsIcon,
} satisfies { href: AppPath; label: string; icon: unknown };

export function isActive(pathname: string, href: string) {
	if (href === "/") return pathname === "/";
	const root = href.split("/").slice(0, 2).join("/");
	return pathname === root || pathname.startsWith(`${root}/`);
}
