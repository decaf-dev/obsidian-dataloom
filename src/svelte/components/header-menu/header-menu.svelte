<script lang="ts">
	import { onMount, type Snippet } from "svelte";
	import { MenuContent, MenuRoot, MenuTrigger } from "../menu";
	import MenuItem from "../menu-item/menu-item.svelte";
	import Padding from "../padding/padding.svelte";
	import Stack from "../stack/stack.svelte";

	interface HeaderMenuProps {
		columnId: string;
		children: Snippet;
		onDeleteClick: (columnId: string) => void;
	}

	const { columnId, children, onDeleteClick }: HeaderMenuProps = $props();

	let inputRef: HTMLInputElement | undefined = undefined;

	onMount(() => {
		if (inputRef) {
			inputRef.focus();
		}
	});
</script>

<MenuRoot>
	<MenuTrigger class="dataloom-header-menu-trigger">
		{@render children()}
	</MenuTrigger>
	<MenuContent>
		<Stack spacing="sm" width="100%">
			<Padding px="md" py="sm">
				<input type="text" bind:this={inputRef} />
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
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		box-sizing: border-box;
	}
</style>
