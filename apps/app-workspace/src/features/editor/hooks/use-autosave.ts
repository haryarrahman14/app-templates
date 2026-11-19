import { useCallback, useEffect, useRef, useState } from "react";
import { useUpdateDoc } from "@/features/documents/api/mutations";
import type { Block } from "@/features/documents/schemas/document";

export type SaveStatus = "saved" | "editing" | "saving" | "error";

/** Saves title and blocks 700 ms after the last edit, on ⌘S, and when leaving the page. */
export function useAutosave(docId: string, title: string, blocks: Block[]) {
	const { mutate } = useUpdateDoc();
	const [status, setStatus] = useState<SaveStatus>("saved");
	const latest = useRef({ title, blocks });
	const dirty = useRef(false);
	const initial = useRef({ title, blocks });

	const save = useCallback(() => {
		if (!dirty.current) return;
		dirty.current = false;
		setStatus("saving");
		mutate(
			{ id: docId, patch: latest.current },
			{
				onSuccess: () => {
					if (!dirty.current) setStatus("saved");
				},
				onError: () => {
					dirty.current = true;
					setStatus("error");
				},
			},
		);
	}, [docId, mutate]);

	useEffect(() => {
		latest.current = { title, blocks };
		// Nothing typed yet (also keeps React's dev double-effects from saving on load).
		if (title === initial.current.title && blocks === initial.current.blocks) return;
		dirty.current = true;
		setStatus("editing");
		const timer = setTimeout(save, 700);
		return () => clearTimeout(timer);
	}, [title, blocks, save]);

	// Flush on unmount so navigating away never loses the last keystrokes.
	useEffect(() => () => save(), [save]);

	useEffect(() => {
		const onKey = (event: KeyboardEvent) => {
			if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
				event.preventDefault();
				save();
				if (!dirty.current) setStatus((s) => (s === "editing" ? "saving" : s));
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [save]);

	return status;
}
