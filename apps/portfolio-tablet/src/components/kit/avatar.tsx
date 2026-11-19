import { cn } from "@repo/ui/lib/cn";

/** Initials on a neutral gray disc. Swap for an <img> when you have a portrait. */
export function Avatar({ initials, className }: { initials: string; className?: string }) {
	return (
		<span
			aria-hidden
			className={cn(
				"inline-flex shrink-0 items-center justify-center rounded-full bg-[#eaeaea] font-semibold text-[#111111] tracking-tight shadow-soft dark:bg-[#2a2a2a] dark:text-white",
				className,
			)}
		>
			{initials}
		</span>
	);
}
