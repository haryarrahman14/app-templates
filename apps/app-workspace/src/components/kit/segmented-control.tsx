import { cn } from "@repo/ui/lib/cn";
import type { LucideIcon } from "lucide-react";
import { useId } from "react";
import { RadioCards } from "@/components/kit/radio-cards";

/** A pill-shaped single choice (native radios), e.g. grid/list or text width. */
export function SegmentedControl<T extends string>({
	value,
	onValueChange,
	options,
	label,
	className,
	iconOnly = false,
}: {
	value: T;
	onValueChange: (value: T) => void;
	options: { value: T; label: string; icon?: LucideIcon }[];
	label: string;
	className?: string;
	iconOnly?: boolean;
}) {
	const name = useId();
	return (
		<RadioCards
			name={name}
			label={label}
			value={value}
			onValueChange={onValueChange}
			options={options}
			className={cn("inline-flex items-center gap-0.5 rounded-lg bg-muted p-0.5", className)}
			itemClassName="flex-1 rounded-md"
			renderItem={(option, checked) => {
				const Icon = options.find((o) => o.value === option.value)?.icon;
				return (
					<span
						title={iconOnly ? option.label : undefined}
						className={cn(
							"inline-flex h-7 w-full items-center justify-center gap-1.5 rounded-md px-2.5 font-medium text-muted-foreground text-xs transition-colors hover:text-foreground",
							checked && "bg-background text-foreground shadow-soft",
						)}
					>
						{Icon ? <Icon className="size-3.5" /> : null}
						{iconOnly ? null : option.label}
					</span>
				);
			}}
		/>
	);
}
