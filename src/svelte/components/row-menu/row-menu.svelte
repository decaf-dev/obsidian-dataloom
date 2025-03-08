<script lang="ts">
	import Icon from "../icon/icon.svelte";
	import { MenuContent, MenuRoot, MenuTrigger } from "../menu";
	import MenuItem from "../menu-item/menu-item.svelte";

	interface RowMenuProps {
		rowId: string;
		onDeleteClick: (rowId: string) => void;
	}

	const { rowId, onDeleteClick }: RowMenuProps = $props();
</script>

<MenuRoot>
	<MenuTrigger class="row-menu-trigger" direction="bottom-right">
		<Icon lucideId="grip-vertical" />
	</MenuTrigger>
	<MenuContent width="fit-content" height="fit-content">
		<MenuItem
			name="Delete"
			lucideId="trash"
			onClick={() => onDeleteClick(rowId)}
		/>
	</MenuContent>
</MenuRoot>

<style>
	:global(.row-menu-trigger) {
		border-radius: var(--button-radius);
		padding: 6px;
	}
</style>
