import { Avatar, AvatarFallback } from "@repo/ui/components/avatar";
import { cn } from "@repo/ui/lib/cn";
import { initialsOf } from "@/lib/session";

/** Neutral gray initials, the same for everyone: avatars are never coloured. */
export const AVATAR_NEUTRAL = "bg-avatar text-avatar-foreground";

export function UserAvatar({
	name,
	size = "default",
	className,
}: {
	name: string;
	size?: "default" | "sm" | "lg";
	className?: string;
}) {
	return (
		<Avatar size={size} className={className}>
			<AvatarFallback className={cn("font-medium", AVATAR_NEUTRAL)}>
				{initialsOf(name)}
			</AvatarFallback>
		</Avatar>
	);
}
