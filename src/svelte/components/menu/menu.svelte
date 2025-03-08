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

	import { getContext, setContext, type Snippet } from "svelte";
	import { createMenuState } from "./menu-state.svelte";

	interface MenuProps {
		children: Snippet;
	}

	const { children }: MenuProps = $props();

	let menuId = generateUuid();
	setContext(MENU_ID_KEY, menuId);

	let menuState = createMenuState();
	setContext(MENU_STATE_KEY, menuState);
</script>

<div class="dataloom-menu-new">
	{@render children()}
</div>
