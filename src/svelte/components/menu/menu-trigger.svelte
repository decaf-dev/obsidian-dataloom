<script lang="ts">
	import clsx from "clsx";
	import Logger from "js-logger";
	import { getLoomStateContext } from "src/svelte/App.svelte";
	import { onMount, type Snippet } from "svelte";
	import MenuStore, { type MenuLevel } from "./menu-store.js";
	import {
		getMenuIdContext,
		getMenuStateContext,
		type MenuOpenDirection,
	} from "./menu.svelte";

	interface MenuTriggerProps {
		class?: string;
		direction?: MenuOpenDirection;
		ariaLabel?: string;
		isDisabled?: boolean;
		level?: MenuLevel;
		children: Snippet;
	}

	let {
		class: className,
		direction = "normal",
		ariaLabel,
		isDisabled,
		level = 1,
		children,
	}: MenuTriggerProps = $props();

	let ref: HTMLDivElement | undefined = $state(undefined);

	const menuStore = MenuStore.getInstance();
	const menuId = getMenuIdContext();
	const menuState = getMenuStateContext();

	function updatePosition() {
		if (ref) {
			const rect = ref.getBoundingClientRect();
			menuState.position = {
				top: rect.top,
				left: rect.left,
				width: rect.width,
				height: rect.height,
			};
		}
	}

	// function handleKeyDown(e: KeyboardEvent) {
	// 	Logger.trace("MenuTrigger handleKeyDown");

	// 	if (e.key === "Enter") {
	// 		e.stopPropagation();
	// 		onEnterDown?.();

	// 		//Stop click event from running
	// 		e.preventDefault();

	// 		//Is the trigger isn't active, return
	// 		// if (!isDisabled) {
	// 		// 	if (canOpen(level)) {
	// 		// 		const tag = (e.target as HTMLElement).tagName;
	// 		// 		if (tag === "A") return;
	// 		// 		onOpen();
	// 		// 		return;
	// 		// 	}
	// 		// }

	// 		// if (!topMenu) return;
	// 		// onRequestClose(topMenu?.id, "close-on-save");
	// 	} else if (e.key === "Backspace") {
	// 		//Stop propagation to the global event
	// 		//This prevents the focused from being lost
	// 		e.stopPropagation();
	// 		onBackspaceDown?.();
	// 	} else if (e.key.length === 1) {
	// 		// if (
	// 		// 	isWindowsRedoDown(e) ||
	// 		// 	isWindowsUndoDown(e) ||
	// 		// 	isMacRedoDown(e) ||
	// 		// 	isMacUndoDown(e)
	// 		// )
	// 		// 	return;
	// 		// //Unless the trigger is for a cell, don't open it when a user presses any key
	// 		// if (variant !== "cell") return;
	// 		// onOpen();
	// 	}
	// }

	function handleClick(event: MouseEvent) {
		Logger.trace("MenuTrigger handleClick");

		event.stopPropagation();

		if (isDisabled) return;

		if (menuStore.canOpen(level)) {
			// const tag = (e.target as HTMLElement).tagName;
			// if (tag === "A") return;

			menuState.direction = direction;
			menuStore.open({
				id: menuId,
				level,
			});
		} else {
			menuStore.closeTop();
		}
	}

	onMount(() => {
		updatePosition();
	});

	$effect(() => {
		const resizeObserver = new ResizeObserver(() => {
			updatePosition();
		});

		if (ref) {
			resizeObserver.observe(ref);
		}

		return () => {
			resizeObserver.disconnect();
		};
	});

	function findParentElement(
		element: HTMLElement,
		classList: string[],
	): HTMLElement | null {
		let currentElement: HTMLElement | null = element;

		while (currentElement) {
			for (const className of classList) {
				if (currentElement.classList.contains(className)) {
					return currentElement;
				}
			}

			currentElement = currentElement.parentElement;
		}

		return null;
	}

	$effect(() => {
		let element: HTMLElement | null = null;
		if (ref) {
			element = findParentElement(ref, ["el-table", "cm-table-widget"]);
			if (element) {
				element.addEventListener("scroll", updatePosition);
			}
		}
		return () => {
			if (element) {
				element.removeEventListener("scroll", updatePosition);
			}
		};
	});

	$effect(() => {
		let element: HTMLElement | null = null;
		if (ref) {
			element = findParentElement(ref, [
				"markdown-preview-view",
				"cm-scroller",
			]);
			if (element) {
				element.addEventListener("scroll", updatePosition);
			}
		}
		return () => {
			if (element) {
				element.removeEventListener("scroll", updatePosition);
			}
		};
	});

	const loomState = getLoomStateContext();
	$effect(() => {
		if (
			loomState.loomState.model.columns.length ||
			loomState.loomState.model.rows.length
		) {
			updatePosition();
		}
	});
</script>

<div
	bind:this={ref}
	class={clsx("dataloom-menu-trigger", className)}
	tabindex={0}
	role="button"
	aria-disabled={isDisabled}
	aria-label={ariaLabel}
	onclick={isDisabled ? undefined : handleClick}
	onkeydown={undefined}
>
	{@render children()}
</div>

<style>
	.dataloom-menu-trigger {
		user-select: none;
	}

	.dataloom-menu-trigger:hover {
		background-color: var(--background-modifier-hover);
	}
</style>
