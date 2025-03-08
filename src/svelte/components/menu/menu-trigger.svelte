<script lang="ts">
	import Logger from "js-logger";
	import { onMount, type Snippet } from "svelte";
	import MenuStore, { type MenuLevel } from "./menu-store.js";
	import { getMenuIdContext, getMenuStateContext } from "./menu.svelte";

	interface MenuTriggerProps {
		ariaLabel?: string;
		isDisabled?: boolean;
		level?: MenuLevel;
		children: Snippet;
	}

	let {
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

		return () => {
			resizeObserver.disconnect();
		};
	});
</script>

<div
	bind:this={ref}
	class="dataloom-menu-trigger"
	tabindex={0}
	role="button"
	aria-disabled={isDisabled}
	aria-label={ariaLabel}
	onkeydown={() => {}}
	onclick={isDisabled ? undefined : handleClick}
>
	{@render children()}
</div>

<style>
	.dataloom-menu-trigger {
		cursor: default;
		user-select: none;
	}

	.dataloom-menu-trigger:hover {
		background-color: var(--background-modifier-hover);
	}
</style>
