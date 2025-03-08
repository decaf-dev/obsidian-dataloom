<script lang="ts">
	import Icon from "../icon/icon.svelte";
	import { MenuContent, MenuRoot, MenuTrigger } from "../menu";
	import MenuItem from "../menu-item/menu-item.svelte";

	interface RowMenuProps {}

	const {}: RowMenuProps = $props();
</script>

<MenuRoot>
	<MenuTrigger class="row-menu-trigger" direction="bottom-right">
		<Icon lucideId="grip-vertical" />
	</MenuTrigger>
	<MenuContent>
		<MenuItem name="Delete" lucideId="trash" />
	</MenuContent>
</MenuRoot>

<style>
	:global(.row-menu-trigger) {
		border-radius: var(--button-radius);
		padding: 6px;
	}
</style>
