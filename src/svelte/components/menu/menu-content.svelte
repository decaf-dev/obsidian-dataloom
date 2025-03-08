<script lang="ts">
	import { type Snippet } from "svelte";
	import MenuStore from "./menu-store";
	import { shiftMenuByDirection, shiftMenuIntoView } from "./menu-utils";
	import { getMenuIdContext, getMenuStateContext } from "./menu.svelte";

	interface MenuContentProps {
		width?: string;
		height?: string;
		children: Snippet;
	}

	const { width, height, children }: MenuContentProps = $props();

	const menuStore = MenuStore.getInstance();
	const openMenus = menuStore.openMenus;

	const id = getMenuIdContext();
	const menuState = getMenuStateContext();

	let position = $derived(menuState.position);
	let positionWithDirection = $derived(
		shiftMenuByDirection(position, 0, 0, menuState.direction),
	);
	let shiftedPosition = $derived(shiftMenuIntoView(positionWithDirection));

	let isOpen = $derived($openMenus.find((menu) => menu.id === id));

	function portal(node: HTMLElement, { target = document.body } = {}) {
		$effect(() => {
			target.appendChild(node);
			return () => {
				if (node.parentNode) {
					node.parentNode.removeChild(node);
				}
			};
		});
	}
</script>

{#if isOpen}
	<div
		class="dataloom-menu-content"
		data-id={id}
		style:left="{shiftedPosition.left}px"
		style:top="{shiftedPosition.top}px"
		style:width={width ? width : `${position.width}px`}
		style:height={height ? height : `${position.height}px`}
		use:portal
	>
		{@render children()}
	</div>
{/if}

<style>
	.dataloom-menu-content {
		position: absolute;
		z-index: var(--layer-menu);
		overflow: hidden;
		background-color: var(--background-primary);
		font-weight: 400;
		box-shadow: 0px 0px 0px 2px var(--background-modifier-border);
	}
</style>
