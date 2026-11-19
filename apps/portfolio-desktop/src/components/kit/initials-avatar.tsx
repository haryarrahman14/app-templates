import { cn } from "@repo/ui/lib/cn";
import { initials } from "@/lib/format";

/** Photo placeholder: dark initials on a neutral gray. Swap for an <img> when you have a photo. */
export function InitialsAvatar({
	name,
	size = 64,
	className,
}: {
	name: string;
	size?: number;
	className?: string;
}) {
	return (
		<span
			role="img"
			aria-label={name}
			className={cn(
				"inline-flex shrink-0 items-center justify-center rounded-full bg-avatar font-semibold text-avatar-foreground tracking-tight ring-4 ring-card/60 dark:ring-foreground/10",
				className,
			)}
			style={{
				width: size,
				height: size,
				fontSize: size * 0.36,
			}}
		>
			{initials(name)}
		</span>
	);
}
