import { Toaster } from "@repo/ui/components/sonner";
import { TooltipProvider } from "@repo/ui/components/tooltip";
import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/** App-wide providers inside the root route (the QueryClient comes from the router context). */
export function Providers({ children }: { children: ReactNode }) {
	return (
		<MotionConfig reducedMotion="user">
			<TooltipProvider delayDuration={250}>
				{children}
				<Toaster position="top-center" />
			</TooltipProvider>
		</MotionConfig>
	);
}
