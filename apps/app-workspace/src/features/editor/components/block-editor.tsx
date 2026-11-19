import { cn } from "@repo/ui/lib/cn";
import {
	type Dispatch,
	type KeyboardEvent,
	type Ref,
	type SetStateAction,
	useImperativeHandle,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import type { Block, BlockType } from "@/features/documents/schemas/document";
import { BlockRow, type BlockRowActions } from "@/features/editor/components/block-row";
import { SlashMenu, slashOptions } from "@/features/editor/components/slash-menu";
import { MARKDOWN_SHORTCUTS } from "@/features/editor/constants/block-options";
import { isTextBlock, makeBlock, moveItem } from "@/features/editor/utils/blocks";

export type BlockEditorHandle = {
	focusFirst: () => void;
	focusBlock: (id: string) => void;
};

type Caret = number | "end";
type Slash = { blockId: string; query: string; index: number };

/**
 * A small block editor: each text block is an auto-growing textarea. Enter splits, Backspace at the
 * start merges or removes, "/" opens the block menu, markdown shortcuts convert, and blocks can be
 * dragged by their handle or moved with ⌥⇧↑ / ⌥⇧↓.
 */
export function BlockEditor({
	blocks,
	setBlocks,
	onExitTop,
	ref,
}: {
	blocks: Block[];
	setBlocks: Dispatch<SetStateAction<Block[]>>;
	onExitTop: () => void;
	ref?: Ref<BlockEditorHandle>;
}) {
	const nodes = useRef(new Map<string, HTMLElement>());
	const pendingFocus = useRef<{ id: string; caret: Caret } | null>(null);
	const [slash, setSlash] = useState<Slash | null>(null);
	const [drag, setDrag] = useState<{
		id: string;
		overId?: string;
		position?: "before" | "after";
	} | null>(null);

	const focusNow = (id: string, caret: Caret) => {
		const element = nodes.current.get(id);
		if (!element) return false;
		element.focus({ preventScroll: false });
		if (element instanceof HTMLTextAreaElement) {
			const position = caret === "end" ? element.value.length : caret;
			element.setSelectionRange(position, position);
		}
		return true;
	};
	const focusLater = (id: string, caret: Caret = "end") => {
		pendingFocus.current = { id, caret };
	};

	// Apply a requested focus after React has rendered the new blocks.
	useLayoutEffect(() => {
		const pending = pendingFocus.current;
		if (pending && focusNow(pending.id, pending.caret)) pendingFocus.current = null;
	});

	useImperativeHandle(ref, () => ({
		focusFirst: () => {
			const first = blocks[0];
			if (first) focusNow(first.id, 0);
			else {
				const block = makeBlock();
				setBlocks([block]);
				focusLater(block.id, 0);
			}
		},
		focusBlock: (id) => focusNow(id, 0),
	}));

	const update = (id: string, patch: Partial<Block>) => {
		setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
		// A new type renders a different element, so keep the caret in the block.
		if (patch.type && !pendingFocus.current) {
			const element = nodes.current.get(id);
			const caret = element instanceof HTMLTextAreaElement ? element.selectionStart : "end";
			focusLater(id, patch.text === "" ? 0 : caret);
		}
	};

	const insertAfter = (id: string, block: Block) =>
		setBlocks((prev) => {
			const index = prev.findIndex((b) => b.id === id);
			const next = [...prev];
			next.splice(index + 1, 0, block);
			return next;
		});

	const turnInto = (id: string, type: BlockType) => {
		const current = blocks.find((b) => b.id === id);
		if (!current) return;
		const text = current.text.startsWith("/") ? "" : current.text;
		update(id, {
			type,
			text: type === "divider" ? "" : text,
			checked: type === "todo" ? false : undefined,
		});
		setSlash(null);
		if (type === "divider") {
			const after = makeBlock();
			insertAfter(id, after);
			focusLater(after.id, 0);
		} else focusLater(id, "end");
	};

	const removeBlock = (id: string, focusPrevious = true) => {
		const index = blocks.findIndex((b) => b.id === id);
		const previous = blocks[index - 1];
		const following = blocks[index + 1];
		if (blocks.length === 1) {
			update(id, { type: "paragraph", text: "", checked: undefined });
			focusLater(id, 0);
			return;
		}
		setBlocks((prev) => prev.filter((b) => b.id !== id));
		const target = focusPrevious ? (previous ?? following) : (following ?? previous);
		if (target) focusLater(target.id, target === previous ? "end" : 0);
	};

	const move = (id: string, delta: number) => {
		const index = blocks.findIndex((b) => b.id === id);
		setBlocks((prev) => moveItem(prev, index, index + delta));
		focusLater(id, "end");
	};

	const pickSlash = (type: BlockType) => {
		if (slash) turnInto(slash.blockId, type);
	};

	const keyDown = (event: KeyboardEvent<HTMLElement>, block: Block) => {
		const index = blocks.findIndex((b) => b.id === block.id);
		const previous = blocks[index - 1];
		const next = blocks[index + 1];

		// The slash menu owns arrows, Enter and Escape while open.
		if (slash?.blockId === block.id) {
			const options = slashOptions(slash.query);
			if (event.key === "ArrowDown" || event.key === "ArrowUp") {
				event.preventDefault();
				const delta = event.key === "ArrowDown" ? 1 : -1;
				setSlash({
					...slash,
					index: (slash.index + delta + options.length) % Math.max(options.length, 1),
				});
				return;
			}
			if (event.key === "Enter") {
				event.preventDefault();
				const option = options[slash.index];
				if (option) pickSlash(option.type);
				else setSlash(null);
				return;
			}
			if (event.key === "Escape") {
				event.preventDefault();
				setSlash(null);
				return;
			}
		}

		if (event.altKey && event.shiftKey && (event.key === "ArrowUp" || event.key === "ArrowDown")) {
			event.preventDefault();
			move(block.id, event.key === "ArrowUp" ? -1 : 1);
			return;
		}

		// Divider and image blocks: Backspace/Delete removes, Enter adds a paragraph below.
		if (!isTextBlock(block.type)) {
			if (event.key === "Backspace" || event.key === "Delete") {
				event.preventDefault();
				removeBlock(block.id);
			} else if (event.key === "Enter") {
				event.preventDefault();
				const after = makeBlock();
				insertAfter(block.id, after);
				focusLater(after.id, 0);
			} else if (event.key === "ArrowUp" && previous) {
				event.preventDefault();
				focusNow(previous.id, "end");
			} else if (event.key === "ArrowDown" && next) {
				event.preventDefault();
				focusNow(next.id, 0);
			}
			return;
		}

		const target = event.currentTarget as HTMLTextAreaElement;
		const { selectionStart, selectionEnd, value } = target;
		const atStart = selectionStart === 0 && selectionEnd === 0;

		if ((event.metaKey || event.ctrlKey) && event.key === "Enter" && block.type === "todo") {
			event.preventDefault();
			update(block.id, { checked: !block.checked });
			return;
		}

		if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
			event.preventDefault();
			const continues = block.type === "bullet" || block.type === "todo";
			if (continues && value.length === 0) {
				update(block.id, { type: "paragraph", checked: undefined });
				return;
			}
			const before = value.slice(0, selectionStart);
			const after = value.slice(selectionEnd);
			const created = makeBlock(continues ? block.type : "paragraph", after);
			setBlocks((prev) => {
				const i = prev.findIndex((b) => b.id === block.id);
				const copy = prev.map((b) => (b.id === block.id ? { ...b, text: before } : b));
				copy.splice(i + 1, 0, created);
				return copy;
			});
			focusLater(created.id, 0);
			return;
		}

		if (event.key === "Backspace" && atStart) {
			if (block.type !== "paragraph") {
				event.preventDefault();
				update(block.id, { type: "paragraph", checked: undefined });
				focusLater(block.id, 0);
				return;
			}
			if (!previous) {
				if (value.length === 0 && blocks.length > 1) {
					event.preventDefault();
					removeBlock(block.id, false);
				} else if (value.length === 0) {
					event.preventDefault();
					onExitTop();
				}
				return;
			}
			event.preventDefault();
			if (!isTextBlock(previous.type)) {
				setBlocks((prev) => prev.filter((b) => b.id !== previous.id));
				focusLater(block.id, 0);
				return;
			}
			if (value.length === 0) {
				removeBlock(block.id);
				return;
			}
			const caret = previous.text.length;
			setBlocks((prev) =>
				prev
					.map((b) => (b.id === previous.id ? { ...b, text: b.text + value } : b))
					.filter((b) => b.id !== block.id),
			);
			focusLater(previous.id, caret);
			return;
		}

		if (event.key === "ArrowUp" && selectionStart === 0) {
			event.preventDefault();
			if (previous) focusNow(previous.id, "end");
			else onExitTop();
			return;
		}
		if (event.key === "ArrowDown" && selectionEnd === value.length && next) {
			event.preventDefault();
			focusNow(next.id, 0);
		}
	};

	const change = (block: Block, text: string) => {
		if (block.type === "paragraph") {
			const shortcut = Object.entries(MARKDOWN_SHORTCUTS).find(([prefix]) => text === prefix);
			if (shortcut) {
				update(block.id, {
					type: shortcut[1],
					text: "",
					checked: shortcut[1] === "todo" ? false : undefined,
				});
				return;
			}
			if (text === "---") {
				turnInto(block.id, "divider");
				return;
			}
			if (text.startsWith("/") && !text.includes(" ") && text.length <= 16) {
				setSlash({ blockId: block.id, query: text.slice(1), index: 0 });
			} else if (slash?.blockId === block.id) {
				setSlash(null);
			}
		}
		update(block.id, { text });
	};

	const actions: BlockRowActions = {
		register: (id, element) => {
			if (element) nodes.current.set(id, element);
			else nodes.current.delete(id);
		},
		change,
		toggle: (id, checked) => update(id, { checked }),
		keyDown,
		insertAfter: (id, type) => {
			const created = makeBlock(type);
			insertAfter(id, created);
			if (type === "divider") {
				const paragraph = makeBlock();
				insertAfter(created.id, paragraph);
				focusLater(paragraph.id, 0);
			} else focusLater(created.id, 0);
		},
		turnInto,
		move,
		duplicate: (id) => {
			const source = blocks.find((b) => b.id === id);
			if (!source) return;
			const copy = { ...source, id: makeBlock().id };
			insertAfter(id, copy);
			focusLater(copy.id, "end");
		},
		remove: (id) => removeBlock(id),
		dragStart: (id) => setDrag({ id }),
		dragOver: (id, position) =>
			setDrag((current) =>
				current && (current.overId !== id || current.position !== position)
					? { ...current, overId: id, position }
					: current,
			),
		drop: () => {
			if (!drag?.overId || drag.overId === drag.id) {
				setDrag(null);
				return;
			}
			setBlocks((prev) => {
				const from = prev.findIndex((b) => b.id === drag.id);
				const moving = prev[from];
				if (!moving) return prev;
				const without = prev.filter((b) => b.id !== drag.id);
				const targetIndex = without.findIndex((b) => b.id === drag.overId);
				without.splice(drag.position === "after" ? targetIndex + 1 : targetIndex, 0, moving);
				return without;
			});
			setDrag(null);
		},
		dragEnd: () => setDrag(null),
		blur: (id) => {
			if (slash?.blockId === id)
				setTimeout(() => setSlash((s) => (s?.blockId === id ? null : s)), 150);
		},
	};

	return (
		<div className={cn("pb-32")}>
			{blocks.map((block, index) => (
				<BlockRow
					key={block.id}
					block={block}
					index={index}
					total={blocks.length}
					actions={actions}
					isDragging={drag?.id === block.id}
					dropIndicator={
						drag && drag.overId === block.id && drag.id !== block.id
							? (drag.position ?? null)
							: null
					}
				>
					{slash?.blockId === block.id ? (
						<SlashMenu
							query={slash.query}
							activeIndex={slash.index}
							onHover={(i) => setSlash({ ...slash, index: i })}
							onPick={pickSlash}
						/>
					) : null}
				</BlockRow>
			))}
			<button
				type="button"
				aria-label="Add a block at the end"
				onClick={() => {
					const last = blocks.at(-1);
					if (last && isTextBlock(last.type) && last.text === "") {
						focusNow(last.id, 0);
						return;
					}
					const created = makeBlock();
					setBlocks((prev) => [...prev, created]);
					focusLater(created.id, 0);
				}}
				className="mt-2 block h-24 w-full cursor-text rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
			/>
		</div>
	);
}
