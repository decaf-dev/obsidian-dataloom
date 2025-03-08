<script lang="ts">
	import Input from "../input/input.svelte";
	import { MenuContent, MenuRoot, MenuTrigger } from "../menu";

	interface BodyContentProps {
		cellId: string;
		value: string;
		onCellInput: (cellId: string, value: string) => void;
	}

	const { cellId, value, onCellInput }: BodyContentProps = $props();

	let isEditing = $state(false);

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === "Enter") {
			isEditing = false;
		}
	}
</script>

<div class="dataloom-body-content">
	<MenuRoot>
		<MenuTrigger class="dataloom-cell-menu-trigger">
			{value}
		</MenuTrigger>
		<MenuContent>
			<div class="dataloom-cell-menu-input-container">
				<Input
					class="dataloom-cell-menu-input"
					placeholder="Enter a value"
					variant="unstyled"
					autoFocus
					{value}
					onInput={(value) => onCellInput(cellId, value)}
					onKeyDown={handleKeyDown}
				/>
			</div>
		</MenuContent>
	</MenuRoot>
</div>

<style>
	.dataloom-body-content {
		display: flex;
		width: 100%;
		height: 100%;
		min-height: var(--dataloom-cell-min-height);
		width: 140px;
		overflow: hidden;
		text-wrap: nowrap;
	}

	:global(.dataloom-cell-menu-trigger) {
		width: 100%;
		height: 100%;
		padding: var(--dataloom-cell-spacing-x) var(--dataloom-cell-spacing-y);
	}

	:global(.dataloom-cell-menu-trigger:hover) {
		background-color: transparent !important;
	}

	.dataloom-cell-menu-input-container {
		padding: var(--dataloom-cell-spacing-x) var(--dataloom-cell-spacing-y);
	}
</style>
