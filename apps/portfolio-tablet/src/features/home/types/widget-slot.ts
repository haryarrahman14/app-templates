import type { ReactNode } from "react";

export type WidgetSize = "small" | "medium" | "large" | "wide";

/** One widget on the home grid. The array order passed to WidgetGrid is the default layout. */
export type WidgetSlot = {
	id: string;
	/** Used for the edit-mode handle and screen-reader announcements. */
	label: string;
	size: WidgetSize;
	node: ReactNode;
};
