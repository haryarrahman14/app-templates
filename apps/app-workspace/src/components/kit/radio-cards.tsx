import { cn } from "@repo/ui/lib/cn";
import type { ReactNode } from "react";

/**
 * A group of native radio inputs styled as cards, swatches or pills. Native radios give arrow-key
 * navigation and form semantics for free; `renderItem` draws each option.
 */
export function RadioCards<T extends string>({
	name,
	label,
	value,
	onValueChange,
	options,
	renderItem,
	className,
	itemClassName,
}: {
	name: string;
	label: string;
	value: T | undefined;
	onValueChange: (value: T) => void;
	options: { value: T; label: string }[];
	renderItem: (option: { value: T; label: string }, checked: boolean) => ReactNode;
	className?: string;
	itemClassName?: string;
}) {
	return (
		<fieldset className={className}>
			<legend className="sr-only">{label}</legend>
			{options.map((option) => {
				const checked = option.value === value;
				return (
					<label
						key={option.value}
						className={cn(
							"cursor-pointer outline-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring",
							itemClassName,
						)}
					>
						<input
							type="radio"
							name={name}
							value={option.value}
							checked={checked}
							onChange={() => onValueChange(option.value)}
							aria-label={option.label}
							className="sr-only"
						/>
						{renderItem(option, checked)}
					</label>
				);
			})}
		</fieldset>
	);
}
