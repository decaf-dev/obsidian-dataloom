<script lang="ts">
	import { type Snippet } from "svelte";
	import MenuStore from "./menu-store";
	import { getMenuIdContext, getMenuStateContext } from "./menu.svelte";

	interface MenuContentProps {
		children: Snippet;
	}

	const { children }: MenuContentProps = $props();

	const menuStore = MenuStore.getInstance();
	const openMenus = menuStore.openMenus;

	const id = getMenuIdContext();
	const menuState = getMenuStateContext();

	let position = $derived(menuState.position);
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
		style:left="{position.left}px"
		style:top="{position.top}px"
		style:width="{position.width}px"
		style:height="{position.height}px"
		use:portal
	>
		{@render children()}
	</div>
{/if}

<style>
	.dataloom-menu-content {
		position: absolute;
		z-index: var(--layer-menu);
		background-color: var(--background-primary);
		font-weight: 400;
		box-shadow: 0px 0px 0px 2px var(--background-modifier-border);
	}
</style>
