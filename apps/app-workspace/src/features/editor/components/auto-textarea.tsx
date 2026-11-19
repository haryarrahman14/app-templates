import { cn } from "@repo/ui/lib/cn";
import { type ComponentProps, useLayoutEffect, useRef } from "react";

/** A borderless textarea that grows with its content (CSS field-sizing, JS fallback). */
export function AutoTextarea({
	className,
	value,
	elementRef,
	...props
}: ComponentProps<"textarea"> & {
	value: string;
	elementRef?: (element: HTMLTextAreaElement | null) => void;
}) {
	const inner = useRef<HTMLTextAreaElement | null>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: re-measure whenever the text changes.
	useLayoutEffect(() => {
		const element = inner.current;
		if (!element || CSS.supports("field-sizing", "content")) return;
		element.style.height = "0px";
		element.style.height = `${element.scrollHeight}px`;
	}, [value]);

	return (
		<textarea
			ref={(element) => {
				inner.current = element;
				elementRef?.(element);
			}}
			rows={1}
			value={value}
			className={cn(
				"block-input block w-full bg-transparent outline-none placeholder:text-muted-foreground/50",
				className,
			)}
			{...props}
		/>
	);
}
