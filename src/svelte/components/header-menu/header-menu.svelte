<script lang="ts">
	import Input from "../input/input.svelte";
	import { MenuContent, MenuRoot, MenuTrigger } from "../menu";
	import MenuItem from "../menu-item/menu-item.svelte";
	import MenuStore from "../menu/menu-store";
	import Padding from "../padding/padding.svelte";
	import Stack from "../stack/stack.svelte";

	interface HeaderMenuProps {
		columnId: string;
		columnName: string;
		onDeleteClick: (columnId: string) => void;
		onColumnNameChange: (columnId: string, value: string) => void;
	}

	const {
		columnId,
		columnName,
		onColumnNameChange,
		onDeleteClick,
	}: HeaderMenuProps = $props();

	const menuStore = MenuStore.getInstance();

	function handleEnterPress(event: KeyboardEvent) {
		if (event.key === "Enter") {
			menuStore.closeTop();
		}
	}

	$effect(() => {
		document.addEventListener("keydown", handleEnterPress);

		return () => {
			document.removeEventListener("keydown", handleEnterPress);
		};
	});
</script>

<MenuRoot>
	<MenuTrigger class="dataloom-header-menu-trigger">
		{columnName}
	</MenuTrigger>
	<MenuContent width="fit-content" height="fit-content">
		<Stack spacing="sm" width="100%">
			<Padding px="md" py="sm">
				<Input
					autoFocus
					value={columnName}
					onInput={(value) => onColumnNameChange(columnId, value)}
				/>
			</Padding>
			<MenuItem
				name="Delete"
				lucideId="trash"
				onClick={() => onDeleteClick(columnId)}
			/>
		</Stack>
	</MenuContent>
</MenuRoot>

<style>
	:global(.dataloom-header-menu-trigger) {
		display: flex;
		align-items: center;
		height: 100%;
		width: 140px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		box-sizing: border-box;
		padding: var(--dataloom-cell-spacing-x) var(--dataloom-cell-spacing-y);
	}
</style>
