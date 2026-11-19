import { toast } from "@repo/ui/components/sonner";
import { useCallback } from "react";
import type { AppId } from "@/lib/apps";
import { appHref } from "@/lib/phone-nav";

/** Copies a deep link to the clipboard (or uses the system share sheet on phones). */
export function useShareLink() {
	return useCallback(async (title: string, app: AppId, id?: string) => {
		const url = appHref(app, id);
		try {
			if (navigator.share && matchMedia("(pointer: coarse)").matches) {
				await navigator.share({ title, url });
				return;
			}
			await navigator.clipboard.writeText(url);
			toast.success("Link copied", { description: url.replace(/^https?:\/\//, "") });
		} catch (error) {
			if (error instanceof DOMException && error.name === "AbortError") return;
			toast("Share this link", { description: url });
		}
	}, []);
}
