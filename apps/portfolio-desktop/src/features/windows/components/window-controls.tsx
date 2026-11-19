import { cn } from "@repo/ui/lib/cn";
import { MinusIcon, PlusIcon, XIcon } from "lucide-react";

const CONTROLS = [
	{
		key: "close",
		label: "Close window",
		icon: XIcon,
		active: "bg-red",
		hover: "group-hover/controls:bg-red",
	},
	{
		key: "minimize",
		label: "Minimise window",
		icon: MinusIcon,
		active: "bg-yellow",
		hover: "group-hover/controls:bg-yellow",
	},
	{
		key: "maximize",
		label: "Maximise window",
		icon: PlusIcon,
		active: "bg-green",
		hover: "group-hover/controls:bg-green",
	},
] as const;

/** Three round window controls. Grey when the window is not focused; glyphs show on hover. */
export function WindowControls({
	active,
	onClose,
	onMinimize,
	onMaximize,
}: {
	active: boolean;
	onClose: () => void;
	onMinimize: () => void;
	onMaximize: () => void;
}) {
	const handlers = { close: onClose, minimize: onMinimize, maximize: onMaximize };
	return (
		<div className="group/controls flex items-center gap-2">
			{CONTROLS.map((control) => (
				<button
					key={control.key}
					type="button"
					aria-label={control.label}
					onClick={handlers[control.key]}
					className={cn(
						"relative flex size-3.5 items-center justify-center rounded-full ring-1 ring-black/10 ring-inset transition-colors after:absolute after:-inset-1.5 focus-visible:outline-2 max-md:size-4 dark:ring-foreground/10",
						active ? control.active : cn("bg-foreground/15", control.hover),
						control.key === "maximize" && "max-md:hidden",
					)}
				>
					<control.icon
						className="size-2.5 text-black/60 opacity-0 transition-opacity group-hover/controls:opacity-100 max-md:size-3 max-md:opacity-100"
						strokeWidth={3}
					/>
				</button>
			))}
		</div>
	);
}
