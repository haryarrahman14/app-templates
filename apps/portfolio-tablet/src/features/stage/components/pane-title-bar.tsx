import { Button } from "@repo/ui/components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@repo/ui/components/tooltip";
import { Maximize2, PanelLeft, PanelRight, X } from "lucide-react";
import type { ReactNode } from "react";
import { AppIcon } from "@/components/kit/app-icon";
import type { Side } from "@/features/stage/utils/stage-model";
import { APPS, type AppId, type AppMeta } from "@/lib/apps";

/**
 * Title bar of an app sheet: grabber, name, and the layout controls
 * (full screen, split left, split right, close). Split controls are hidden on phones.
 */
export function PaneTitleBar({
	app,
	side,
	isSplit,
	canSplit,
	onFullscreen,
	onPlace,
	onClose,
}: {
	app: AppMeta;
	side: Side;
	isSplit: boolean;
	canSplit: boolean;
	onFullscreen: () => void;
	/** Move this pane to `target`; `partner` picks the other app when there is none yet. */
	onPlace: (target: Side, partner?: AppId) => void;
	onClose: () => void;
}) {
	const partners = Object.values(APPS).filter((a) => a.id !== app.id);

	const splitControl = (target: Side, icon: ReactNode, label: string) => {
		if (isSplit) {
			return (
				<IconButton
					label={label}
					pressed={side === target}
					disabled={side === target}
					onClick={() => onPlace(target)}
				>
					{icon}
				</IconButton>
			);
		}
		return (
			<DropdownMenu>
				<Tooltip>
					<TooltipTrigger asChild>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon-sm" aria-label={label} className="rounded-full">
								{icon}
							</Button>
						</DropdownMenuTrigger>
					</TooltipTrigger>
					<TooltipContent>{label}</TooltipContent>
				</Tooltip>
				<DropdownMenuContent align="end" className="w-52">
					<DropdownMenuLabel>
						{target === "left" ? "Open on the right" : "Open on the left"}
					</DropdownMenuLabel>
					{partners.map((partner) => (
						<DropdownMenuItem key={partner.id} onSelect={() => onPlace(target, partner.id)}>
							<AppIcon icon={partner.icon} swatch={partner.swatch} size="xs" />
							{partner.name}
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
		);
	};

	return (
		<header className="relative flex h-12 shrink-0 items-center gap-2.5 border-border/50 border-b pr-2 pl-3.5">
			<span
				aria-hidden
				className="absolute top-1.5 left-1/2 h-1 w-9 -translate-x-1/2 rounded-full bg-shade/15"
			/>
			<AppIcon icon={app.icon} swatch={app.swatch} size="xs" />
			<h2 className="truncate font-semibold text-[14px]">{app.name}</h2>
			<div className="ml-auto flex items-center gap-0.5">
				{canSplit ? (
					<>
						{isSplit ? (
							<IconButton label="Full screen" onClick={onFullscreen}>
								<Maximize2 />
							</IconButton>
						) : null}
						{splitControl("left", <PanelLeft />, "Split left")}
						{splitControl("right", <PanelRight />, "Split right")}
					</>
				) : null}
				<IconButton label={`Close ${app.name}`} onClick={onClose}>
					<X />
				</IconButton>
			</div>
		</header>
	);
}

function IconButton({
	label,
	onClick,
	children,
	pressed,
	disabled,
}: {
	label: string;
	onClick: () => void;
	children: ReactNode;
	pressed?: boolean;
	disabled?: boolean;
}) {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					variant="ghost"
					size="icon-sm"
					aria-label={label}
					aria-pressed={pressed}
					disabled={disabled}
					onClick={onClick}
					className="rounded-full aria-pressed:bg-tint/25 aria-pressed:text-tint-text disabled:opacity-100"
				>
					{children}
				</Button>
			</TooltipTrigger>
			<TooltipContent>{label}</TooltipContent>
		</Tooltip>
	);
}
