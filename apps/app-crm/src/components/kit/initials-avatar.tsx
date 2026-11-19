import { cn } from "@repo/ui/lib/cn";
import { initials, toneFor } from "@/lib/format";

/** Initials on a neutral gray. */
export function InitialsAvatar({
	name,
	size = "sm",
	square = false,
	className,
}: {
	name: string;
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	square?: boolean;
	className?: string;
}) {
	return (
		<span
			aria-hidden
			className={cn(
				"inline-flex shrink-0 select-none items-center justify-center font-semibold",
				square ? "rounded-[28%]" : "rounded-full",
				size === "xs" && "size-5 text-[9px]",
				size === "sm" && "size-6 text-[10px]",
				size === "md" && "size-8 text-xs",
				size === "lg" && "size-12 text-base",
				size === "xl" && "size-16 text-xl",
				toneFor(name),
				className,
			)}
		>
			{initials(name)}
		</span>
	);
}
