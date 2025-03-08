<script lang="ts" module>
	export interface MenuPosition {
		top: number;
		left: number;
		width: number;
		height: number;
	}

	export interface MenuState {
		position: MenuPosition;
		direction: MenuOpenDirection;
	}

	export type MenuOpenDirection =
		| "normal"
		| "bottom-left"
		| "bottom-right"
		| "bottom"
		| "left"
		| "right";

	const MENU_ID_KEY = "menu-id";
	const MENU_STATE_KEY = "menu-state";

	export const getMenuIdContext = () => getContext(MENU_ID_KEY) as string;
	export const getMenuStateContext = () =>
		getContext(MENU_STATE_KEY) as MenuState;
</script>

<script lang="ts">
	import { generateUuid } from "src/shared/uuid";

	import { getContext, onDestroy, setContext, type Snippet } from "svelte";
	import { createMenuState } from "./menu-state.svelte";
	import MenuStore from "./menu-store";

	interface MenuProps {
		children: Snippet;
	}

	const { children }: MenuProps = $props();

	const menuStore = MenuStore.getInstance();

	let menuId = generateUuid();
	setContext(MENU_ID_KEY, menuId);

	let menuState = createMenuState();
	setContext(MENU_STATE_KEY, menuState);

	onDestroy(() => {
		menuStore.close(menuId);
	});
</script>

<div class="dataloom-menu-root">
	{@render children()}
</div>

<style>
	.dataloom-menu-root {
		display: contents;
	}
</style>
