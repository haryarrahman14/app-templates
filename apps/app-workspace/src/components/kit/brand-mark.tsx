import { cn } from "@repo/ui/lib/cn";
import { FeatherIcon } from "lucide-react";

/** The fictional product's mark: a feather on the accent colour. Replace with your logo. */
export function BrandMark({ className }: { className?: string }) {
	return (
		<span
			aria-hidden
			className={cn(
				"flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-soft",
				className,
			)}
		>
			<FeatherIcon className="size-4" />
		</span>
	);
}
